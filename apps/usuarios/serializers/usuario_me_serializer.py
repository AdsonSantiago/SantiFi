from rest_framework import serializers

from apps.usuarios.models import Usuario


class UsuarioMeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Usuario
        fields = [
            "id",
            "nome",
            "sobrenome",
            "email",
            "timezone",
            "google_id",
        ]
        read_only_fields = [
            "id",
            "google_id",
        ]