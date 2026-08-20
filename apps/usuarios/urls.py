from django.urls import path

from apps.usuarios.viewsets.usuario_viewset import CurrentUserView


urlpatterns = [

    path(
        "me/",
        CurrentUserView.as_view(),
        name="current-user",
    ),

]