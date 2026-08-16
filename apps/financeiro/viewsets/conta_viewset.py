from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.core.viewsets.base_viewset import BaseViewSet

from apps.financeiro.models.conta import Conta
from apps.financeiro.serializers.conta_serializer import ContaSerializer
from apps.financeiro.filters.conta_filter import ContaFilter


class ContaViewSet(BaseViewSet):

    queryset = Conta.objects.all()

    serializer_class = ContaSerializer

    filterset_class = ContaFilter

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "nome",
    ]

    ordering_fields = [
        "nome",
        "saldo_inicial",
        "ordem",
    ]

    ordering = [
        "ordem",
        "nome",
    ]