import React, { useEffect, useState } from 'react';
import { productService, categoryService } from '../services/apiService';

const ApiTest = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // اختبار جلب كل المنتجات
        const productsData = await productService.getAllProducts();
        console.log('تم جلب المنتجات:', productsData);
        setProducts(productsData);

        // اختبار جلب كل الفئات
        const categoriesData = await categoryService.getAllCategories();
        console.log('تم جلب الفئات:', categoriesData);
        setCategories(categoriesData);

        setLoading(false);
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-4 text-center">جاري التحميل...</div>;
  if (error) return <div className="p-4 text-center text-red-500">خطأ: {error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">اختبار الربط مع الباك إند</h1>
      
      <h2 className="text-lg font-semibold mt-4 mb-2">الفئات:</h2>
      {categories.length === 0 ? (
        <p>لا توجد فئات</p>
      ) : (
        <ul className="list-disc list-inside">
          {categories.map((category) => (
            <li key={category.id}>
              {category.name} - {category.description}
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-lg font-semibold mt-4 mb-2">المنتجات:</h2>
      {products.length === 0 ? (
        <p>لا توجد منتجات</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border rounded p-4">
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-gray-600">{product.description.substring(0, 100)}...</p>
              <p className="mt-2">
                <span className="font-semibold">السعر:</span> {product.price} ريال
              </p>
              {product.sale_price && (
                <p className="text-red-600">
                  <span className="font-semibold">سعر التخفيض:</span> {product.sale_price} ريال
                </p>
              )}
              <p>
                <span className="font-semibold">الفئة:</span> {product.category_name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApiTest; 