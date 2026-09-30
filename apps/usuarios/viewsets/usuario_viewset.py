from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.usuarios.serializers.usuario_cadastro_serializer import (
    UsuarioCadastroSerializer,
)


class CurrentUserView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response({
            "id": request.user.id,
            "nome": request.user.nome,
            "sobrenome": request.user.sobrenome,
            "email": request.user.email,
        })


class CadastroUsuarioView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = UsuarioCadastroSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        usuario = serializer.save()

        return Response(
            {
                "success": True,
                "message": "Usuário criado com sucesso.",
                "usuario": {
                    "id": usuario.id,
                    "nome": usuario.nome,
                    "sobrenome": usuario.sobrenome,
                    "email": usuario.email,
                },
            },
            status=status.HTTP_201_CREATED,
        )
    