from django.conf import settings
from django.db import models

from apps.financeiro.models import Conta


class Transferencia(models.Model):

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="transferencias",
    )

    conta_origem = models.ForeignKey(
        Conta,
        on_delete=models.CASCADE,
        related_name="transferencias_origem",
    )

    conta_destino = models.ForeignKey(
        Conta,
        on_delete=models.CASCADE,
        related_name="transferencias_destino",
    )

    valor = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )

    data_transferencia = models.DateField()

    observacao = models.TextField(
        blank=True,
        null=True,
    )

    criado_em = models.DateTimeField(
        auto_now_add=True,
    )

    atualizado_em = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-data_transferencia", "-criado_em"]

    def __str__(self):
        return (
            f"{self.conta_origem.nome} → "
            f"{self.conta_destino.nome} - "
            f"R$ {self.valor}"
        )