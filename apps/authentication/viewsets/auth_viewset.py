from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.authentication.serializers.login_serializer import (
    LoginSerializer,
)

from apps.usuarios.serializers.usuario_google_serializer import (
    UsuarioGoogleSerializer,
)


class LoginView(TokenObtainPairView):

    serializer_class = LoginSerializer

class GoogleLoginView(APIView):

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = UsuarioGoogleSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        dados_google = serializer.validated_data[
            "google_data"
        ]

        email = dados_google["email"]
        nome = dados_google.get("given_name", "")
        sobrenome = dados_google.get("family_name", "")
        google_id = dados_google["sub"]

        Usuario = get_user_model()

        usuario = Usuario.objects.filter(
            google_id=google_id
        ).first()

        if usuario is None:
            usuario = Usuario.objects.filter(
                email=email
            ).first()

        if usuario is None:

            usuario = Usuario.objects.create(
                email=email,
                nome=nome,
                sobrenome=sobrenome,
                google_id=google_id,
                is_active=True,
            )

            usuario.set_unusable_password()
            usuario.save()

        else:

            if not usuario.is_active:

                return Response(
                    {
                        "success": False,
                        "message": "Usuário inativo.",
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

            if usuario.google_id != google_id:

                usuario.google_id = google_id

                usuario.save(
                    update_fields=["google_id"]
                )

        refresh = RefreshToken.for_user(usuario)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )