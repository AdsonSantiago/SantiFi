from rest_framework import serializers

from apps.core.enums.tipo_movimento import TipoMovimento


class MovementDraftRequestSerializer(serializers.Serializer):
    texto = serializers.CharField(
        min_length=3,
        max_length=500,
        trim_whitespace=True,
    )


class MovementDraftResponseSerializer(serializers.Serializer):
    tipo = serializers.ChoiceField(
        choices=(TipoMovimento.RECEITA, TipoMovimento.DESPESA),
        allow_null=True,
    )
    valor = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        allow_null=True,
    )
    data_movimento = serializers.DateField(allow_null=True)
    descricao = serializers.CharField(max_length=150, allow_blank=True)
    conta_id = serializers.IntegerField(allow_null=True)
    categoria_id = serializers.IntegerField(allow_null=True)
    categoria_nome_sugerida = serializers.CharField(
        max_length=100,
        allow_blank=True,
    )
    pergunta = serializers.CharField(max_length=300, allow_blank=True)
