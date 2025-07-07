from django.core.management.base import BaseCommand
from api.models import Category, Product, ProductSpecification, ProductImage
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'تحميل بيانات تجريبية في قاعدة البيانات'

    def handle(self, *args, **kwargs):
        # إنشاء مستخدم مشرف إذا لم يكن موجوداً
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser('admin', 'admin@example.com', 'admin')
            self.stdout.write(self.style.SUCCESS('تم إنشاء مستخدم المشرف بنجاح'))

        # حذف البيانات الموجودة
        ProductSpecification.objects.all().delete()
        ProductImage.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()

        # إنشاء الفئات
        electronics = Category.objects.create(
            name='إلكترونيات',
            description='أجهزة إلكترونية متنوعة'
        )
        
        clothes = Category.objects.create(
            name='ملابس',
            description='ملابس رجالية ونسائية وأطفال'
        )
        
        home_garden = Category.objects.create(
            name='منزل وحديقة',
            description='منتجات للمنزل والحديقة'
        )
        
        personal_care = Category.objects.create(
            name='العناية الشخصية',
            description='منتجات العناية الشخصية'
        )
        
        self.stdout.write(self.style.SUCCESS('تم إنشاء الفئات بنجاح'))

        # إنشاء المنتجات
        phone = Product.objects.create(
            name='هاتف ذكي صديق للبيئة',
            price=1999,
            sale_price=1799,
            category=electronics,
            description='هاتف ذكي عالي الأداء مصنوع من مواد معاد تدويرها وصديقة للبيئة. يتميز بشاشة عالية الدقة وبطارية طويلة العمر وكاميرا متطورة.',
            image='products/phone_placeholder.jpg',
            stock=50,
            featured=True,
            new_arrival=False,
            sale=True,
            rating=4.5,
            review_count=120,
            sku='SKU-PHONE-001'
        )
        
        headphones = Product.objects.create(
            name='سماعات لاسلكية مستدامة',
            price=499,
            sale_price=None,
            category=electronics,
            description='سماعات لاسلكية عالية الجودة مصنوعة من مواد مستدامة. تتميز بجودة صوت استثنائية وعمر بطارية طويل ومقاومة للماء.',
            image='products/headphones_placeholder.jpg',
            stock=30,
            featured=False,
            new_arrival=True,
            sale=False,
            rating=4.3,
            review_count=85,
            sku='SKU-HEAD-001'
        )
        
        tshirt = Product.objects.create(
            name='قميص قطني عضوي',
            price=199,
            sale_price=149,
            category=clothes,
            description='قميص مصنوع من القطن العضوي 100٪، مريح وأنيق ومناسب لجميع المناسبات. متوفر بعدة ألوان وأحجام.',
            image='products/tshirt_placeholder.jpg',
            stock=100,
            featured=True,
            new_arrival=False,
            sale=True,
            rating=4.7,
            review_count=65,
            sku='SKU-TSHIRT-001'
        )
        
        self.stdout.write(self.style.SUCCESS('تم إنشاء المنتجات بنجاح'))

        # إضافة مواصفات للمنتجات
        ProductSpecification.objects.create(
            product=phone,
            name='المعالج',
            value='ثماني النواة 2.5 جيجاهرتز'
        )
        
        ProductSpecification.objects.create(
            product=phone,
            name='الذاكرة',
            value='8 جيجابايت'
        )
        
        ProductSpecification.objects.create(
            product=phone,
            name='التخزين',
            value='128 جيجابايت'
        )
        
        ProductSpecification.objects.create(
            product=phone,
            name='الشاشة',
            value='6.5 بوصة AMOLED'
        )
        
        ProductSpecification.objects.create(
            product=phone,
            name='البطارية',
            value='5000 مللي أمبير'
        )
        
        ProductSpecification.objects.create(
            product=headphones,
            name='نوع الاتصال',
            value='بلوتوث 5.2'
        )
        
        ProductSpecification.objects.create(
            product=headphones,
            name='عمر البطارية',
            value='30 ساعة'
        )
        
        ProductSpecification.objects.create(
            product=headphones,
            name='مقاومة الماء',
            value='IPX7'
        )
        
        self.stdout.write(self.style.SUCCESS('تم إضافة مواصفات المنتجات بنجاح'))

        # إضافة صور إضافية للمنتجات
        ProductImage.objects.create(
            product=phone,
            image='products/phone_placeholder_2.jpg'
        )
        
        ProductImage.objects.create(
            product=phone,
            image='products/phone_placeholder_3.jpg'
        )
        
        ProductImage.objects.create(
            product=headphones,
            image='products/headphones_placeholder_2.jpg'
        )
        
        ProductImage.objects.create(
            product=tshirt,
            image='products/tshirt_placeholder_2.jpg'
        )
        
        ProductImage.objects.create(
            product=tshirt,
            image='products/tshirt_placeholder_3.jpg'
        )
        
        self.stdout.write(self.style.SUCCESS('تم إضافة صور المنتجات بنجاح'))
        
        self.stdout.write(self.style.SUCCESS('تم تحميل البيانات التجريبية بنجاح!')) 