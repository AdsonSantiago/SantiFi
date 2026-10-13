import logging

from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from apps.financeiro.serializers.movement_draft_serializer import (
    MovementDraftRequestSerializer,
)
from apps.financeiro.services.movement_draft_service import (
    MovementDraftService,
    OllamaDraftInvalidResponse,
    OllamaDraftTimeout,
    OllamaDraftUnavailable,
)

logger = logging.getLogger(__name__)


class MovementDraftView(APIView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "ai_draft"

    def post(self, request):
        request_serializer = MovementDraftRequestSerializer(data=request.data)
        request_serializer.is_valid(raise_exception=True)

        try:
            draft = MovementDraftService.criar_rascunho(
                usuario=request.user,
                texto=request_serializer.validated_data["texto"],
            )
        except OllamaDraftUnavailable as exc:
            detail = str(exc) or (
                "O Ollama não está disponível. Inicie o Ollama e confira o modelo configurado."
            )
            return Response(
                {"detail": detail},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except OllamaDraftTimeout:
            return Response(
                {"detail": "O Ollama demorou para responder. Tente novamente."},
                status=status.HTTP_504_GATEWAY_TIMEOUT,
            )
        except OllamaDraftInvalidResponse:
            logger.warning("O Ollama retornou uma resposta de rascunho inválida.")
            return Response(
                {"detail": "A IA não conseguiu montar o rascunho. Reformule a descrição."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except ValidationError:
            logger.warning("O Ollama retornou campos inválidos para o rascunho.")
            return Response(
                {"detail": "A IA retornou dados inválidos. Reformule a descrição."},
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except (ValueError, TypeError, KeyError):
            logger.exception("Falha ao montar rascunho de movimento com Ollama.")
            return Response(
                {"detail": "Não foi possível preparar o movimento com IA."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        return Response(draft, status=status.HTTP_200_OK)
