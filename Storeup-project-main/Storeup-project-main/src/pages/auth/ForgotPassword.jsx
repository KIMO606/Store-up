import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowPathIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // تكوين Formik
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('بريد إلكتروني غير صالح')
        .required('البريد الإلكتروني مطلوب'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        
        // هنا سيتم استدعاء API لإرسال رابط إعادة تعيين كلمة المرور
        // المثال الحالي هو محاكاة فقط
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setSuccess(true);
      } catch (err) {
        setError(err.message || 'حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.svg"
            alt="إيكوشوب"
          />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          استعادة كلمة المرور
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="mr-3">
                  <h3 className="text-sm font-medium text-green-800">
                    تم إرسال رابط إعادة تعيين كلمة المرور
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>
                      لقد قمنا بإرسال بريد إلكتروني إلى {formik.values.email} يحتوي على رابط لإعادة تعيين كلمة المرور.
                      يرجى التحقق من بريدك الإلكتروني.
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/login"
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      العودة إلى صفحة تسجيل الدخول
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              {/* البريد الإلكتروني */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  البريد الإلكتروني
                </label>
                <div className="mt-1 relative">
                  <input
                    id="email"
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

              {/* رسالة الخطأ */}
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationCircleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mr-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* زر إرسال */}
              <div>
                <button
                  type="submit"
                  disabled={loading || !formik.isValid}
                  className="btn-primary w-full flex justify-center items-center"
                >
                  {loading ? (
                    <>
                      <ArrowPathIcon className="animate-spin ml-2 h-4 w-4" />
                      جاري الإرسال...
                    </>
                  ) : (
                    'إرسال رابط إعادة التعيين'
                  )}
                </button>
              </div>

              <div className="text-center mt-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  العودة إلى صفحة تسجيل الدخول
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 