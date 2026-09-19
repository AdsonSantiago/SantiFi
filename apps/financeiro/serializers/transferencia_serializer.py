from rest_framework import serializers

from apps.financeiro.models import Transferencia
from apps.financeiro.services.transferencia_service import (
    TransferenciaService,
)


class TransferenciaSerializer(serializers.ModelSerializer):

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