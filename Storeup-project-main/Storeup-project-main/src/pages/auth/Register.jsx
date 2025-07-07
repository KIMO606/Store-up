import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowPathIcon, EyeIcon, EyeSlashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { register } from '../../features/auth/authActions';
import { reset } from '../../features/auth/authSlice';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isError) {
      // عرض رسالة الخطأ من الـ backend
      if (typeof message === 'object' && message !== null) {
        Object.values(message).forEach(msg => toast.error(Array.isArray(msg) ? msg[0] : msg));
      } else {
        toast.error(message);
      }
    }

    if (isSuccess || user) {
      navigate('/dashboard');
      toast.success('تم إنشاء الحساب بنجاح!');
    }

    // إعادة تعيين الحالة بعد العرض
    if (isError || isSuccess) {
        // dispatch(reset());
    }
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  // تكوين Formik
  const formik = useFormik({
    initialValues: {
      first_name: '',
      last_name: '',
      username: '',
      email: '',
      password: '',
      password2: '',
      termsAccepted: false,
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('الاسم الأول مطلوب'),
      last_name: Yup.string().required('الاسم الأخير مطلوب'),
      username: Yup.string().required('اسم المستخدم مطلوب'),
      email: Yup.string().email('بريد إلكتروني غير صالح').required('البريد الإلكتروني مطلوب'),
      password: Yup.string().min(8, 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل').required('كلمة المرور مطلوبة'),
      password2: Yup.string().oneOf([Yup.ref('password'), null], 'كلمات المرور غير متطابقة').required('تأكيد كلمة المرور مطلوب'),
      termsAccepted: Yup.boolean().oneOf([true], 'يجب الموافقة على الشروط والأحكام').required('يجب الموافقة على الشروط والأحكام'),
    }),
    onSubmit: (values) => {
      const { termsAccepted, ...userData } = values;
      dispatch(register(userData));
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
       
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          إنشاء حساب جديد
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          أو{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            تسجيل الدخول إذا كان لديك حساب بالفعل
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* الاسم الأول والأخير */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* الاسم الأول */}
              <div>
                <label htmlFor="register-first_name" className="block text-sm font-medium text-gray-700">
                  الاسم الأول
                </label>
                <div className="mt-1 relative">
                  <input
                    id="register-first_name"
                    name="first_name"
                    type="text"
                    autoComplete="given-name"
                    className={`form-input ${
                      formik.touched.first_name && formik.errors.first_name ? 'border-red-500' : ''
                    }`}
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.first_name && formik.errors.first_name && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {formik.touched.first_name && formik.errors.first_name && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.first_name}</p>
                )}
              </div>

              {/* الاسم الأخير */}
              <div>
                <label htmlFor="register-last_name" className="block text-sm font-medium text-gray-700">
                  الاسم الأخير
                </label>
                <div className="mt-1 relative">
                  <input
                    id="register-last_name"
                    name="last_name"
                    type="text"
                    autoComplete="family-name"
                    className={`form-input ${
                      formik.touched.last_name && formik.errors.last_name ? 'border-red-500' : ''
                    }`}
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.last_name && formik.errors.last_name && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {formik.touched.last_name && formik.errors.last_name && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.last_name}</p>
                )}
              </div>
            </div>

            {/* اسم المستخدم */}
            <div>
              <label htmlFor="register-username" className="block text-sm font-medium text-gray-700">
                اسم المستخدم
              </label>
              <div className="mt-1 relative">
                <input
                  id="register-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  className={`form-input ${
                    formik.touched.username && formik.errors.username ? 'border-red-500' : ''
                  }`}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username && (
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                )}
              </div>
              {formik.touched.username && formik.errors.username && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.username}</p>
              )}
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <div className="mt-1 relative">
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`form-input ${
                    formik.touched.email && formik.errors.email ? 'border-red-500' : ''
                  }`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                )}
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
              )}
            </div>

            {/* كلمة المرور */}
            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <div className="mt-1 relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`form-input ${
                    formik.touched.password && formik.errors.password ? 'border-red-500' : ''
                  }`}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </button>
                {formik.touched.password && formik.errors.password && (
                  <div className="absolute inset-y-0 left-10 pl-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                )}
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>

            {/* تأكيد كلمة المرور */}
            <div>
              <label htmlFor="register-password2" className="block text-sm font-medium text-gray-700">
                تأكيد كلمة المرور
              </label>
              <div className="mt-1 relative">
                <input
                  id="register-password2"
                  name="password2"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`form-input ${
                    formik.touched.password2 && formik.errors.password2 ? 'border-red-500' : ''
                  }`}
                  value={formik.values.password2}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  )}
                </button>
                {formik.touched.password2 && formik.errors.password2 && (
                  <div className="absolute inset-y-0 left-10 pl-3 flex items-center pointer-events-none">
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                  </div>
                )}
              </div>
              {formik.touched.password2 && formik.errors.password2 && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.password2}</p>
              )}
            </div>

            {/* الشروط والأحكام */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="register-termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={formik.values.termsAccepted}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              <div className="mr-3 text-sm">
                <label htmlFor="register-termsAccepted" className="font-medium text-gray-700">
                  أوافق على{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                    الشروط والأحكام
                  </Link>{' '}
                  و{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                    سياسة الخصوصية
                  </Link>
                </label>
                {formik.touched.termsAccepted && formik.errors.termsAccepted && (
                  <p className="mt-2 text-sm text-red-600">{formik.errors.termsAccepted}</p>
                )}
              </div>
            </div>

            {/* زر إنشاء الحساب */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
              >
                {isLoading ? (
                  <ArrowPathIcon className="animate-spin h-5 w-5 text-white" />
                ) : (
                  'إنشاء حساب'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">أو التسجيل باستخدام</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">التسجيل باستخدام جوجل</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">التسجيل باستخدام فيسبوك</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 