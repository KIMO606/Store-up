from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

# Create your models here.

class Store(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stores', null=True, blank=True)
    name = models.CharField(max_length=200)
    domain = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='stores/logos/', blank=True, null=True)
    theme = models.JSONField(default=dict, blank=True)
    contact_info = models.JSONField(default=dict, blank=True)
    social_media = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "متجر"
        verbose_name_plural = "متاجر"

class ShippingAgent(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='shipping_agents')
    name = models.CharField(max_length=200)
    contact_info = models.JSONField(default=dict)
    service_areas = models.JSONField(default=list)
    rates = models.JSONField(default=dict)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.store.name}"
    
    class Meta:
        verbose_name = "وكيل شحن"
        verbose_name_plural = "وكلاء الشحن"

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='categories', null=True, blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "فئة"
        verbose_name_plural = "فئات"

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    image = models.ImageField(upload_to='products/')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='products', null=True, blank=True)
    stock = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    featured = models.BooleanField(default=False)
    new_arrival = models.BooleanField(default=False)
    sale = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    review_count = models.IntegerField(default=0)
    sku = models.CharField(max_length=100, blank=True)
    
    def __str__(self):
        return self.name
    
    @property
    def image_url(self):
        if self.image:
            # Return full absolute URL including domain
            return f"{settings.BASE_URL}{self.image.url}" if hasattr(settings, 'BASE_URL') else self.image.url
        return ''
    
    class Meta:
        verbose_name = "منتج"
        verbose_name_plural = "منتجات"

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    
    def __str__(self):
        return f"صورة لـ {self.product.name}"
    
    @property
    def image_url(self):
        if self.image:
            # Return full absolute URL including domain
            return f"{settings.BASE_URL}{self.image.url}" if hasattr(settings, 'BASE_URL') else self.image.url
        return ''
    
    class Meta:
        verbose_name = "صورة المنتج"
        verbose_name_plural = "صور المنتجات"

class ProductSpecification(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='specifications')
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=255)
    
    def __str__(self):
        return f"{self.name}: {self.value}"
    
    class Meta:
        verbose_name = "مواصفات المنتج"
        verbose_name_plural = "مواصفات المنتجات"
