from django_filters import rest_framework as filters

from apps.financeiro.models import Movimento


class MovimentoFilter(filters.FilterSet):

    data_inicial = filters.DateFilter(
        field_name="data_movimento",
        lookup_expr="gte",
    )

    data_final = filters.DateFilter(
        field_name="data_movimento",
        lookup_expr="lte",
    )

    class Meta:

        model = Movimento
        fields = [
            "tipo",
            "conta",
            "categoria",
        ]