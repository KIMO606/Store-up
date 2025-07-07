from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet,
    StoreViewSet,
    CategoryViewSet,
    ProductViewSet,
    ShippingAgentViewSet,
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'stores', StoreViewSet, basename='store')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')
router.register(r'shipping-agents', ShippingAgentViewSet, basename='shipping-agent')

urlpatterns = [
    path('', include(router.urls)),
] 