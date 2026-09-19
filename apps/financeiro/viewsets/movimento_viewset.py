from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from drf_spectacular.utils import (extend_schema, OpenApiResponse, OpenApiExample)

from apps.core.viewsets.base_viewset import BaseViewSet
from apps.core.serializers.error_serializer import ErrorResponseSerializer

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
        responses={
            201: MovimentoSerializer,

            400: OpenApiResponse(
                response=ErrorResponseSerializer,
                description=(
                    "Dados inválidos ou regra de negócio "
                    "não atendida."
                ),
                examples=[
                    OpenApiExample(
                        "Conta inativa",
                        value={
                            "success": False,
                            "message": "Erro na requisição.",
                            "errors": {
                                "non_field_errors": [
                                    "A conta está inativa."
                                ]
                            },
                        },
                    ),
                    OpenApiExample(
                        "Categoria incompatível",
                        value={
                            "success": False,
                            "message": "Erro na requisição.",
                            "errors": {
                                "non_field_errors": [
                                    "O tipo da categoria é incompatível."
                                ]
                            },
                        },
                    ),
                    OpenApiExample(
                        "Valor inválido",
                        value={
                            "success": False,
                            "message": "Erro na requisição.",
                            "errors": {
                                "non_field_errors": [
                                    "O valor deve ser maior que zero."
                                ]
                            },
                        },
                    ),
                ],
            ),

            401: OpenApiResponse(
                response=ErrorResponseSerializer,
                description=(
                    "Usuário não autenticado ou token inválido."
                ),
            ),
        },
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    @extend_schema(
        summary="Consultar movimento",
        description=(
            "Retorna os dados de um movimento "
            "do usuário autenticado."
        ),
        responses={
            200: MovimentoSerializer,
            401: OpenApiResponse(
                response=ErrorResponseSerializer,
                description="Usuário não autenticado ou token inválido.",
            ),
            404: OpenApiResponse(
                response=ErrorResponseSerializer,
                description="Movimento não encontrado.",
            ),
        },
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    @extend_schema(
        summary="Atualizar movimento",
        description=(
            "Atualiza todos os dados de um movimento "
            "do usuário autenticado."
        ),
        request=MovimentoSerializer,
        responses={
            200: MovimentoSerializer,
            400: OpenApiResponse(
                response=ErrorResponseSerializer,
                description=(
                    "Dados inválidos ou regra de negócio "
                    "não atendida."
                ),
            ),
            401: OpenApiResponse(
                response=ErrorResponseSerializer,
                description=(
                    "Usuário não autenticado ou token inválido."
                ),
            ),
            404: OpenApiResponse(
                response=ErrorResponseSerializer,
                description="Movimento não encontrado.",
            ),
        },
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @extend_schema(
        summary="Atualizar parcialmente movimento",
        description=(
            "Atualiza parcialmente os dados de um movimento "
            "do usuário autenticado."
        ),
        request=MovimentoSerializer,
        responses={
            200: MovimentoSerializer,
            400: OpenApiResponse(
                response=ErrorResponseSerializer,
                description=(
                    "Dados inválidos ou regra de negócio "
                    "não atendida."
                ),
            ),
            401: OpenApiResponse(
                response=ErrorResponseSerializer,
                description=(
                    "Usuário não autenticado ou token inválido."
                ),
            ),
            404: OpenApiResponse(
                response=ErrorResponseSerializer,
                description="Movimento não encontrado.",
            ),
        },
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @extend_schema(
        summary="Excluir movimento",
        description=(
            "Exclui um movimento do usuário autenticado."
        ),
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

