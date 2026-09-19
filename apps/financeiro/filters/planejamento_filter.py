from django_filters import rest_framework as filters

from apps.financeiro.models import PlanejamentoFinanceiro


class PlanejamentoFilter(filters.FilterSet):

    data_inicial = filters.DateFilter(
        field_name="data_prevista",
        lookup_expr="gte",
    )

    data_final = filters.DateFilter(
        field_name="data_prevista",
        lookup_expr="lte",
    )

    class Meta:

        model = PlanejamentoFinanceiro
        fields = [
            "status",
            "tipo",
            "conta",
            "categoria",
        ]