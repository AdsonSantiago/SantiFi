from zoneinfo import available_timezones

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from apps.usuarios.managers import UsuarioManager

class Perfil(models.Model):
    codigo = models.CharField(max_length=30,unique=True
    )

    nome = models.CharField(max_length=50,unique=True
    )

    descricao = models.TextField(blank=True,max_length=255
    )

    ativo = models.BooleanField(default=True
    )

    criado_em = models.DateTimeField(auto_now_add=True
    )

    atualizado_em = models.DateTimeField(auto_now=True
    )

    class Meta:
        verbose_name = "Perfil"
        verbose_name_plural = "Perfis"
        ordering = ["nome"]

    def __str__(self):
        return self.nome



def timezones_choices():
    return sorted(
        [(tz, tz) for tz in available_timezones()],
        key=lambda x: x[0]
    )


class Usuario(AbstractBaseUser, PermissionsMixin):

    nome = models.CharField(
        max_length=100
    )

    sobrenome = models.CharField(
        max_length=100
    )

    email = models.EmailField(
        unique=True
    )

    timezone = models.CharField(
        max_length=50,
        choices=timezones_choices(),
        default="America/Sao_Paulo"
    )

    perfil = models.ForeignKey(
        Perfil,
        on_delete=models.PROTECT,
        related_name="usuarios",
        null=True,
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    is_staff = models.BooleanField(
        default=False
    )

    date_joined = models.DateTimeField(
        auto_now_add=True
    )

    objects = UsuarioManager()

    USERNAME_FIELD = "email"

    EMAIL_FIELD = "email"

    REQUIRED_FIELDS = [
        "nome",
        "sobrenome",
    ]

    def get_full_name(self):
        return f"{self.nome} {self.sobrenome}".strip()


    def get_short_name(self):
        return self.nome


    def __str__(self):
        return f"{self.nome} {self.sobrenome} <{self.email}>"
