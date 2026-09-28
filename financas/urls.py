from django.contrib import admin
from django.urls import include, path

from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from django.db import connection
from django.http import JsonResponse

# teste de conecxão com o banco

# def diagnostico_banco(request):
#     try:
#         with connection.cursor() as cursor:
#             cursor.execute("SELECT 1")
#             resultado = cursor.fetchone()

#         return JsonResponse({
#             "status": "ok",
#             "database": connection.vendor,
#             "host": connection.settings_dict.get("HOST"),
#             "name": connection.settings_dict.get("NAME"),
#             "teste": resultado[0] == 1,
#         })

#     except Exception as e:
#         return JsonResponse({
#             "status": "erro",
#             "erro": str(e),
#         }, status=500)



urlpatterns = [
    # path(
    # "api/diagnostico/banco/",
    # diagnostico_banco,
    # ),

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
