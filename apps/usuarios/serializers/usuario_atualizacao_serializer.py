
from rest_framework import serializers

from apps.usuarios.models import Usuario


class UsuarioAtualizacaoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Usuario
        fields = [
            "nome",
            "sobrenome",
            "email",
        ]

    def validate_nome(self, valor):
        valor = valor.strip()

        if not valor:
            raise serializers.ValidationError(
                "O nome não pode ficar vazio."
            )

        return valor

    def validate_sobrenome(self, valor):
        valor = valor.strip()

        if not valor:
            raise serializers.ValidationError(
                "O sobrenome não pode ficar vazio."
            )

        return valor

    def validate_email(self, valor):
        valor = valor.strip().lower()

        if not valor:
            raise serializers.ValidationError(
                "O e-mail não pode ficar vazio."
            )

        usuarios = Usuario.objects.filter(email__iexact=valor)

        if self.instance:
            usuarios = usuarios.exclude(pk=self.instance.pk)

        if usuarios.exists():
            raise serializers.ValidationError(
                "Este e-mail já está cadastrado."
            )

        return valor
