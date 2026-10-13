from rest_framework import serializers
from apps.financeiro.serializers.movimento_serializer import MovimentoSerializer


class DashboardEvolutionSerializer(serializers.Serializer):
    data = serializers.CharField()
    receitas = serializers.DecimalField(max_digits=12, decimal_places=2)
    despesas = serializers.DecimalField(max_digits=12, decimal_places=2)


class DashboardSerializer(serializers.Serializer):

    saldo_atual = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    saldo_previsto = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    receitas_mes = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    despesas_mes = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    planejado_receber = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    planejado_pagar = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    periodo = serializers.ChoiceField(choices=("month", "previous", "year"))
    data_inicio = serializers.DateField()
    data_fim = serializers.DateField()
    receitas_periodo = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    despesas_periodo = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    evolucao = DashboardEvolutionSerializer(many=True)
    movimentos_recentes = MovimentoSerializer(many=True)
