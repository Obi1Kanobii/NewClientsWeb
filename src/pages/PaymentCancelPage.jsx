import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const PaymentCancelPage = () => {
  const { language, direction } = useLanguage();
  const { themeClasses } = useTheme();

  const reasons = [
    {
      icon: '🔙',
      text: language === 'hebrew' ? 'לחצת על כפתור "חזור"' : 'You clicked the back button'
    },
    {
      icon: '🌐',
      text: language === 'hebrew' ? 'סגרת את הדפדפן במהלך התשלום' : 'You closed the browser during payment'
    },
    {
      icon: '💳',
      text: language === 'hebrew' ? 'בעיה עם כרטיס האשראי' : 'Credit card issue occurred'
    },
    {
      icon: '⚡',
      text: language === 'hebrew' ? 'תקלה טכנית זמנית' : 'Temporary technical issue'
    }
  ];

  const helpOptions = [
    {
      title: language === 'hebrew' ? 'נסה תשלום אחר' : 'Try Different Payment',
      description: language === 'hebrew' 
        ? 'כרטיס אשראי אחר או PayPal'
        : 'Different credit card or PayPal',
      icon: '💳'
    },
    {
      title: language === 'hebrew' ? 'בדוק את הפרטים' : 'Check Details',
      description: language === 'hebrew' 
        ? 'וודא שכל הפרטים נכונים'
        : 'Make sure all details are correct',
      icon: '✅'
    },
    {
      title: language === 'hebrew' ? 'רענן את הדף' : 'Refresh Page',
      description: language === 'hebrew' 
        ? 'לפעמים זה עוזר לרענן'
        : 'Sometimes a refresh helps',
      icon: '🔄'
    }
  ];

  return (
    <div className={`min-h-screen ${themeClasses.background} ${themeClasses.text}`} dir={direction}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Cancel Icon Animation */}
          <div className="text-center mb-8">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full animate-pulse"></div>
              <div className="relative flex items-center justify-center w-24 h-24 bg-red-500 rounded-full">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">
              {language === 'hebrew' ? '❌ תשלום בוטל' : '❌ Payment Cancelled'}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
              {language === 'hebrew' 
                ? 'אין בעיה, זה קורה 😊' 
                : 'No worries, it happens 😊'
              }
            </p>
            
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {language === 'hebrew' 
                ? 'התשלום שלך בוטל ולא חויבת בכלום. אתה יכול לנסות שוב בכל עת או לבחור תוכנית אחרת.'
                : 'Your payment was cancelled and you haven\'t been charged. You can try again anytime or choose a different plan.'
              }
            </p>
          </div>

          {/* Why This Happened */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {language === 'hebrew' ? 'למה זה קרה?' : 'Why did this happen?'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-center text-yellow-700 dark:text-yellow-400">
                  <span className="text-xl mr-3">{reason.icon}</span>
                  <span className="text-sm">{reason.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Help */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {language === 'hebrew' ? 'טיפים מהירים' : 'Quick Tips'}
            </h3>
            <div className="space-y-4">
              {helpOptions.map((option, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-2xl mr-4 mt-1">{option.icon}</span>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">
                      {option.title}
                    </h4>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      {option.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 mb-8">
            <Link
              to="/pricing"
              className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <span className="text-xl mr-2">🔄</span>
              {language === 'hebrew' ? 'נסה שוב' : 'Try Again'}
            </Link>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/"
                className="text-center bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                <span className="text-lg mr-2">🏠</span>
                {language === 'hebrew' ? 'דף הבית' : 'Home'}
              </Link>
              
              <a
                href="mailto:support@betterchoice.co.il"
                className="text-center bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                <span className="text-lg mr-2">💬</span>
                {language === 'hebrew' ? 'יצירת קשר' : 'Contact Us'}
              </a>
            </div>
          </div>

          {/* Alternative Payment Methods */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {language === 'hebrew' ? 'אפשרויות תשלום' : 'Payment Options'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
              {language === 'hebrew' 
                ? 'אנחנו מקבלים מגוון שיטות תשלום בטוחות:'
                : 'We accept various secure payment methods:'
              }
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { name: 'Visa', icon: '💳' },
                { name: 'MasterCard', icon: '💳' },
                { name: 'American Express', icon: '💳' },
                { name: 'PayPal', icon: '🅿️' }
              ].map((method, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl mb-1">{method.icon}</div>
                  <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {method.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {language === 'hebrew' ? 'שאלות נפוצות' : 'Common Questions'}
            </h3>
            <div className="space-y-4">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {language === 'hebrew' ? 'האם חויבתי כסף?' : 'Was I charged any money?'}
                  <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </summary>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {language === 'hebrew' 
                    ? 'לא, התשלום בוטל לפני השלמתו ולא חויבת בכלום. אין עליך חיובים.'
                    : 'No, the payment was cancelled before completion and you were not charged. There are no charges on your account.'
                  }
                </p>
              </details>
              
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {language === 'hebrew' ? 'כמה זמן לוקח לראות החזר?' : 'How long does a refund take to show?'}
                  <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </summary>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {language === 'hebrew' 
                    ? 'מכיוון שהתשלום בוטל לפני השלמתו, אין צורך בהחזר. אם בכל זאת נחשף חיוב, הוא יוחזר תוך 3-5 ימי עסקים.'
                    : 'Since payment was cancelled before completion, no refund is needed. If you do see a charge, it will be refunded within 3-5 business days.'
                  }
                </p>
              </details>
              
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  {language === 'hebrew' ? 'האם אוכל לקבל עזרה בתשלום?' : 'Can I get help with payment?'}
                  <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </summary>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {language === 'hebrew' 
                    ? 'בהחלט! הצוות שלנו זמין לעזור בתהליך התשלום. צור קשר דרך המייל או הטלפון וננחה אותך.'
                    : 'Absolutely! Our team is available to help with the payment process. Contact us via email or phone and we\'ll guide you through.'
                  }
                </p>
              </details>
            </div>
          </div>

          {/* Support Contact */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {language === 'hebrew' 
                ? 'עדיין נתקל בבעיות? הצוות שלנו כאן לעזור!'
                : 'Still having issues? Our team is here to help!'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@betterchoice.co.il" 
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                support@betterchoice.co.il
              </a>
              <a 
                href="tel:+972-50-123-4567" 
                className="inline-flex items-center justify-center px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                050-123-4567
              </a>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {language === 'hebrew' 
                ? 'זמינים 24/7 לכל שאלה או בעיה'
                : 'Available 24/7 for any questions or issues'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
