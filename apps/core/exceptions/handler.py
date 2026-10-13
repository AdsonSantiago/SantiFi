import logging

from apps.core.exceptions.financeiro import FinanceiroException
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    if isinstance(exc, FinanceiroException):
        return Response(
            {
                "success": False,
                "message": "Erro na requisição.",
                "errors": {"non_field_errors": [str(exc)]},
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    response = exception_handler(exc, context)

    if response is not None:
        return Response(
            {
                "success": False,
                "message": "Erro na requisição.",
                "errors": response.data,
            },
            status=response.status_code,
        )

    logger.error(
        "Unhandled API exception",
        exc_info=(type(exc), exc, exc.__traceback__),
    )
    return Response(
        {
            "success": False,
            "message": "Erro interno do servidor.",
            "errors": [],
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
