from rest_framework import serializers
from drf_spectacular.utils import (
    extend_schema_serializer,
    OpenApiExample,
)

from apps.financeiro.models import Movimento
from apps.financeiro.services.movimento_service import MovimentoService


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            "Criar despesa",
            summary="Cadastro de uma despesa",
            description="Exemplo de criação de uma despesa financeira.",
            value={
                "conta": 1,
                "categoria": 2,
                "tipo": "DES",
                "descricao": "Compra mercado",
                "valor": "150.00",
                "data_movimento": "2026-08-01",
                "observacao": "Compra realizada no supermercado",
            },
            request_only=True,
        ),
        OpenApiExample(
            "Criar receita",
            summary="Cadastro de uma receita financeira",
            description="Exemplo de criação de uma receita financeira.",
            value={
                "conta": 1,
                "categoria": 1,
                "tipo": "REC",
                "descricao": "Salário",
                "valor": "3500.00",
                "data_movimento": "2026-08-05",
                "observacao": "Salário mensal",
            },
            request_only=True,
        ),
    ]
)
class MovimentoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Movimento

        fields = (
            "id",
            "conta",
            "categoria",
            "tipo",
            "descricao",
            "valor",
            "data_movimento",
            "observacao",
        )

        read_only_fields = (
            "id",
        )

    def create(self, validated_data):
        return MovimentoService.criar_movimento(
            **validated_data,
        )