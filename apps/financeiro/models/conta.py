from django.db import models
from django.conf import settings
from apps.core.enums.tipo_conta import TipoConta

class Conta(models.Model):

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="contas"
    )

    nome = models.CharField(
        max_length=100
    )

    tipo = models.CharField(
        max_length=3,
        choices=TipoConta.choices,
        default=TipoConta.CORRENTE
    )

    saldo_inicial = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
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

    ordem = models.PositiveSmallIntegerField(
        default=1
    )

    @property
    def saldo_atual(self):

        receitas = self.movimentos.filter(
            tipo="REC"
        ).aggregate(
            total=models.Sum("valor")
        )["total"] or 0


        despesas = self.movimentos.filter(
            tipo="DES"
        ).aggregate(
            total=models.Sum("valor")
        )["total"] or 0


        return self.saldo_inicial + receitas - despesas

    class Meta:
        ordering = ["ordem", "nome"]
        verbose_name = "Conta"
        verbose_name_plural = "Contas"

    def __str__(self):
        return f"{self.nome} ({self.usuario.email})"

