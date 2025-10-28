import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { signUp, createClientRecord, generateUniqueUserCode } from '../supabase/auth';

function SignupPage() {
  const { language, direction, t, isTransitioning } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme, themeClasses } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    newsletter: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError(language === 'hebrew' ? 'הסיסמאות אינן תואמות' : 'Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError(language === 'hebrew' ? 'הסיסמה חייבת להכיל לפחות 6 תווים' : 'Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        newsletter: formData.newsletter
      };

      const { data, error } = await signUp(formData.email, formData.password, userData);
      
      if (error) {
        setError(error.message);
      } else {
        // Create client record in clients table
        if (data?.user?.id) {
          try {
            console.log('Attempting to create client record...');
            const clientResult = await createClientRecord(data.user.id, userData);
            if (clientResult.error) {
              console.error('Client record creation failed:', clientResult.error);
              setError(
                language === 'hebrew' 
                  ? 'החשבון נוצר אבל לא ניתן ליצור רשומת לקוח. אנא פנה לתמיכה.' 
                  : 'Account created but failed to create client record. Please contact support.'
              );
              return;
            }
            console.log('Client record created successfully');
          } catch (clientError) {
            console.error('Failed to create client record:', clientError);
            setError(
              language === 'hebrew' 
                ? 'החשבון נוצר אבל לא ניתן ליצור רשומת לקוח. אנא פנה לתמיכה.' 
                : 'Account created but failed to create client record. Please contact support.'
            );
            return;
          }
        }

        setSuccess(
          language === 'hebrew' 
            ? 'החשבון נוצר בהצלחה! בדוק את האימייל שלך לאישור.' 
            : 'Account created successfully! Please check your email for confirmation.'
        );
        // Clear form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          agreeToTerms: false,
          newsletter: true
        });
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(language === 'hebrew' ? 'אירעה שגיאה ביצירת החשבון' : 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.bgPrimary} language-transition language-text-transition`} dir={direction}>
      {/* Header */}
      <header className={`${themeClasses.bgHeader} shadow-lg`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img src="/favicon.ico" alt="BetterChoice Logo" className="w-16 h-16 mr-4 rounded-lg shadow-md" />
              <div className="flex flex-col">
                <h1 className="text-4xl font-bold text-white leading-tight">BetterChoice</h1>
                <p className="text-emerald-200 text-sm font-medium">{t.tagline}</p>
              </div>
            </div>
            <div className="flex space-x-4 space-x-reverse">
              <button 
                onClick={toggleTheme}
                className={`${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-white text-gray-600'} px-4 py-2 rounded-full font-semibold hover:opacity-80 transition-all duration-300 text-sm`}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <Link 
                to="/" 
                className="bg-white text-emerald-600 px-6 py-2 rounded-full font-semibold hover:bg-emerald-50 transition-colors duration-300"
              >
                {language === 'hebrew' ? 'חזרה לבית' : 'Back to Home'}
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className={`text-3xl font-bold ${themeClasses.textPrimary} mb-2`}>
              {language === 'hebrew' ? 'צור חשבון חדש' : 'Create your account'}
            </h2>
            <p className={themeClasses.textSecondary}>
              {language === 'hebrew' ? 'הצטרף לקהילה שלנו והתחל את המסע שלך לבריאות טובה יותר' : 'Join our community and start your journey to better health'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className={`${themeClasses.bgCard} rounded-2xl ${themeClasses.shadowCard} p-8`}>
              <div className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className={`${themeClasses.errorBg} px-4 py-3 rounded-lg`}>
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className={`${themeClasses.successBg} px-4 py-3 rounded-lg`}>
                    {success}
                  </div>
                )}
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'hebrew' ? 'שם פרטי' : 'First Name'}
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-300"
                      placeholder={language === 'hebrew' ? 'שם פרטי' : 'First name'}
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      {language === 'hebrew' ? 'שם משפחה' : 'Last Name'}
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-300"
                      placeholder={language === 'hebrew' ? 'שם משפחה' : 'Last name'}
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.form.email}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-300"
                    placeholder={language === 'hebrew' ? 'הכנס את כתובת האימייל שלך' : 'Enter your email address'}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    {t.contact.form.phone}
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-300"
                    placeholder={language === 'hebrew' ? 'הכנס את מספר הטלפון שלך' : 'Enter your phone number'}
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'hebrew' ? 'סיסמה' : 'Password'}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-300"
                    placeholder={language === 'hebrew' ? 'צור סיסמה חזקה' : 'Create a strong password'}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'hebrew' ? 'אשר סיסמה' : 'Confirm Password'}
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors duration-300"
                    placeholder={language === 'hebrew' ? 'אשר את הסיסמה שלך' : 'Confirm your password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Checkboxes */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="agreeToTerms" className="mr-2 block text-sm text-gray-700">
                      {language === 'hebrew' ? (
                        <>אני מסכים ל<a href="#" className="text-emerald-600 hover:text-emerald-500">תנאי השימוש</a> ו<a href="#" className="text-emerald-600 hover:text-emerald-500">מדיניות הפרטיות</a></>
                      ) : (
                        <>I agree to the <a href="#" className="text-emerald-600 hover:text-emerald-500">Terms of Service</a> and <a href="#" className="text-emerald-600 hover:text-emerald-500">Privacy Policy</a></>
                      )}
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="newsletter"
                      name="newsletter"
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      checked={formData.newsletter}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="newsletter" className="mr-2 block text-sm text-gray-700">
                      {language === 'hebrew' ? 'אני רוצה לקבל עדכונים וטיפים בריאותיים באימייל' : 'I want to receive health updates and tips via email'}
                    </label>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading || !formData.agreeToTerms}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      language === 'hebrew' ? 'יוצר חשבון...' : 'Creating account...'
                    ) : (
                      t.buttons.signup
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-gray-600">
                    {language === 'hebrew' ? 'כבר יש לך חשבון?' : 'Already have an account?'}
                  </span>
                  <Link 
                    to="/login" 
                    className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-300 mr-2"
                  >
                    {t.buttons.login}
                  </Link>
                </div>
              </div>
            </div>
          </form>

          {/* Social Signup */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  {language === 'hebrew' ? 'או הירשם באמצעות' : 'Or sign up with'}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-300"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="mr-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="mr-2">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-8 space-x-reverse mb-4 md:mb-0">
              <a 
                href="#privacy" 
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                {t.footer.privacy}
              </a>
              <a 
                href="#terms" 
                className="text-gray-300 hover:text-white transition-colors duration-300"
              >
                {t.footer.terms}
              </a>
            </div>
            <div className="text-gray-400">
              <p>{t.footer.copyright}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SignupPage;
