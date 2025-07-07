from django.contrib import admin
from .models import Category, Product, ProductImage, ProductSpecification

class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 1

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'sale_price', 'category', 'stock', 'featured', 'new_arrival', 'sale')
    list_filter = ('category', 'featured', 'new_arrival', 'sale')
    search_fields = ('name', 'description')
    inlines = [ProductImageInline, ProductSpecificationInline]

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
