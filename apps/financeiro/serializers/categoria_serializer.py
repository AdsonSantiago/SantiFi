from rest_framework import serializers

from apps.financeiro.models import Categoria


class CategoriaSerializer(serializers.ModelSerializer):

    def validate_nome(self, value):
        value = value.strip().title()

        if not value:
            raise serializers.ValidationError(
                "O nome da categoria não pode ser vazio."
            )

        return value

    class Meta:
        model = Categoria

        fields = (
            "id",
            "nome",
            "tipo",
            "descricao",
            "ativo",
        )

        read_only_fields = (
            "id",
        )