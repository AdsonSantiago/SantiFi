from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


from apps.usuarios.serializers.usuario_cadastro_serializer import (
    UsuarioCadastroSerializer,
)
from apps.usuarios.serializers.usuario_atualizacao_serializer import (
    UsuarioAtualizacaoSerializer,
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

    def patch(self, request):

        serializer = UsuarioAtualizacaoSerializer(
            instance=request.user,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()

        return Response({
            "success": True,
            "message": "Dados atualizados com sucesso.",
            "usuario": {
                "id": usuario.id,
                "nome": usuario.nome,
                "sobrenome": usuario.sobrenome,
                "email": usuario.email,
            },
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
    