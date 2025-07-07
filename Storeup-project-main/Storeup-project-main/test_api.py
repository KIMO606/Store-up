import requests
import json

# عنوان API
API_URL = "http://localhost:8000/api/products/"

# الفئة التي سيتم استخدامها (يجب أن تكون موجودة بالفعل)
# يمكنك الحصول على معرف الفئة من خلال API الفئات: http://localhost:8000/api/categories/
CATEGORY_ID = 1  # قم بتغيير هذا إلى معرف فئة موجودة

# بيانات المنتج الذي سيتم إنشاؤه
product_data = {
    "name": "منتج اختبار API",
    "description": "وصف منتج للاختبار",
    "price": 199.99,
    "sale_price": 149.99,
    "category": CATEGORY_ID,
    "stock": 10,
    "featured": True,
    "new_arrival": True,
    "sale": True
}

# إرسال طلب POST لإنشاء المنتج
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(API_URL, data=json.dumps(product_data), headers=headers)
    
    # طباعة الاستجابة
    print(f"Status Code: {response.status_code}")
    print("Response Content:")
    
    try:
        json_response = response.json()
        print(json.dumps(json_response, indent=2, ensure_ascii=False))
    except:
        print(response.text)
        
except Exception as e:
    print(f"Error: {e}") 