from apps.financeiro.models import Movimento
from apps.core.exceptions import MovimentoException
from apps.core.enums.tipo_categoria import TipoCategoria
from decimal import Decimal


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

        if conta.usuario_id != usuario.id:
            raise MovimentoException(
                "A conta não pertence ao usuário."
            )

        if not conta.ativo:
            raise MovimentoException(
                "A conta está inativa."
            )

        if categoria:

            if categoria.usuario_id != usuario.id:
                raise MovimentoException(
                    "A categoria não pertence ao usuário."
                )

            if not categoria.ativo:
                raise MovimentoException(
                    "A categoria está inativa."
                )

            if (
                categoria.tipo != TipoCategoria.TRANSFERENCIA
                and categoria.tipo != tipo
            ):
                raise MovimentoException(
                    "O tipo da categoria é incompatível."
                )

        if valor <= Decimal("0"):
            raise MovimentoException(
                "O valor deve ser maior que zero."
            )
        
    @staticmethod
    def buscar_conta(usuario, conta):

        if conta.usuario_id != usuario.id:
            raise MovimentoException(
                "Conta inválida."
            )

        if not conta.ativo:
            raise MovimentoException(
                "Conta inativa."
            )

        return conta

    @staticmethod
    def buscar_categoria(usuario, categoria):

        if categoria is None:
            return None

        if categoria.usuario_id != usuario.id:
            raise MovimentoException(
                "Categoria inválida."
            )

        if not categoria.ativo:
            raise MovimentoException(
                "Categoria inativa."
            )

        return categoria

