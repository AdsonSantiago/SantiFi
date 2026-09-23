from django.db import models
from django.conf import settings
from apps.core.enums.tipo_categoria import TipoCategoria

class Categoria(models.Model):

    usuario = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.CASCADE,
    related_name="categorias"
    )

    nome = models.CharField(
        max_length=100
    )

    tipo = models.CharField(
        max_length=3,
        choices=TipoCategoria.choices
    )

    descricao = models.TextField(
        blank=True,
        null=True
    )

    ativo = models.BooleanField(
        default=True
    )

    criado_em = models.DateTimeField(
        auto_now_add=True
    )

    atualizado_em = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["nome"]

        constraints = [
            models.UniqueConstraint(
                fields=["usuario", "nome", "tipo"],
                name="categoria_unica_usuario"
            )
        ]

    def __str__(self):
        return f"{self.nome} - {self.tipo}"
