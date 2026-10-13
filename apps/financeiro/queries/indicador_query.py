from django.db.models import Sum, Count

from apps.financeiro.models import Movimento
from apps.core.enums.tipo_movimento import TipoMovimento


class IndicadorQuery:

    @staticmethod
    def total_receitas(usuario):

        return (
            Movimento.objects.filter(
                usuario=usuario,
                tipo=TipoMovimento.RECEITA,
                transferencia__isnull=True,
            ).aggregate(
                total=Sum("valor")
            )["total"] or 0
        )

    @staticmethod
    def total_despesas(usuario):

        return (
            Movimento.objects.filter(
                usuario=usuario,
                tipo=TipoMovimento.DESPESA,
                transferencia__isnull=True,
            ).aggregate(
                total=Sum("valor")
            )["total"] or 0
        )

    @staticmethod
    def quantidade_movimentos(usuario):

        return Movimento.objects.filter(
            usuario=usuario
        ).count()

