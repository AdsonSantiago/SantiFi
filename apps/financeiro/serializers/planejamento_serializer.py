from rest_framework import serializers

from apps.core.enums.tipo_categoria import TipoCategoria
from apps.core.enums.tipo_planejamento import TipoRecorrencia
from apps.financeiro.models import Categoria, Conta, PlanejamentoFinanceiro


class PlanejamentoSerializer(serializers.ModelSerializer):

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
        conta = attrs.get("conta", getattr(self.instance, "conta", None))
        categoria = attrs.get(
            "categoria", getattr(self.instance, "categoria", None)
        )
        tipo = attrs.get("tipo", getattr(self.instance, "tipo", None))
        valor = attrs.get("valor", getattr(self.instance, "valor", None))
        parcelado = attrs.get(
            "parcelado", getattr(self.instance, "parcelado", False)
        )
        parcela_atual = attrs.get(
            "parcela_atual", getattr(self.instance, "parcela_atual", 1)
        )
        total_parcelas = attrs.get(
            "total_parcelas", getattr(self.instance, "total_parcelas", 1)
        )

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
        if valor is not None and valor <= 0:
            raise serializers.ValidationError(
                {"valor": "O valor deve ser maior que zero."}
            )
        if parcelado and (
            parcela_atual < 1
            or total_parcelas <= 1
            or parcela_atual > total_parcelas
        ):
            raise serializers.ValidationError(
                {"total_parcelas": "Informe parcelas válidas para este planejamento."}
            )
        if parcelado and attrs.get(
            "recorrencia", getattr(self.instance, "recorrencia", None)
        ) not in (None, TipoRecorrencia.NENHUMA):
            raise serializers.ValidationError(
                {"recorrencia": "Um planejamento não pode ser parcelado e recorrente ao mesmo tempo."}
            )
        if not parcelado:
            attrs["parcela_atual"] = 1
            attrs["total_parcelas"] = 1

        request = self.context.get("request")
        if request and request.user.is_authenticated and self.instance:
            if self.instance.usuario_id != request.user.id:
                raise serializers.ValidationError(
                    "Este planejamento não pertence ao usuário."
                )

        return attrs

    conta_nome = serializers.CharField(
        source="conta.nome",
        read_only=True,
    )

    categoria_nome = serializers.CharField(
        source="categoria.nome",
        read_only=True,
    )

    movimento_id = serializers.IntegerField(
        source="movimento.id",
        read_only=True,
    )

    class Meta:

        model = PlanejamentoFinanceiro

        fields = (
            "id",

            "conta",
            "conta_nome",

            "categoria",
            "categoria_nome",

            "tipo",

            "descricao",

            "valor",

            "data_prevista",

            "status",

            "recorrencia",

            "parcelado",

            "parcela_atual",

            "total_parcelas",

            "prioridade",

            "observacao",

            "movimento",

            "movimento_id",

            "criado_em",

            "atualizado_em",
        )

        read_only_fields = (
            "id",
            "status",
            "movimento",
            "movimento_id",
            "criado_em",
            "atualizado_em",
        )
