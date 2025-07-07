from django.core.management.base import BaseCommand
from api.models import Store, Category, Product
from django.core.files.base import ContentFile
import os

class Command(BaseCommand):
    help = 'Create test stores for subdomain testing'

    def handle(self, *args, **options):
        # Create test stores
        stores_data = [
            {
                'name': 'متجر الإلكترونيات',
                'domain': 'store1',
                'description': 'متجر متخصص في الإلكترونيات والأجهزة الذكية',
                'theme': {
                    'primaryColor': '#3B82F6',
                    'secondaryColor': '#1E40AF',
                    'fontFamily': 'Arial'
                }
            },
            {
                'name': 'متجر الأزياء',
                'domain': 'store2', 
                'description': 'متجر للأزياء والملابس العصرية',
                'theme': {
                    'primaryColor': '#EC4899',
                    'secondaryColor': '#BE185D',
                    'fontFamily': 'Arial'
                }
            },
            {
                'name': 'متجر الكتب',
                'domain': 'test',
                'description': 'متجر للكتب والقرطاسية',
                'theme': {
                    'primaryColor': '#10B981',
                    'secondaryColor': '#047857',
                    'fontFamily': 'Arial'
                }
            }
        ]

        for store_data in stores_data:
            store, created = Store.objects.get_or_create(
                domain=store_data['domain'],
                defaults={
                    'name': store_data['name'],
                    'description': store_data['description'],
                    'theme': store_data['theme']
                }
            )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created store: {store.name} ({store.domain})')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Store already exists: {store.name} ({store.domain})')
                )

        # Create test categories for each store
        categories_data = [
            {'name': 'هواتف ذكية', 'store_domain': 'store1'},
            {'name': 'حواسيب محمولة', 'store_domain': 'store1'},
            {'name': 'ملابس رجالية', 'store_domain': 'store2'},
            {'name': 'ملابس نسائية', 'store_domain': 'store2'},
            {'name': 'كتب تعليمية', 'store_domain': 'test'},
            {'name': 'روايات', 'store_domain': 'test'},
        ]

        for cat_data in categories_data:
            try:
                store = Store.objects.get(domain=cat_data['store_domain'])
                category, created = Category.objects.get_or_create(
                    name=cat_data['name'],
                    store=store,
                    defaults={'description': f'فئة {cat_data["name"]} في {store.name}'}
                )
                
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(f'Created category: {category.name} for {store.name}')
                    )
            except Store.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f'Store not found: {cat_data["store_domain"]}')
                )

        # Create test products
        products_data = [
            {
                'name': 'iPhone 15 Pro',
                'price': 4500,
                'sale_price': 4200,
                'description': 'هاتف ذكي من Apple',
                'store_domain': 'store1',
                'category_name': 'هواتف ذكية'
            },
            {
                'name': 'MacBook Air M2',
                'price': 8500,
                'sale_price': 8000,
                'description': 'حاسوب محمول من Apple',
                'store_domain': 'store1',
                'category_name': 'حواسيب محمولة'
            },
            {
                'name': 'قميص كلاسيك',
                'price': 150,
                'sale_price': 120,
                'description': 'قميص رجالي أنيق',
                'store_domain': 'store2',
                'category_name': 'ملابس رجالية'
            },
            {
                'name': 'فستان أنيق',
                'price': 300,
                'sale_price': 250,
                'description': 'فستان نسائي أنيق',
                'store_domain': 'store2',
                'category_name': 'ملابس نسائية'
            },
            {
                'name': 'كتاب البرمجة',
                'price': 80,
                'sale_price': 70,
                'description': 'كتاب تعليمي للبرمجة',
                'store_domain': 'test',
                'category_name': 'كتب تعليمية'
            }
        ]

        for prod_data in products_data:
            try:
                store = Store.objects.get(domain=prod_data['store_domain'])
                category = Category.objects.get(
                    name=prod_data['category_name'],
                    store=store
                )
                
                product, created = Product.objects.get_or_create(
                    name=prod_data['name'],
                    store=store,
                    defaults={
                        'price': prod_data['price'],
                        'sale_price': prod_data['sale_price'],
                        'description': prod_data['description'],
                        'category': category,
                        'is_featured': True,
                        'is_new': True,
                        'is_on_sale': True
                    }
                )
                
                if created:
                    self.stdout.write(
                        self.style.SUCCESS(f'Created product: {product.name} in {store.name}')
                    )
            except (Store.DoesNotExist, Category.DoesNotExist) as e:
                self.stdout.write(
                    self.style.ERROR(f'Error creating product {prod_data["name"]}: {e}')
                )

        self.stdout.write(
            self.style.SUCCESS('Successfully populated test stores, categories, and products!')
        ) 