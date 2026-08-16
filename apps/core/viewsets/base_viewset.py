from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet


class BaseViewSet(ModelViewSet):

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()

        model = queryset.model

        if any(field.name == "usuario" for field in model._meta.fields):
            queryset = queryset.filter(
                usuario=self.request.user
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save()