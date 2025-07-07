from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import Category, Product, ProductImage, ProductSpecification, Store, ShippingAgent

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'first_name', 'last_name')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "A user with that email already exists."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['id', 'name', 'domain', 'description', 'logo', 'theme', 'contact_info', 'social_media', 'created_at', 'updated_at']

class ProductSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpecification
        fields = ['id', 'name', 'value']

class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'image_url']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    specifications = ProductSpecificationSerializer(many=True, read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    image_url = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'sale_price', 
            'image', 'image_url', 'category', 'category_name', 'stock', 
            'created_at', 'updated_at', 'featured', 'new_arrival',
            'sale', 'rating', 'review_count', 'sku', 'specifications',
            'images'
        ]
        extra_kwargs = {
            'image': {'required': False},
        }

class CategorySerializer(serializers.ModelSerializer):
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'products_count']
    
    def get_products_count(self, obj):
        return obj.products.count()

class ProductDetailSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    specifications = ProductSpecificationSerializer(many=True, required=False)
    images = ProductImageSerializer(many=True, required=False)
    image_url = serializers.ReadOnlyField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'sale_price', 
            'image', 'image_url', 'category', 'category_name', 'stock', 
            'created_at', 'updated_at', 'featured', 'new_arrival',
            'sale', 'rating', 'review_count', 'sku', 'specifications',
            'images'
        ]
        extra_kwargs = {
            'image': {'required': False},
        }
    
    def validate(self, data):
        print("التحقق من البيانات:", data)
        return data
    
    def create(self, validated_data):
        print("بيانات إنشاء المنتج المصدقة:", validated_data)
        specifications_data = validated_data.pop('specifications', [])
        
        # لن نستخدم هذا حيث إننا نتعامل مع الصور في الـ view
        images_data = validated_data.pop('images', [])
        
        product = Product.objects.create(**validated_data)
        
        for spec_data in specifications_data:
            ProductSpecification.objects.create(product=product, **spec_data)
        
        # لا نحتاج إلى هذا لأننا نتعامل مع الصور في ProductViewSet.create
        # for image_data in images_data:
        #    ProductImage.objects.create(product=product, **image_data)
        
        return product
    
    def update(self, instance, validated_data):
        print("بيانات تحديث المنتج:", validated_data)
        specifications_data = validated_data.pop('specifications', [])
        images_data = validated_data.pop('images', [])
        
        # Update product fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Handle specifications
        if specifications_data:
            instance.specifications.all().delete()
            for spec_data in specifications_data:
                ProductSpecification.objects.create(product=instance, **spec_data)
        
        # Handle images
        if images_data:
            instance.images.all().delete()
            for image_data in images_data:
                ProductImage.objects.create(product=instance, **image_data)
        
        return instance 

class ShippingAgentSerializer(serializers.ModelSerializer):
    store_name = serializers.ReadOnlyField(source='store.name')

    class Meta:
        model = ShippingAgent
        fields = [
            'id', 'store', 'store_name', 'name', 'contact_info', 
            'service_areas', 'rates', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['store'] 