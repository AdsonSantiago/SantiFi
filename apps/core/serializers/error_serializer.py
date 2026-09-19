from rest_framework import serializers


class ErrorResponseSerializer(serializers.Serializer):

    success = serializers.BooleanField(
        default=False
    )

    message = serializers.CharField(
        default="Erro na requisição."
    )

    errors = serializers.JSONField(
        default={}
    )

