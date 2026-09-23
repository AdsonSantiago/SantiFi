from django.db import models
from django.conf import settings
from ..models import Conta, Categoria, Movimento
from apps.core.enums.tipo_planejamento import TipoPlanejamento, TipoRecorrencia, Prioridade
from apps.core.enums.tipo_status import Status

class PlanejamentoFinanceiro(models.Model):

    def clean(self):
        from django.core.exceptions import ValidationError

        super().clean()

        if not self.parcelado:
            self.parcela_atual = 1
            self.total_parcelas = 1

        if self.parcelado:
            if self.total_parcelas <= 1:
                raise ValidationError(
                    "O total de parcelas deve ser maior que 1."
                )

            if self.parcela_atual > self.total_parcelas:
                raise ValidationError(
                    "A parcela atual não pode ser maior que o total de parcelas."
                )


    prioridade = models.PositiveSmallIntegerField(
        choices=Prioridade.choices,
        default=Prioridade.BAIXA
    )

    observacao = models.TextField(
        blank=True,
        null=True
    )
    
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="planejamentos"
    )

    conta = models.ForeignKey(
        Conta,
        on_delete=models.CASCADE,
        related_name="planejamentos"
    )

    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="planejamentos"
    )

    tipo = models.CharField(
        max_length=3,
        choices=TipoPlanejamento.choices
    )

    descricao = models.CharField(
        max_length=150
    )

    valor = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    movimento = models.OneToOneField(
        Movimento,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="planejamento"
    )

    data_prevista = models.DateField()

    status = models.CharField(
        max_length=3,
        choices=Status.choices,
        default=Status.PENDENTE
    )

    recorrencia = models.CharField(
        max_length=3,
        choices=TipoRecorrencia.choices,
        default=TipoRecorrencia.NENHUMA
    )

    parcelado = models.BooleanField(
        default=False
    )

    parcela_atual = models.PositiveSmallIntegerField(
        default=1
    )

    total_parcelas = models.PositiveSmallIntegerField(
        default=1
    )

    criado_em = models.DateTimeField(
        auto_now_add=True
    )

    atualizado_em = models.DateTimeField(
        auto_now=True
    )

    class Meta:

        ordering = [
            "data_prevista",
            "descricao",
        ]

        constraints = [

            models.UniqueConstraint(
                fields=[
                    "usuario",
                    "descricao",
                    "tipo",
                    "data_prevista"
                ],
                name="planejamento_unico_usuario"
            )
        ]

    def __str__(self):
        return (
            f"{self.descricao} "
            f"({self.data_prevista}) "
            f"- R$ {self.valor}"
        )

