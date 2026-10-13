from decimal import Decimal

from rest_framework import serializers
from drf_spectacular.utils import (
    extend_schema_serializer,
    OpenApiExample,
)

from apps.core.enums.tipo_categoria import TipoCategoria
from apps.financeiro.models import Categoria, Conta, Movimento
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
    # The form treats the description as optional; keep API validation aligned.
    descricao = serializers.CharField(
        required=False,
        allow_blank=True,
        max_length=150,
    )

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            fields["conta"].queryset = Conta.objects.filter(
                usuario=request.user
            )
            fields["categoria"].queryset = Categoria.objects.filter(
                usuario=request.user
            )

        return fields

    def validate(self, attrs):
        request = self.context.get("request")
        conta = attrs.get("conta", getattr(self.instance, "conta", None))
        categoria = attrs.get(
            "categoria", getattr(self.instance, "categoria", None)
        )
        tipo = attrs.get("tipo", getattr(self.instance, "tipo", None))
        valor = attrs.get("valor", getattr(self.instance, "valor", None))

        if conta is not None and not conta.ativo:
            raise serializers.ValidationError({"conta": "A conta está inativa."})

        if categoria is not None:
            if not categoria.ativo:
                raise serializers.ValidationError(
                    {"categoria": "A categoria está inativa."}
                )
            if categoria.tipo not in (TipoCategoria.TRANSFERENCIA, tipo):
                raise serializers.ValidationError(
                    {"categoria": "O tipo da categoria é incompatível."}
                )

        if valor is not None and valor <= Decimal("0"):
            raise serializers.ValidationError(
                {"valor": "O valor deve ser maior que zero."}
            )

        if request and request.user.is_authenticated and self.instance:
            if self.instance.usuario_id != request.user.id:
                raise serializers.ValidationError(
                    "Este movimento não pertence ao usuário."
                )

        return attrs

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
