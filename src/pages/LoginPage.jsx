import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { signIn } from '../supabase/auth';
import { supabase } from '../supabase/supabaseClient';

function LoginPage() {
  const { language, direction, t, isTransitioning, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme, themeClasses } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    try {
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        setError(error.message);
      } else {
        // Login successful - fetch user's language preference and sync
        if (data?.user?.id) {
          try {
            const { data: clientData, error: clientError } = await supabase
              .from('clients')
              .select('user_language')
              .eq('user_id', data.user.id)
              .single();

            if (!clientError && clientData?.user_language) {
              // Map language codes to web language
              const languageMap = {
                'en': 'english',
                'he': 'hebrew',
                'english': 'english',
                'hebrew': 'hebrew'
              };
              
              const webLanguage = languageMap[clientData.user_language.toLowerCase()] || 'english';
              
              // Only change if different from current language
              if (language !== webLanguage) {
                toggleLanguage();
              }
            }
          } catch (langError) {
            console.error('Error fetching language preference:', langError);
            // Continue to navigate even if language fetch fails
          }
        }

        // Navigate to home page
        navigate('/');
      }
    } catch (err) {
      setError(language === 'hebrew' ? 'אירעה שגיאה בהתחברות' : 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.bgPrimary} language-transition language-text-transition`} dir={direction}>
      {/* Header */}
      <header className={`${themeClasses.bgHeader} shadow-lg`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 sm:py-6">
            <div className="flex items-center">
              <img src="/favicon.ico" alt="BetterChoice Logo" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 mr-2 sm:mr-4 rounded-lg shadow-md" />
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">BetterChoice</h1>
                <p className="text-emerald-200 text-xs sm:text-sm font-medium hidden sm:block">{t.tagline}</p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-4">
              <button 
                onClick={toggleTheme}
                className={`${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-white text-gray-600'} px-3 sm:px-4 py-2 rounded-full font-semibold hover:opacity-80 transition-all duration-300 text-xs sm:text-sm`}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <Link 
                to="/" 
                className="bg-white text-emerald-600 px-3 sm:px-4 md:px-6 py-2 rounded-full font-semibold hover:bg-emerald-50 transition-colors duration-300 text-xs sm:text-sm"
              >
                {language === 'hebrew' ? 'חזרה לבית' : 'Back to Home'}
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-6 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 sm:space-y-8">
          <div className="text-center">
            <h2 className={`text-2xl sm:text-3xl font-bold ${themeClasses.textPrimary} mb-2`}>
              {language === 'hebrew' ? 'התחבר לחשבון שלך' : 'Sign in to your account'}
            </h2>
            <p className={`${themeClasses.textSecondary} text-sm sm:text-base`}>
              {language === 'hebrew' ? 'ברוכים הבאים חזרה!' : 'Welcome back!'}
            </p>
          </div>

          <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className={`${themeClasses.bgCard} rounded-2xl ${themeClasses.shadowCard} p-4 sm:p-6 md:p-8`}>
              <div className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className={`${themeClasses.errorBg} px-4 py-3 rounded-lg`}>
                    {error}
                  </div>
                )}
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium ${themeClasses.textPrimary} mb-2`}>
                    {t.contact.form.email}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={`w-full px-4 py-3 ${themeClasses.inputBg} rounded-lg ${themeClasses.inputFocus} transition-colors duration-300`}
                    placeholder={language === 'hebrew' ? 'הכנס את כתובת האימייל שלך' : 'Enter your email address'}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="password" className={`block text-sm font-medium ${themeClasses.textPrimary} mb-2`}>
                    {language === 'hebrew' ? 'סיסמה' : 'Password'}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={`w-full px-4 py-3 ${themeClasses.inputBg} rounded-lg ${themeClasses.inputFocus} transition-colors duration-300`}
                    placeholder={language === 'hebrew' ? 'הכנס את הסיסמה שלך' : 'Enter your password'}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="text-right">
                  <div className="text-sm">
                    <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-300">
                      {language === 'hebrew' ? 'שכחת סיסמה?' : 'Forgot password?'}
                    </a>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full ${themeClasses.btnPrimary} text-white py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 transform hover:-translate-y-1 ${themeClasses.shadowCard} ${themeClasses.shadowHover} disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {loading ? (
                      language === 'hebrew' ? 'מתחבר...' : 'Signing in...'
                    ) : (
                      t.buttons.login
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <span className={themeClasses.textSecondary}>
                    {language === 'hebrew' ? 'אין לך חשבון?' : "Don't have an account?"}
                  </span>
                  <Link 
                    to="/signup" 
                    className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-300 mr-2"
                  >
                    {t.buttons.signup}
                  </Link>
                </div>
              </div>
            </div>
          </form>

          {/* Social Login */}
          <div className="mt-4 sm:mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  {language === 'hebrew' ? 'או התחבר באמצעות' : 'Or continue with'}
                </span>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-2 sm:px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-300"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="mr-1 sm:mr-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-2 sm:px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-300"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="mr-1 sm:mr-2">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mb-2 md:mb-0 text-center">
              <a 
                href="#privacy" 
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
              >
                {t.footer.privacy}
              </a>
              <a 
                href="#terms" 
                className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
              >
                {t.footer.terms}
              </a>
            </div>
            <div className="text-gray-400 text-center">
              <p className="text-xs sm:text-sm">{t.footer.copyright}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LoginPage;
