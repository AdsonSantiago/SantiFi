from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from drf_spectacular.utils import extend_schema

from apps.core.viewsets.base_viewset import BaseViewSet

from apps.financeiro.models import Movimento
from apps.financeiro.serializers import MovimentoSerializer
from apps.financeiro.filters.movimento_filter import MovimentoFilter


@extend_schema(tags=["Movimentos"])
class MovimentoViewSet(BaseViewSet):

    queryset = Movimento.objects.select_related(
        "conta",
        "categoria",
    )

    serializer_class = MovimentoSerializer

    filterset_class = MovimentoFilter

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = [
        "descricao",
        "observacao",
    ]

    ordering_fields = [
        "valor",
        "data_movimento",
        "descricao",
    ]

    ordering = [
        "-data_movimento",
    ]

    @extend_schema(
        summary="Criar movimento",
        description=(
            "Cria uma receita, despesa ou transferência "
            "para o usuário autenticado."
        ),
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)