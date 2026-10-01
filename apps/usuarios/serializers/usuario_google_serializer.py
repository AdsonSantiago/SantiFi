from rest_framework import serializers
from google.oauth2 import id_token
from google.auth.transport import requests

from django.conf import settings


class UsuarioGoogleSerializer(serializers.Serializer):

    credential = serializers.CharField(
        write_only=True
    )

    def validate(self, attrs):

        credential = attrs.get("credential")

        try:
            google_data = id_token.verify_oauth2_token(
                credential,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID,
            )

        except ValueError:
            raise serializers.ValidationError(
                {
                    "credential": "Token do Google inválido."
                }
            )

        attrs["google_data"] = google_data

        return attrs