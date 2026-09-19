from django.db import transaction

from apps.core.enums.tipo_categoria import TipoCategoria
from apps.core.enums.tipo_movimento import TipoMovimento
from apps.core.exceptions.transferencia import TransferenciaException
from apps.financeiro.models import Categoria, Transferencia
from apps.financeiro.services.movimento_service import MovimentoService


class TransferenciaService:

    @staticmethod
    @transaction.atomic
    def transferir(
        *,
        usuario,
        conta_origem,
        conta_destino,
        valor,
        data_transferencia,
        observacao=None,
    ):
        if conta_origem == conta_destino:
            raise TransferenciaException(
                "A conta de origem deve ser diferente da conta destino."
            )

        if valor <= 0:
            raise TransferenciaException(
                "O valor deve ser maior que zero."
            )

        if not conta_origem.ativo:
            raise TransferenciaException(
                "A conta de origem está inativa."
            )

        if not conta_destino.ativo:
            raise TransferenciaException(
                "A conta de destino está inativa."
            )

        categoria = Categoria.objects.filter(
            usuario=usuario,
            tipo=TipoCategoria.TRANSFERENCIA,
            ativo=True,
        ).first()

        if categoria is None:
            raise TransferenciaException(
                "Nenhuma categoria de transferência ativa foi encontrada."
            )

        transferencia = Transferencia.objects.create(
            usuario=usuario,
            conta_origem=conta_origem,
            conta_destino=conta_destino,
            valor=valor,
            data_transferencia=data_transferencia,
            observacao=observacao,
        )

        MovimentoService.criar_movimento(
            usuario=usuario,
            conta=conta_origem,
            categoria=categoria,
            tipo=TipoMovimento.DESPESA,
            descricao=f"Transferência para {conta_destino.nome}",
            valor=valor,
            data_movimento=data_transferencia,
            observacao=observacao,
            transferencia=transferencia,
        )

        MovimentoService.criar_movimento(
            usuario=usuario,
            conta=conta_destino,
            categoria=categoria,
            tipo=TipoMovimento.RECEITA,
            descricao=f"Transferência de {conta_origem.nome}",
            valor=valor,
            data_movimento=data_transferencia,
            observacao=observacao,
            transferencia=transferencia,
        )

        return transferencia