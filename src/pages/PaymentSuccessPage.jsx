import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useStripe } from '../context/StripeContext';

const PaymentSuccessPage = () => {
  const { language, direction } = useLanguage();
  const { themeClasses } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { getCheckoutSession } = useStripe();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setError(language === 'hebrew' ? 'מזהה הפעלה חסר' : 'Missing session ID');
      setLoading(false);
      return;
    }

    fetchSessionData();
  }, [sessionId, language]);

  const fetchSessionData = async () => {
    try {
      setLoading(true);
      const data = await getCheckoutSession(sessionId);
      setSessionData(data);
      
      // If user isn't authenticated, redirect to login after showing success
      if (!isAuthenticated) {
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: language === 'hebrew' 
                ? 'התשלום בוצע בהצלחה! אנא התחבר כדי לגשת לתוכן שלך.'
                : 'Payment successful! Please log in to access your content.'
            } 
          });
        }, 5000);
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
      setError(error.message || (language === 'hebrew' ? 'שגיאה בטעינת נתוני התשלום' : 'Error loading payment data'));
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount, currency = 'USD') => {
    if (!amount) return '';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {language === 'hebrew' ? 'מאמת תשלום...' : 'Verifying payment...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background}`}>
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-red-100 dark:bg-red-900/20 rounded-full p-4 w-16 h-16 mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            {language === 'hebrew' ? 'שגיאה' : 'Error'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <Link
            to="/pricing"
            className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
          >
            {language === 'hebrew' ? 'חזור למחירים' : 'Back to Pricing'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`} dir={direction}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-green-100 dark:bg-green-900/20 rounded-full animate-ping"></div>
              <div className="relative flex items-center justify-center w-24 h-24 bg-green-500 rounded-full">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-green-600 dark:text-green-400 mb-4">
              {language === 'hebrew' ? '🎉 תשלום בוצע בהצלחה!' : '🎉 Payment Successful!'}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              {language === 'hebrew' 
                ? 'תודה לך על הרכישה!' 
                : 'Thank you for your purchase!'
              }
            </p>
            
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'hebrew' 
                ? 'קיבלת אישור בדואל עם פרטי ההזמנה והגישה.'
                : 'You\'ve received an email confirmation with order details and access information.'
              }
            </p>
          </div>

          {/* Payment Details Card */}
          {sessionData && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {language === 'hebrew' ? 'פרטי התשלום' : 'Payment Details'}
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'hebrew' ? 'מזהה הזמנה:' : 'Order ID:'}
                  </span>
                  <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {sessionData.id}
                  </span>
                </div>
                
                {sessionData.amount_total && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      {language === 'hebrew' ? 'סכום:' : 'Amount:'}
                    </span>
                    <span className="font-semibold text-lg">
                      {formatAmount(sessionData.amount_total, sessionData.currency)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'hebrew' ? 'סטטוס:' : 'Status:'}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {language === 'hebrew' ? 'שולם' : 'Paid'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">
                    {language === 'hebrew' ? 'תאריך:' : 'Date:'}
                  </span>
                  <span>
                    {new Date().toLocaleDateString(language === 'hebrew' ? 'he-IL' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* What's Next Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-300">
              {language === 'hebrew' ? '🚀 מה הלאה?' : '🚀 What\'s Next?'}
            </h3>
            <div className="space-y-3 text-blue-700 dark:text-blue-300">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                <div>
                  <p className="font-medium">
                    {language === 'hebrew' ? 'בדוק את הדואל שלך' : 'Check Your Email'}
                  </p>
                  <p className="text-sm opacity-90">
                    {language === 'hebrew' 
                      ? 'קיבלת הוראות גישה ופרטי התחברות'
                      : 'You\'ve received access instructions and login details'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                <div>
                  <p className="font-medium">
                    {language === 'hebrew' ? 'השלם את הפרופיל שלך' : 'Complete Your Profile'}
                  </p>
                  <p className="text-sm opacity-90">
                    {language === 'hebrew' 
                      ? 'נתונים נוספים יעזרו לנו להתאים עבורך תוכן מיטבי'
                      : 'Additional information helps us provide optimal content for you'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                <div>
                  <p className="font-medium">
                    {language === 'hebrew' ? 'התחל את המסע שלך' : 'Start Your Journey'}
                  </p>
                  <p className="text-sm opacity-90">
                    {language === 'hebrew' 
                      ? 'גש לתכנים, כלים ותמיכה מקצועית'
                      : 'Access content, tools, and professional support'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                {language === 'hebrew' ? '👤 עבור לפרופיל שלך' : '👤 Go to Your Profile'}
              </Link>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                {language === 'hebrew' ? '🔐 התחבר לחשבון' : '🔐 Log In to Your Account'}
              </Link>
            )}
            
            <Link
              to="/"
              className="block w-full text-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200"
            >
              {language === 'hebrew' ? '🏠 חזור לדף הבית' : '🏠 Back to Home'}
            </Link>
          </div>

          {/* Support Section */}
          <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
              {language === 'hebrew' ? 'נתקלת בבעיה?' : 'Need Help?'}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              {language === 'hebrew' 
                ? 'הצוות שלנו זמין לעזרה 24/7'
                : 'Our support team is available 24/7'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="mailto:support@betterchoice.co.il" 
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {language === 'hebrew' ? 'שלח מייל' : 'Email Support'}
              </a>
              <a 
                href="tel:+972-50-123-4567" 
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {language === 'hebrew' ? 'התקשר' : 'Call Us'}
              </a>
            </div>
          </div>

          {/* Auto-redirect notice for non-authenticated users */}
          {!isAuthenticated && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-800 dark:text-yellow-300 text-sm text-center">
                {language === 'hebrew' 
                  ? '⏱️ תועבר אוטומטית לדף ההתחברות בעוד כמה שניות...'
                  : '⏱️ You will be redirected to the login page in a few seconds...'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
