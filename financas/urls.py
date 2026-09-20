from django.contrib import admin
from django.urls import include, path

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from django.http import JsonResponse
import os

def debug_env(request):
    return JsonResponse({
        "SECRET_KEY_present": bool(os.getenv("SECRET_KEY")),
        "DEBUG": os.getenv("DEBUG", "não definido"),
        "DATABASE_URL_present": bool(os.getenv("DATABASE_URL")),
        "enviroment": "Vercel",
    })




urlpatterns = [
    path('debug-env/', debug_env),
    path("admin/", admin.site.urls),

    path("api/financeiro/", include("apps.financeiro.urls")),
    path("api/usuarios/", include("apps.usuarios.urls")),

    path(
    "api/auth/",
    include("apps.authentication.urls"),
    ),

    path(
        "api/schema/",
        SpectacularAPIView.as_view(),
        name="schema",
    ),

    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(
            url_name="schema"
        ),
        name="swagger-ui",
    ),

    path(
        "api/redoc/",
        SpectacularRedocView.as_view(
            url_name="schema"
        ),
        name="redoc",
    ),


]
