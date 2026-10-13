from rest_framework import serializers

from apps.financeiro.models import Conta, Transferencia
from apps.financeiro.services.transferencia_service import (
    TransferenciaService,
)


class TransferenciaSerializer(serializers.ModelSerializer):

    def get_fields(self):
        fields = super().get_fields()
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            contas_do_usuario = Conta.objects.filter(usuario=request.user)
            fields["conta_origem"].queryset = contas_do_usuario
            fields["conta_destino"].queryset = contas_do_usuario

        return fields

    def validate(self, attrs):
        conta_origem = attrs.get(
            "conta_origem", getattr(self.instance, "conta_origem", None)
        )
        conta_destino = attrs.get(
            "conta_destino", getattr(self.instance, "conta_destino", None)
        )
        valor = attrs.get("valor", getattr(self.instance, "valor", None))

        if conta_origem and conta_destino and conta_origem == conta_destino:
            raise serializers.ValidationError(
                {"conta_destino": "A conta de origem deve ser diferente da conta destino."}
            )
        if conta_origem and not conta_origem.ativo:
            raise serializers.ValidationError(
                {"conta_origem": "A conta de origem está inativa."}
            )
        if conta_destino and not conta_destino.ativo:
            raise serializers.ValidationError(
                {"conta_destino": "A conta de destino está inativa."}
            )
        if valor is not None and valor <= 0:
            raise serializers.ValidationError(
                {"valor": "O valor deve ser maior que zero."}
            )

        request = self.context.get("request")
        if request and request.user.is_authenticated and self.instance:
            if self.instance.usuario_id != request.user.id:
                raise serializers.ValidationError(
                    "Esta transferência não pertence ao usuário."
                )

        return attrs

    class Meta:
        model = Transferencia

        fields = (
            "id",
            "conta_origem",
            "conta_destino",
            "valor",
            "data_transferencia",
            "observacao",
        )

        read_only_fields = (
            "id",
        )

    def create(self, validated_data):
        return TransferenciaService.transferir(
            **validated_data,
        )
