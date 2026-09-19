from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response

from apps.core.viewsets.base_viewset import BaseViewSet

from apps.financeiro.models.planejamento import PlanejamentoFinanceiro
from apps.financeiro.serializers.planejamento_serializer import (
    PlanejamentoSerializer,
)
from apps.financeiro.services.planejamento_service import (
    PlanejamentoService,
)
from apps.financeiro.filters.planejamento_filter import (
    PlanejamentoFilter,
)


class PlanejamentoViewSet(BaseViewSet):

    queryset = PlanejamentoFinanceiro.objects.select_related(
        "conta",
        "categoria",
        "movimento",
    )

    serializer_class = PlanejamentoSerializer

    filterset_class = PlanejamentoFilter

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
        "data_prevista",
        "descricao",
    ]

    ordering = [
        "data_prevista",
    ]

    @action(
        detail=True,
        methods=["post"],
        url_path="pagar",
    )
    def pagar(self, request, pk=None):

        planejamento = self.get_object()

        movimento = PlanejamentoService.marcar_como_pago(
            planejamento
        )

        return Response(
            {
                "message": "Planejamento pago com sucesso.",
                "movimento_id": movimento.id,
            },
            status=status.HTTP_200_OK,
        )