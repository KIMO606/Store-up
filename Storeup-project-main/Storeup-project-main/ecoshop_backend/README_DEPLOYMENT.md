# دليل النشر على Render مع دعم النطاقات الفرعية

## المتطلبات المسبقة
- حساب على [Render](https://render.com)
- معرفة أساسية بـ Git
- دومين مخصص (اختياري)

## الخطوة 1: إعداد المشروع محلياً

### 1.1 تثبيت المتطلبات
```bash
cd ecoshop_backend
pip install -r requirements.txt
```

### 1.2 إعداد المتغيرات البيئية
انسخ ملف `env.example` إلى `.env` وعدل القيم:
```bash
cp env.example .env
```

### 1.3 تشغيل الهجرات
```bash
python manage.py migrate
```

### 1.4 إنشاء مستخدم مشرف
```bash
python manage.py createsuperuser
```

### 1.5 جمع الملفات الثابتة
```bash
python manage.py collectstatic
```

## الخطوة 2: النشر على Render

### 2.1 رفع الكود إلى GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2.2 إنشاء خدمة جديدة على Render
1. اذهب إلى [Render Dashboard](https://dashboard.render.com)
2. انقر على "New +" ثم اختر "Web Service"
3. اربط مستودع GitHub الخاص بك
4. اختر الفرع `main`

### 2.3 إعداد الخدمة
- **Name**: `ecoshop-backend`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn ecoshop_backend.wsgi:application`

### 2.4 إعداد المتغيرات البيئية
في Render Dashboard، أضف المتغيرات التالية:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | `your-secret-key-here` |
| `DEBUG` | `false` |
| `DOMAIN` | `onrender.com` |
| `FRONTEND_DOMAIN` | `your-frontend-domain.com` |
| `BASE_URL` | `https://your-app-name.onrender.com` |

### 2.5 إعداد قاعدة البيانات
1. في Render Dashboard، أنشئ "PostgreSQL" جديد
2. انسخ رابط الاتصال
3. أضف متغير `DATABASE_URL` مع الرابط المنسوخ

## الخطوة 3: اختبار النطاقات الفرعية

### 3.1 إنشاء متاجر تجريبية
بعد النشر، اذهب إلى لوحة الإدارة وأنشئ متاجر مع نطاقات فرعية:
- متجر 1: `store1`
- متجر 2: `store2`
- متجر 3: `test`

### 3.2 اختبار النطاقات الفرعية
اختبر النطاقات الفرعية عبر:
```
https://store1-your-app-name.onrender.com/api/subdomain/test/
https://store2-your-app-name.onrender.com/api/subdomain/test/
https://test-your-app-name.onrender.com/api/subdomain/test/
```

### 3.3 اختبار معلومات المتجر
```
https://store1-your-app-name.onrender.com/api/store/info/
https://store2-your-app-name.onrender.com/api/store/products/
```

## الخطوة 4: إعداد النطاق المخصص (اختياري)

### 4.1 إعداد DNS
في لوحة تحكم الدومين، أضف:
```
*.yourdomain.com   CNAME   your-app-name.onrender.com
```

### 4.2 تحديث المتغيرات البيئية
غير `DOMAIN` إلى `yourdomain.com`

### 4.3 اختبار النطاق المخصص
```
https://store1.yourdomain.com/api/subdomain/test/
https://store2.yourdomain.com/api/store/info/
```

## الخطوة 5: رفع الواجهة الأمامية

### 5.1 إعداد React للعمل مع النطاقات الفرعية
عدل ملف `src/services/apiService.js` ليستخدم النطاق الفرعي:

```javascript
const getApiUrl = () => {
  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];
  
  if (hostname.includes('onrender.com')) {
    return `https://${subdomain}-your-app-name.onrender.com/api`;
  } else if (hostname.includes('yourdomain.com')) {
    return `https://${hostname}/api`;
  }
  
  return 'http://localhost:8000/api';
};
```

### 5.2 نشر الواجهة الأمامية
يمكنك نشر React على:
- Vercel
- Netlify
- Render (Static Site)

## استكشاف الأخطاء

### مشكلة: النطاق الفرعي لا يعمل
1. تأكد من إعداد `ALLOWED_HOSTS` بشكل صحيح
2. تحقق من middleware
3. اختبر endpoint `/api/subdomain/test/`

### مشكلة: CORS
1. تأكد من إعداد `CORS_ALLOWED_ORIGINS`
2. أضف نطاق الواجهة الأمامية

### مشكلة: قاعدة البيانات
1. تحقق من `DATABASE_URL`
2. تأكد من تشغيل الهجرات

## روابط مفيدة
- [Render Documentation](https://render.com/docs)
- [Django Deployment](https://docs.djangoproject.com/en/5.0/howto/deployment/)
- [Gunicorn Documentation](https://gunicorn.org/)

## الدعم
إذا واجهت أي مشكلة، راجع:
1. سجلات Render في Dashboard
2. endpoint `/api/subdomain/test/` للتأكد من عمل النطاقات الفرعية
3. إعدادات المتغيرات البيئية 