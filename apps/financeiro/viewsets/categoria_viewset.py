from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from apps.core.viewsets.base_viewset import BaseViewSet

from apps.financeiro.models.categoria import Categoria
from apps.financeiro.serializers.categoria_serializer import CategoriaSerializer
from apps.financeiro.filters.categoria_filter import CategoriaFilter


class CategoriaViewSet(BaseViewSet):

    queryset = Categoria.objects.all()

    serializer_class = CategoriaSerializer

    filterset_class = CategoriaFilter

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "nome",
        "descricao",
    ]

    ordering_fields = [
        "nome",
        "tipo",
    ]

    ordering = [
        "nome",
    ]