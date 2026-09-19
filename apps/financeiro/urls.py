from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from apps.financeiro.viewsets.conta_viewset import ContaViewSet
from apps.financeiro.viewsets.categoria_viewset import CategoriaViewSet
from apps.financeiro.viewsets.movimento_viewset import MovimentoViewSet
from apps.financeiro.viewsets.transferencia_viewset import TransferenciaViewSet
from apps.financeiro.viewsets.planejamento_viewset import PlanejamentoViewSet
from apps.financeiro.viewsets.extrato_viewset import ExtratoViewSet
from apps.financeiro.viewsets.dashboard_viewset import DashboardViewSet
from apps.financeiro.viewsets.indicador_viewset import IndicadorViewSet



urlpatterns = [

    path(
        "login/",
        TokenObtainPairView.as_view(),
    ),

    path(
        "refresh/",
        TokenRefreshView.as_view(),
    ),
]

router = DefaultRouter()

router.register(
    "contas",
    ContaViewSet,
    basename="conta"
)

router.register(
    "categorias",
    CategoriaViewSet,
    basename="categoria"
)

router.register(
    "movimentos",
    MovimentoViewSet,
    basename="movimento"
)

router.register(
    r"transferencias",
    TransferenciaViewSet,
    basename="transferencias",
)

router.register(
    "planejamentos",
    PlanejamentoViewSet,
    basename="planejamento"
)

router.register(
    "extrato",
    ExtratoViewSet,
    basename="extrato"
)

router.register(
    "dashboard",
    DashboardViewSet,
    basename="dashboard"
)

router.register(
    "indicadores",
    IndicadorViewSet,
    basename="indicadores",
)

urlpatterns = router.urls