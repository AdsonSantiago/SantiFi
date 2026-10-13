from datetime import date, timedelta
from decimal import Decimal
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from django.conf import settings
from django.db.models import Q, Sum
from django.db.models.functions import TruncDay, TruncMonth
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from apps.core.enums.tipo_movimento import TipoMovimento
from apps.core.enums.tipo_planejamento import TipoPlanejamento
from apps.core.enums.tipo_status import Status
from apps.financeiro.models import Conta, Movimento, PlanejamentoFinanceiro


class DashboardQuery:
    PERIODOS = ("month", "previous", "year")

    @staticmethod
    def intervalo_periodo(usuario, periodo):
        if periodo not in DashboardQuery.PERIODOS:
            raise ValidationError(
                {"periodo": "Use 'month', 'previous' ou 'year'."}
            )

        try:
            tzinfo = ZoneInfo(usuario.timezone)
        except (AttributeError, ValueError, ZoneInfoNotFoundError):
            tzinfo = ZoneInfo(settings.TIME_ZONE)

        hoje = timezone.localdate(timezone=tzinfo)
        inicio_mes = date(hoje.year, hoje.month, 1)

        if periodo == "month":
            return inicio_mes, hoje

        if periodo == "previous":
            fim_mes_anterior = inicio_mes - timedelta(days=1)
            inicio_mes_anterior = date(
                fim_mes_anterior.year,
                fim_mes_anterior.month,
                1,
            )
            return inicio_mes_anterior, fim_mes_anterior

        return date(hoje.year, 1, 1), hoje

    @staticmethod
    def saldo_total(usuario):
        saldo = Decimal("0.00")
        contas = Conta.objects.filter(usuario=usuario, ativo=True)
        for conta in contas:
            saldo += conta.saldo_atual
        return saldo

    @staticmethod
    def totais_movimentos(usuario, inicio, fim):
        totais = Movimento.objects.filter(
            usuario=usuario,
            data_movimento__range=(inicio, fim),
            transferencia__isnull=True,
        ).aggregate(
            receitas=Sum("valor", filter=Q(tipo=TipoMovimento.RECEITA)),
            despesas=Sum("valor", filter=Q(tipo=TipoMovimento.DESPESA)),
        )
        return (
            totais["receitas"] or Decimal("0.00"),
            totais["despesas"] or Decimal("0.00"),
        )

    @staticmethod
    def totais_planejados(usuario, inicio, fim):
        planejados = PlanejamentoFinanceiro.objects.filter(
            usuario=usuario,
            status=Status.PENDENTE,
            data_prevista__range=(inicio, fim),
        ).aggregate(
            receber=Sum("valor", filter=Q(tipo=TipoPlanejamento.RECEITA)),
            pagar=Sum("valor", filter=Q(tipo=TipoPlanejamento.DESPESA)),
        )
        return (
            planejados["receber"] or Decimal("0.00"),
            planejados["pagar"] or Decimal("0.00"),
        )

    @staticmethod
    def evolucao(usuario, periodo, inicio, fim):
        truncar = TruncMonth if periodo == "year" else TruncDay
        agregados = (
            Movimento.objects.filter(
                usuario=usuario,
                data_movimento__range=(inicio, fim),
                transferencia__isnull=True,
            )
            .annotate(bucket=truncar("data_movimento"))
            .values("bucket")
            .annotate(
                receitas=Sum("valor", filter=Q(tipo=TipoMovimento.RECEITA)),
                despesas=Sum("valor", filter=Q(tipo=TipoMovimento.DESPESA)),
            )
            .order_by("bucket")
        )

        valores_por_bucket = {}
        for item in agregados:
            bucket = item["bucket"]
            chave = bucket.strftime("%Y-%m" if periodo == "year" else "%Y-%m-%d")
            valores_por_bucket[chave] = item

        chaves = []
        if periodo == "year":
            for mes in range(1, fim.month + 1):
                chaves.append(f"{fim.year}-{mes:02d}")
        else:
            cursor = inicio
            while cursor <= fim:
                chaves.append(cursor.isoformat())
                cursor += timedelta(days=1)

        return [
            {
                "data": chave,
                "receitas": valores_por_bucket.get(chave, {}).get(
                    "receitas"
                ) or Decimal("0.00"),
                "despesas": valores_por_bucket.get(chave, {}).get(
                    "despesas"
                ) or Decimal("0.00"),
            }
            for chave in chaves
        ]

    @staticmethod
    def movimentos_recentes(usuario, inicio, fim):
        return Movimento.objects.filter(
            usuario=usuario,
            data_movimento__range=(inicio, fim),
        ).select_related(
            "conta",
            "categoria",
        ).order_by("-data_movimento", "-criado_em")[:5]
