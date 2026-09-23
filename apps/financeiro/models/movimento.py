from django.db import models
from django.conf import settings
from ..models import Conta, Categoria
from apps.core.enums.tipo_movimento import TipoMovimento

class Movimento(models.Model):

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="movimentos"
    )


    conta = models.ForeignKey(
        Conta,
        on_delete=models.CASCADE,
        related_name="movimentos"
    )


    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="movimentos"
    )

    transferencia = models.ForeignKey(
        "Transferencia",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="movimentos",
    )

    tipo = models.CharField(
        max_length=3,
        choices=TipoMovimento.choices
    )


    descricao = models.CharField(
        max_length=150
    )


    valor = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )


    data_movimento = models.DateField()


    observacao = models.TextField(
        blank=True,
        null=True
    )


    criado_em = models.DateTimeField(
        auto_now_add=True
    )


    atualizado_em = models.DateTimeField(
        auto_now=True
    )


    class Meta:
        ordering = ["-data_movimento", "-criado_em"]


    def __str__(self):
        return f"{self.descricao} - R$ {self.valor}"
