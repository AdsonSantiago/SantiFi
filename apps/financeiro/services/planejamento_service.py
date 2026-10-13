from datetime import timedelta

from dateutil.relativedelta import relativedelta
from django.db import transaction

from apps.core.enums.tipo_planejamento import TipoRecorrencia
from apps.core.enums.tipo_status import Status
from apps.core.exceptions import PlanejamentoException
from apps.financeiro.models import Movimento, PlanejamentoFinanceiro
from apps.financeiro.services.movimento_service import MovimentoService


class PlanejamentoService:
    @staticmethod
    def _calcular_proxima_data(planejamento):
        data = planejamento.data_prevista
        recorrencia = planejamento.recorrencia

        if recorrencia == TipoRecorrencia.DIARIA:
            return data + timedelta(days=1)
        if recorrencia == TipoRecorrencia.SEMANAL:
            return data + timedelta(weeks=1)
        if recorrencia == TipoRecorrencia.QUINZENAL:
            return data + timedelta(days=15)
        if recorrencia == TipoRecorrencia.MENSAL:
            return data + relativedelta(months=1)
        if recorrencia == TipoRecorrencia.ANUAL:
            return data + relativedelta(years=1)

        return None

    @staticmethod
    def _criar_proximo(planejamento, *, data_prevista, parcela_atual,
                       parcelado, recorrencia):
        return PlanejamentoFinanceiro.objects.create(
            usuario=planejamento.usuario,
            conta=planejamento.conta,
            categoria=planejamento.categoria,
            tipo=planejamento.tipo,
            descricao=planejamento.descricao,
            valor=planejamento.valor,
            data_prevista=data_prevista,
            status=Status.PENDENTE,
            recorrencia=recorrencia,
            prioridade=planejamento.prioridade,
            parcelado=parcelado,
            parcela_atual=parcela_atual,
            total_parcelas=planejamento.total_parcelas if parcelado else 1,
            observacao=planejamento.observacao,
        )

    @staticmethod
    def _gerar_proxima_recorrencia(planejamento):
        if planejamento.recorrencia == TipoRecorrencia.NENHUMA:
            return None

        data = PlanejamentoService._calcular_proxima_data(planejamento)
        if data is None:
            return None

        return PlanejamentoService._criar_proximo(
            planejamento,
            data_prevista=data,
            parcela_atual=1,
            parcelado=False,
            recorrencia=planejamento.recorrencia,
        )

    @staticmethod
    def _gerar_proxima_parcela(planejamento):
        if not planejamento.parcelado:
            return None
        if planejamento.parcela_atual >= planejamento.total_parcelas:
            return None

        return PlanejamentoService._criar_proximo(
            planejamento,
            data_prevista=planejamento.data_prevista + relativedelta(months=1),
            parcela_atual=planejamento.parcela_atual + 1,
            parcelado=True,
            recorrencia=TipoRecorrencia.NENHUMA,
        )

    @staticmethod
    @transaction.atomic
    def marcar_como_pago(planejamento, data_pagamento=None):
        # Recarregar e bloquear a linha evita pagamento duplicado em requisições
        # concorrentes, mantendo a operação e a criação do movimento atômicas.
        planejamento = PlanejamentoFinanceiro.objects.select_for_update().get(
            pk=planejamento.pk
        )
        PlanejamentoService._validar_pagamento(planejamento)

        movimento = PlanejamentoService._criar_movimento(
            planejamento,
            data_pagamento=data_pagamento,
        )
        PlanejamentoService._atualizar_status(planejamento, movimento)
        PlanejamentoService._gerar_proxima_recorrencia(planejamento)
        PlanejamentoService._gerar_proxima_parcela(planejamento)

        return movimento

    @staticmethod
    def _validar_pagamento(planejamento):
        if planejamento.status == Status.PAGO:
            raise PlanejamentoException("Este planejamento já foi pago.")
        if planejamento.status == Status.CANCELADO:
            raise PlanejamentoException("Este planejamento foi cancelado.")
        if planejamento.status != Status.PENDENTE:
            raise PlanejamentoException("O status deste planejamento é inválido.")

    @staticmethod
    def _criar_movimento(planejamento, *, data_pagamento=None):
        return MovimentoService.criar_movimento(
            usuario=planejamento.usuario,
            conta=planejamento.conta,
            categoria=planejamento.categoria,
            tipo=planejamento.tipo,
            descricao=planejamento.descricao,
            valor=planejamento.valor,
            data_movimento=data_pagamento or planejamento.data_prevista,
            observacao=planejamento.observacao,
        )

    @staticmethod
    def _atualizar_status(planejamento, movimento):
        planejamento.status = Status.PAGO
        planejamento.movimento = movimento
        planejamento.save(
            update_fields=["status", "movimento", "atualizado_em"]
        )
