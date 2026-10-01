from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from apps.authentication.viewsets.auth_viewset import (
    LoginView, GoogleLoginView
)

from apps.usuarios.viewsets.usuario_viewset import (
    CadastroUsuarioView,
)


urlpatterns = [

    path(
        "login/",
        LoginView.as_view(),
        name="login",
    ),

    path(
        "google/",
        GoogleLoginView.as_view(),
        name="google-login",
    ),
    
    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="refresh",
    ),

    path(
        "cadastro/",
        CadastroUsuarioView.as_view(),
        name="cadastro",
    ),

]