from drf_spectacular.utils import (
    extend_schema,
    OpenApiExample,
    OpenApiResponse,
)

from apps.core.serializers.error_serializer import ErrorResponseSerializer
from apps.core.viewsets.base_viewset import BaseViewSet

from apps.financeiro.models import Transferencia
from apps.financeiro.serializers import TransferenciaSerializer


@extend_schema(tags=["Transferências"])
class TransferenciaViewSet(BaseViewSet):

    queryset = Transferencia.objects.select_related(
        "conta_origem",
        "conta_destino",
    )

    serializer_class = TransferenciaSerializer

    @extend_schema(
        summary="Criar transferência",
        description=(
            "Realiza uma transferência entre duas contas "
            "do usuário autenticado."
        ),
        responses={
            201: TransferenciaSerializer,
            400: OpenApiResponse(
                response=ErrorResponseSerializer,
                description=(
                    "Dados inválidos ou regra de negócio "
                    "não atendida."
                ),
                examples=[
                    OpenApiExample(
                        "Contas iguais",
                        value={
                            "success": False,
                            "message": "Erro na requisição.",
                            "errors": {
                                "non_field_errors": [
                                    "A conta de origem deve ser diferente da conta destino."
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
        summary="Consultar transferência",
        description=(
            "Retorna uma transferência do usuário autenticado."
        ),
        responses={
            200: TransferenciaSerializer,
            401: OpenApiResponse(
                response=ErrorResponseSerializer,
                description=(
                    "Usuário não autenticado ou token inválido."
                ),
            ),
            404: OpenApiResponse(
                response=ErrorResponseSerializer,
                description="Transferência não encontrada.",
            ),
        },
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @extend_schema(
        summary="Excluir transferência",
        description=(
            "Exclui uma transferência do usuário autenticado."
        ),
        responses={
            204: None,
            401: OpenApiResponse(
                response=ErrorResponseSerializer,
                description=(
                    "Usuário não autenticado ou token inválido."
                ),
            ),
            404: OpenApiResponse(
                response=ErrorResponseSerializer,
                description="Transferência não encontrada.",
            ),
        },
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)