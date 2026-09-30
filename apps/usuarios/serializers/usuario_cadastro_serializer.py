from rest_framework import serializers

from apps.usuarios.models import Usuario


class UsuarioCadastroSerializer(serializers.ModelSerializer):

    senha = serializers.CharField(
        write_only=True,
        min_length=8,
    )

    confirmar_senha = serializers.CharField(
        write_only=True,
    )

    class Meta:
        model = Usuario

        fields = (
            "id",
            "nome",
            "sobrenome",
            "email",
            "senha",
            "confirmar_senha",
            "timezone",
        )

        read_only_fields = (
            "id",
        )

    def validate_email(self, value):
        return value.strip().lower()

    def validate(self, attrs):
        senha = attrs.get("senha")
        confirmar_senha = attrs.get("confirmar_senha")

        if senha != confirmar_senha:
            raise serializers.ValidationError({
                "confirmar_senha": "As senhas não conferem."
            })

        return attrs

    def create(self, validated_data):
        validated_data.pop("confirmar_senha")

        senha = validated_data.pop("senha")

        usuario = Usuario(
            **validated_data
        )

        usuario.set_password(senha)
        usuario.save()

        return usuario