from decimal import Decimal

from apps.core.enums.tipo_categoria import TipoCategoria
from apps.core.exceptions import MovimentoException
from apps.financeiro.models import Movimento


class MovimentoService:

    @staticmethod
    def criar_movimento(
        *,
        usuario,
        conta,
        categoria,
        tipo,
        descricao,
        valor,
        data_movimento,
        observacao=None,
    ):
        MovimentoService.validar(
            usuario=usuario,
            conta=conta,
            categoria=categoria,
            tipo=tipo,
            valor=valor,
        )

        return Movimento.objects.create(
            usuario=usuario,
            conta=conta,
            categoria=categoria,
            tipo=tipo,
            descricao=descricao,
            valor=valor,
            data_movimento=data_movimento,
            observacao=observacao,
        )

    @staticmethod
    def validar(
        *,
        usuario,
        conta,
        categoria,
        tipo,
        valor,
    ):
        # Valida a conta
        MovimentoService.buscar_conta(
            usuario=usuario,
            conta=conta,
        )

        # Valida a categoria
        MovimentoService.buscar_categoria(
            usuario=usuario,
            categoria=categoria,
        )

        # Valida compatibilidade entre categoria e movimento
        if categoria is not None:
            if (
                categoria.tipo != TipoCategoria.TRANSFERENCIA
                and categoria.tipo != tipo
            ):
                raise MovimentoException(
                    "O tipo da categoria é incompatível."
                )

        # Valida valor
        if valor <= Decimal("0"):
            raise MovimentoException(
                "O valor deve ser maior que zero."
            )

    @staticmethod
    def buscar_conta(*, usuario, conta):
        if conta.usuario_id != usuario.id:
            raise MovimentoException(
                "A conta não pertence ao usuário."
            )

        if not conta.ativo:
            raise MovimentoException(
                "A conta está inativa."
            )

        return conta

    @staticmethod
    def buscar_categoria(*, usuario, categoria):
        if categoria is None:
            return None

        if categoria.usuario_id != usuario.id:
            raise MovimentoException(
                "A categoria não pertence ao usuário."
            )

        if not categoria.ativo:
            raise MovimentoException(
                "A categoria está inativa."
            )

        return categoria