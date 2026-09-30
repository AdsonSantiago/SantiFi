from django.urls import path

from apps.usuarios.viewsets.usuario_viewset import (
    CadastroUsuarioView,
    CurrentUserView,
)


urlpatterns = [

    path(
        "me/",
        CurrentUserView.as_view(),
        name="current-user",
    ),

    path(
        "cadastro/",
        CadastroUsuarioView.as_view(),
        name="cadastro",
    ),

]