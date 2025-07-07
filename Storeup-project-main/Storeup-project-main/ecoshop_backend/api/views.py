from django.shortcuts import render
from django.contrib.auth import login
from rest_framework import viewsets, status, permissions, generics
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.response import Response
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authtoken.models import Token
from .models import Category, Product, ProductImage, ProductSpecification, Store, ShippingAgent
from .serializers import (
    CategorySerializer, 
    ProductSerializer, 
    ProductDetailSerializer,
    StoreSerializer,
    RegisterSerializer,
    UserSerializer,
    ShippingAgentSerializer,
)
from django.http import JsonResponse

class UserViewSet(viewsets.ViewSet):
    def get_permissions(self):
        if self.action in ['create', 'login']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'create':
            return RegisterSerializer
        elif self.action == 'login':
            return AuthTokenSerializer
        return UserSerializer

    @action(detail=False, methods=['post'])
    def login(self, request):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user).data,
            "token": token.key
        })

    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            "user": UserSerializer(user).data,
            "token": token.key
        }, status=status.HTTP_201_CREATED)

    def retrieve(self, request, pk=None):
        if pk == 'me':
            return Response(UserSerializer(request.user).data)
        return Response(status=status.HTTP_404_NOT_FOUND)

class StoreViewSet(viewsets.ModelViewSet):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        queryset = Store.objects.all()
        if self.action == 'list' and not self.request.user.is_staff:
            queryset = queryset.filter(owner=self.request.user)
        return queryset

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update', 'retrieve']:
            return ProductDetailSerializer
        return ProductSerializer
    
    def create(self, request, *args, **kwargs):
        print("بيانات طلب إنشاء المنتج:", request.data)
        
        # الحصول على صور إضافية من الطلب
        additional_images = request.FILES.getlist('images')
        print("الصور الإضافية:", additional_images)
        
        # استخدام ال serializer للتحقق من البيانات وإنشاء المنتج
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        
        # إضافة الصور الإضافية للمنتج
        for image in additional_images:
            ProductImage.objects.create(product=product, image=image)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        print("بيانات طلب تحديث المنتج:", request.data)
        
        # الحصول على صور إضافية من الطلب
        additional_images = request.FILES.getlist('images')
        print("الصور الإضافية:", additional_images)
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # إذا تم تحديث الصور الإضافية، قم بحذف القديمة وإضافة الجديدة
        if additional_images:
            # حذف الصور القديمة
            instance.images.all().delete()
            # إضافة الصور الجديدة
            for image in additional_images:
                ProductImage.objects.create(product=instance, image=image)
        
        if getattr(instance, '_prefetched_objects_cache', None):
            # إذا كان 'prefetch_related' مستخدم، قم بتحديث ذاكرة التخزين المؤقت
            instance._prefetched_objects_cache = {}
        
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = Product.objects.all()
        
        # فلتر حسب الفئة
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # فلتر المنتجات المميزة
        featured = self.request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(featured=True)
        
        # فلتر المنتجات الجديدة
        new_arrival = self.request.query_params.get('new_arrival')
        if new_arrival and new_arrival.lower() == 'true':
            queryset = queryset.filter(new_arrival=True)
        
        # فلتر منتجات التخفيضات
        sale = self.request.query_params.get('sale')
        if sale and sale.lower() == 'true':
            queryset = queryset.filter(sale=True)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_products = Product.objects.filter(featured=True)
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def new_arrivals(self, request):
        new_arrivals = Product.objects.filter(new_arrival=True)
        serializer = self.get_serializer(new_arrivals, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def sale(self, request):
        sale_products = Product.objects.filter(sale=True)
        serializer = self.get_serializer(sale_products, many=True)
        return Response(serializer.data)

class ShippingAgentViewSet(viewsets.ModelViewSet):
    queryset = ShippingAgent.objects.all()
    serializer_class = ShippingAgentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(store=self.request.user.store)

    def get_queryset(self):
        queryset = ShippingAgent.objects.all()
        if not self.request.user.is_staff:
            queryset = queryset.filter(store=self.request.user.store)
        return queryset

@api_view(['GET'])
def store_info(request):
    """
    Get store information based on subdomain
    """
    subdomain = getattr(request, 'subdomain', None)
    
    if not subdomain:
        return Response({
            'error': 'No subdomain found',
            'message': 'This endpoint requires a subdomain'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        store = Store.objects.get(domain=subdomain)
        serializer = StoreSerializer(store)
        return Response({
            'store': serializer.data,
            'subdomain': subdomain,
            'full_url': f"https://{subdomain}.{request.get_host().split('.', 1)[1] if '.' in request.get_host() else 'mydomain.com'}"
        })
    except Store.DoesNotExist:
        return Response({
            'error': 'Store not found',
            'subdomain': subdomain,
            'message': f'No store found for subdomain: {subdomain}'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def subdomain_products(request):
    """
    Get products for a specific store based on subdomain
    """
    subdomain = getattr(request, 'subdomain', None)
    
    if not subdomain:
        return Response({
            'error': 'No subdomain found',
            'message': 'This endpoint requires a subdomain'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        store = Store.objects.get(domain=subdomain)
        products = Product.objects.filter(store=store)
        serializer = ProductSerializer(products, many=True)
        return Response({
            'store': store.name,
            'subdomain': subdomain,
            'products': serializer.data,
            'count': products.count()
        })
    except Store.DoesNotExist:
        return Response({
            'error': 'Store not found',
            'subdomain': subdomain,
            'message': f'No store found for subdomain: {subdomain}'
        }, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def subdomain_test(request):
    """
    Test endpoint to verify subdomain functionality
    """
    subdomain = getattr(request, 'subdomain', None)
    host = request.get_host()
    
    return Response({
        'message': 'Subdomain test successful',
        'subdomain': subdomain,
        'host': host,
        'full_url': request.build_absolute_uri(),
        'available_stores': list(Store.objects.values_list('domain', 'name'))
    })
