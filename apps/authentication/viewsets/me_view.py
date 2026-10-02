from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.usuarios.serializers.usuario_me_serializer import (
    UsuarioMeSerializer,
)


class MeView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsuarioMeSerializer(
            request.user
        )

        return Response(
            serializer.data
        )