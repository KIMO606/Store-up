import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  ArrowPathIcon,
  CameraIcon,
  SwatchIcon,
  CogIcon,
  GlobeAltIcon,
  TagIcon,
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import { updateStore } from '../../features/store/storeSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const StoreSettings = () => {
  const dispatch = useDispatch();
  const { currentStore, loading, error } = useSelector((state) => state.store);
  
  const [activeTab, setActiveTab] = useState('general');
  const [logoPreview, setLogoPreview] = useState(currentStore?.logo || '');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    if (currentStore?.logo) {
      setLogoPreview(currentStore.logo);
    }
  }, [currentStore]);
  
  // Handle logo upload
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        formik.setFieldValue('logo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Formik form validation
  const formik = useFormik({
    initialValues: {
      name: currentStore?.name || '',
      domain: currentStore?.domain || '',
      description: currentStore?.description || '',
      logo: currentStore?.logo || '',
      theme: {
        primaryColor: currentStore?.theme?.primaryColor || '#0ea5e9',
        secondaryColor: currentStore?.theme?.secondaryColor || '#8b5cf6',
        fontFamily: currentStore?.theme?.fontFamily || 'Cairo, sans-serif',
      },
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      name: Yup.string().required('اسم المتجر مطلوب'),
      domain: Yup.string()
        .matches(/^[a-z0-9-]+$/, 'يجب أن يحتوي النطاق على أحرف صغيرة وأرقام وشرطات فقط')
        .required('نطاق المتجر مطلوب'),
      description: Yup.string().max(500, 'الوصف يجب أن يكون أقل من 500 حرف'),
    }),
    onSubmit: (values) => {
      dispatch(updateStore({
        storeId: currentStore.id,
        storeData: values,
      })).then((result) => {
        if (!result.error) {
          setShowSuccessToast(true);
          setTimeout(() => setShowSuccessToast(false), 3000);
          
          // فتح رابط معاينة المتجر في نافذة جديدة بعد 1 ثانية
          setTimeout(() => {
            window.open(`/store/${currentStore.id}`, '_blank');
          }, 1000);
        }
      });
    },
  });
  
  // Navigation tabs
  const tabs = [
    { id: 'general', name: 'عام', icon: CogIcon },
    { id: 'appearance', name: 'المظهر', icon: SwatchIcon },
    { id: 'domain', name: 'النطاق', icon: GlobeAltIcon },
  ];
  
  // وظيفة لتصدير إعدادات المتجر
  const exportSettings = () => {
    if (!currentStore) return;
    
    const settingsToExport = {
      name: currentStore.name,
      description: currentStore.description,
      logo: currentStore.logo,
      domain: currentStore.domain,
      theme: currentStore.theme,
      contactInfo: currentStore.contactInfo,
      socialMedia: currentStore.socialMedia,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(settingsToExport, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileName = `${currentStore.name.replace(/\s+/g, '_')}_settings.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    // إظهار رسالة نجاح
    toast.success('تم تصدير إعدادات المتجر بنجاح!');
  };
  
  // وظيفة لاستيراد إعدادات المتجر
  const importSettings = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        
        // التحقق من صحة الملف المستورد
        if (!importedSettings.name || !importedSettings.theme) {
          toast.error('الملف المستورد غير صالح');
          return;
        }
        
        // تحديث formik values
        formik.setValues({
          name: importedSettings.name || formik.values.name,
          domain: importedSettings.domain || formik.values.domain,
          description: importedSettings.description || formik.values.description,
          logo: importedSettings.logo || formik.values.logo,
          theme: {
            primaryColor: importedSettings.theme?.primaryColor || formik.values.theme.primaryColor,
            secondaryColor: importedSettings.theme?.secondaryColor || formik.values.theme.secondaryColor,
            fontFamily: importedSettings.theme?.fontFamily || formik.values.theme.fontFamily,
          }
        });
        
        // تحديث معاينة الشعار إذا كان موجود
        if (importedSettings.logo) {
          setLogoPreview(importedSettings.logo);
        }
        
        toast.success('تم استيراد إعدادات المتجر بنجاح!');
        
      } catch (error) {
        toast.error('حدث خطأ أثناء قراءة الملف');
        console.error(error);
      }
    };
    
    reader.readAsText(file);
    
    // إعادة تعيين قيمة حقل الإدخال ليسمح باختيار نفس الملف مرة أخرى
    event.target.value = '';
  };
  
  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">إعدادات المتجر</h1>
          <p className="mt-1 text-sm text-gray-500">
            إدارة إعدادات متجرك وتخصيصه ليناسب علامتك التجارية.
          </p>
        </div>
        <div className="mt-3 flex sm:mt-0 sm:mr-4 space-x-3 rtl:space-x-reverse">
          <input
            type="file"
            className="sr-only"
            ref={fileInputRef}
            accept=".json"
            onChange={importSettings}
          />
          
        
          
          
          <Link
            to={`/store/${currentStore?.id}`}
            target="_blank"
            className="inline-flex items-center bg-primary-600 text-white px-4 py-2 rounded-md"
            
            style={{ backgroundColor: formik.values.theme?.primaryColor || '#0ea5e9' }}
          >
            <GlobeAltIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
            معاينة المتجر
          </Link>
        </div>
      </div>
      
      {/* Settings navigation */}
      <div className="bg-white rounded-lg shadow-soft overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 rtl:space-x-reverse px-4" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 inline-flex items-center text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon
                    className={`ml-2 h-5 w-5 ${
                      activeTab === tab.id ? 'text-primary-500' : 'text-gray-400'
                    }`}
                  />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="store-name" className="form-label">
                  اسم المتجر
                </label>
                <input
                  type="text"
                  id="store-name"
                  name="name"
                  className={`form-input ${
                    formik.touched.name && formik.errors.name ? 'border-red-500' : ''
                  }`}
                  placeholder="أدخل اسم متجرك"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="store-description" className="form-label">
                  وصف المتجر
                </label>
                <textarea
                  id="store-description"
                  name="description"
                  rows={3}
                  className={`form-input ${
                    formik.touched.description && formik.errors.description ? 'border-red-500' : ''
                  }`}
                  placeholder="أدخل وصف لمتجرك"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.description}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  اكتب وصف موجز لمتجرك. سيظهر هذا في صفحة المتجر الرئيسية والبحث.
                </p>
              </div>
              
              <div>
                <label className="form-label">شعار المتجر</label>
                <div className="mt-1 flex items-center">
                  <div className="h-16 w-16 overflow-hidden rounded-md border border-gray-300 bg-gray-100">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Store logo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        <TagIcon className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer mr-4 rounded-md bg-white py-2 px-3 text-sm font-medium text-primary-600 border border-gray-300 hover:bg-gray-50"
                  >
                    <span>تغيير</span>
                    <input
                      id="logo-upload"
                      name="logo-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  يُنصح بتحميل صورة بأبعاد 512x512 بكسل.
                </p>
              </div>
            </div>
          )}
          
          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="store-primary-color" className="form-label">
                  اللون الأساسي
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="color"
                    id="store-primary-color"
                    name="theme.primaryColor"
                    className="h-8 w-20 p-1 border border-gray-300 rounded-md"
                    value={formik.values.theme.primaryColor}
                    onChange={formik.handleChange}
                  />
                  <span className="mr-3 text-sm text-gray-500">{formik.values.theme.primaryColor}</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="store-secondary-color" className="form-label">
                  اللون الثانوي
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="color"
                    id="store-secondary-color"
                    name="theme.secondaryColor"
                    className="h-8 w-20 p-1 border border-gray-300 rounded-md"
                    value={formik.values.theme.secondaryColor}
                    onChange={formik.handleChange}
                  />
                  <span className="mr-3 text-sm text-gray-500">{formik.values.theme.secondaryColor}</span>
                </div>
              </div>
              
              <div>
                <label htmlFor="store-font-family" className="form-label">
                  الخط
                </label>
                <select
                  id="store-font-family"
                  name="theme.fontFamily"
                  className="form-input"
                  value={formik.values.theme.fontFamily}
                  onChange={formik.handleChange}
                >
                  <option value="Cairo, sans-serif">Cairo</option>
                  <option value="Tajawal, sans-serif">Tajawal</option>
                  <option value="Almarai, sans-serif">Almarai</option>
                  <option value="Markazi Text, serif">Markazi Text</option>
                  <option value="IBM Plex Sans Arabic, sans-serif">IBM Plex Sans Arabic</option>
                  <option value="Lateef, serif">Lateef</option>
                  <option value="El Messiri, sans-serif">El Messiri</option>
                  <option value="Reem Kufi, sans-serif">Reem Kufi</option>
                </select>
              </div>
              
              <div className="mt-4">
                <label className="form-label">شكل الأزرار</label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mt-2">
                  <button
                    type="button"
                    className={`p-4 rounded-md flex flex-col items-center justify-center border ${
                      !formik.values.theme.buttonStyle || formik.values.theme.buttonStyle === 'rounded-md'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => formik.setFieldValue('theme.buttonStyle', 'rounded-md')}
                  >
                    <span
                      className="w-16 h-8 flex items-center justify-center text-white text-xs rounded-md mb-2"
                      style={{ backgroundColor: formik.values.theme.primaryColor }}
                    >
                      زر
                    </span>
                    <span className="text-xs font-medium">افتراضي</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`p-4 rounded-md flex flex-col items-center justify-center border ${
                      formik.values.theme.buttonStyle === 'rounded-full'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => formik.setFieldValue('theme.buttonStyle', 'rounded-full')}
                  >
                    <span
                      className="w-16 h-8 flex items-center justify-center text-white text-xs rounded-full mb-2"
                      style={{ backgroundColor: formik.values.theme.primaryColor }}
                    >
                      زر
                    </span>
                    <span className="text-xs font-medium">دائري</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`p-4 rounded-md flex flex-col items-center justify-center border ${
                      formik.values.theme.buttonStyle === 'rounded-none'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => formik.setFieldValue('theme.buttonStyle', 'rounded-none')}
                  >
                    <span
                      className="w-16 h-8 flex items-center justify-center text-white text-xs rounded-none mb-2"
                      style={{ backgroundColor: formik.values.theme.primaryColor }}
                    >
                      زر
                    </span>
                    <span className="text-xs font-medium">مربع</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`p-4 rounded-md flex flex-col items-center justify-center border ${
                      formik.values.theme.buttonStyle === 'rounded-xl'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => formik.setFieldValue('theme.buttonStyle', 'rounded-xl')}
                  >
                    <span
                      className="w-16 h-8 flex items-center justify-center text-white text-xs rounded-xl mb-2"
                      style={{ backgroundColor: formik.values.theme.primaryColor }}
                    >
                      زر
                    </span>
                    <span className="text-xs font-medium">منحني</span>
                  </button>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="form-label">تخطيط المتجر</label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    className={`p-4 rounded-md flex flex-col items-center justify-center border ${
                      !formik.values.theme.layout || formik.values.theme.layout === 'standard'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => formik.setFieldValue('theme.layout', 'standard')}
                  >
                    <div className="w-full h-20 bg-gray-100 rounded-md flex flex-col mb-2 overflow-hidden">
                      <div className="h-4 bg-gray-200 w-full"></div>
                      <div className="flex-1 p-1">
                        <div className="grid grid-cols-2 gap-1 h-full">
                          <div className="bg-gray-200 rounded-sm"></div>
                          <div className="bg-gray-200 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium">قياسي</span>
                  </button>
                  
                  <button
                    type="button"
                    className={`p-4 rounded-md flex flex-col items-center justify-center border ${
                      formik.values.theme.layout === 'modern'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => formik.setFieldValue('theme.layout', 'modern')}
                  >
                    <div className="w-full h-20 bg-gray-100 rounded-md flex flex-col mb-2 overflow-hidden">
                      <div className="h-8 bg-gray-200 w-full"></div>
                      <div className="flex-1 p-1">
                        <div className="grid grid-cols-3 gap-1 h-full">
                          <div className="bg-gray-200 rounded-full"></div>
                          <div className="bg-gray-200 rounded-full"></div>
                          <div className="bg-gray-200 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-medium">عصري</span>
                  </button>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">معاينة</h3>
                <div
                  className="mt-2 p-4 rounded-lg border border-gray-200"
                  style={{
                    fontFamily: formik.values.theme.fontFamily.split(',')[0],
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold" style={{ color: formik.values.theme.primaryColor }}>
                      {formik.values.name || 'اسم المتجر'}
                    </h4>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-md text-white"
                      style={{ backgroundColor: formik.values.theme.primaryColor }}
                    >
                      زر أساسي
                    </button>
                  </div>
                  <p className="mt-2 text-gray-700">{formik.values.description || 'وصف المتجر سيظهر هنا...'}</p>
                  <div className="mt-3 flex items-center">
                    <span
                      className="inline-block h-4 w-4 rounded-full mr-1"
                      style={{ backgroundColor: formik.values.theme.secondaryColor }}
                    ></span>
                    <span style={{ color: formik.values.theme.secondaryColor }}>عنصر ثانوي</span>
                  </div>
                </div>
              </div>
              
              {/* معاينة متقدمة */}
              <div className="mt-6">
                <details className="group">
                  <summary className="flex items-center text-sm font-medium text-gray-900 hover:text-gray-700 cursor-pointer">
                    <span>معاينة متقدمة</span>
                    <svg
                      className="ml-1 h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform duration-150"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </summary>
                  <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50 py-2 px-4 text-sm font-medium text-gray-900">
                      معاينة المتجر
                    </div>
                    <div className="p-4">
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden" style={{ fontFamily: formik.values.theme.fontFamily.split(',')[0] }}>
                        {/* Header */}
                        <div className="border-b border-gray-200 p-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              {logoPreview ? (
                                <img
                                  src={logoPreview}
                                  alt="شعار المتجر"
                                  className="h-8 w-8 rounded-full object-cover"
                                />
                              ) : (
                                <div
                                  className="h-8 w-8 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: formik.values.theme.primaryColor }}
                                >
                                  <span className="text-white font-bold">
                                    {formik.values.name ? formik.values.name[0].toUpperCase() : 'S'}
                                  </span>
                                </div>
                              )}
                            </div>
                            <h3
                              className="mr-3 text-lg font-bold"
                              style={{ color: formik.values.theme.primaryColor }}
                            >
                              {formik.values.name || 'اسم المتجر'}
                            </h3>
                          </div>
                        </div>
                        
                        {/* Products */}
                        <div className="p-4">
                          <h4 className="text-md font-medium mb-3">منتجات مميزة</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {/* منتج 1 */}
                            <div className="border border-gray-200 rounded-md overflow-hidden">
                              <div className="aspect-h-1 aspect-w-1 bg-gray-200 h-24">
                                <div className="flex items-center justify-center h-full">صورة المنتج</div>
                              </div>
                              <div className="p-2">
                                <h5 className="text-sm font-medium">اسم المنتج</h5>
                                <div className="mt-1 flex justify-between items-center">
                                  <span className="text-xs font-bold">99 ر.س</span>
                                  <button
                                    className="p-1 rounded-full text-white"
                                    style={{ backgroundColor: formik.values.theme.primaryColor }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {/* منتج 2 */}
                            <div className="border border-gray-200 rounded-md overflow-hidden">
                              <div className="aspect-h-1 aspect-w-1 bg-gray-200 h-24">
                                <div className="flex items-center justify-center h-full">صورة المنتج</div>
                              </div>
                              <div className="p-2">
                                <h5 className="text-sm font-medium">اسم المنتج</h5>
                                <div className="mt-1 flex justify-between items-center">
                                  <span className="text-xs font-bold">149 ر.س</span>
                                  <button
                                    className="p-1 rounded-full text-white"
                                    style={{ backgroundColor: formik.values.theme.primaryColor }}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* زر عرض المزيد */}
                          <div className="mt-4 text-center">
                            <button
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white transition-colors"
                              style={{ backgroundColor: formik.values.theme.secondaryColor }}
                            >
                              عرض المزيد
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          )}
          
          {/* Domain Settings */}
          {activeTab === 'domain' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="domain" className="form-label">
                  نطاق المتجر
                </label>
                <input
                  type="text"
                  id="domain"
                  name="domain"
                  className={`form-input ${formik.touched.domain && formik.errors.domain ? 'border-red-500' : ''}`}
                  placeholder="أدخل نطاق متجرك (مثال: store1)"
                  value={formik.values.domain}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.domain && formik.errors.domain && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.domain}</p>
                )}
                {formik.values.domain && (
                  <p className="mt-2 text-xs text-gray-500">
                    رابط متجرك: <a href={`https://${formik.values.domain}.mydomain.com`} target="_blank" rel="noopener noreferrer">{`${formik.values.domain}.mydomain.com`}</a>
                  </p>
                )}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <InformationCircleIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="mr-3">
                    <h3 className="text-sm font-medium text-blue-800">نطاق مخصص</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        لاستخدام نطاق مخصص مثل (www.your-store.com)، يرجى التواصل مع فريق الدعم.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Submit button */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <div className="flex justify-start">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary inline-flex items-center"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="animate-spin ml-2 h-4 w-4" />
                    جاري الحفظ...
                  </>
                ) : (
                  'حفظ التغييرات'
                )}
              </button>
              
              {error && (
                <div className="mr-4 flex items-center text-red-600">
                  <ExclamationCircleIcon className="h-5 w-5 ml-1" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
      
      {/* Success toast */}
      {showSuccessToast && (
        <div className="fixed bottom-4 left-4 bg-green-50 p-4 rounded-md shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="mr-3">
              <p className="text-sm font-medium text-green-800">تم حفظ التغييرات بنجاح!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Since we need this icon only in one place, define it here
const InformationCircleIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
      />
    </svg>
  );
};

export default StoreSettings; 