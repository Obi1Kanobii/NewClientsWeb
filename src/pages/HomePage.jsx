import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { signOut } from '../supabase/auth';
import { supabase } from '../supabase/supabaseClient';

function HomePage() {
  const { language, direction, toggleLanguage, t, isTransitioning } = useLanguage();
  const { user, isAuthenticated, userDisplayName, loading } = useAuth();
  const { isDarkMode, toggleTheme, themeClasses } = useTheme();
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);

  // Check if profile is incomplete
  useEffect(() => {
    if (user && isAuthenticated) {
      checkProfileCompletion();
    }
  }, [user, isAuthenticated]);

  const checkProfileCompletion = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('birth_date, age, gender, region, city, timezone, dietary_preferences, food_allergies, medical_conditions')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking profile completion:', error);
        return;
      }

      // Check if any required fields are missing
      const isIncomplete = !data || 
        !data.birth_date || 
        !data.age || 
        !data.gender || 
        !data.region || 
        !data.city || 
        !data.timezone ||
        !data.dietary_preferences ||
        !data.food_allergies ||
        !data.medical_conditions;

      setIsProfileIncomplete(isIncomplete);
    } catch (error) {
      console.error('Error checking profile completion:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.bgPrimary} language-transition language-text-transition`} dir={direction}>
      {/* Header */}
      <header className={`${isDarkMode ? themeClasses.bgHeader : 'bg-gradient-to-r from-emerald-500 to-teal-600'} shadow-xl border-b ${themeClasses.borderPrimary} backdrop-blur-sm`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo Section */}
            <div className="flex items-center">
              <div className="relative">
                <img src="/favicon.ico" alt="BetterChoice Logo" className="w-12 h-12 mr-4 rounded-xl shadow-lg shadow-emerald-500/25" />
              </div>
              <div className="flex flex-col">
                <h1 className={`text-2xl font-bold ${isDarkMode ? themeClasses.textPrimary : 'text-white'} leading-tight`}>BetterChoice</h1>
                <p className="text-emerald-300 text-xs font-medium">{t.tagline}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className={`hidden lg:flex items-center ${language === 'hebrew' ? 'space-x-reverse space-x-1' : 'space-x-1'} ${isDarkMode ? themeClasses.bgSecondary : 'bg-white/95'} rounded-2xl p-2.5 backdrop-blur-sm border ${isDarkMode ? themeClasses.borderPrimary : 'border-white/30'} shadow-lg`}>
              <Link 
                to="/" 
                className={`px-3 py-1 rounded-lg ${isDarkMode ? themeClasses.textPrimary : 'text-gray-800'} hover:text-emerald-500 hover:${isDarkMode ? themeClasses.bgPrimary : 'bg-emerald-50'} transition-all duration-300 font-medium text-sm`}
              >
                {language === 'hebrew' ? 'בית' : 'Home'}
              </Link>
              <a 
                href="#know-your-numbers" 
                className={`px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-300 text-sm whitespace-nowrap`}
              >
                {language === 'hebrew' ? 'דע את המספרים שלך' : 'Know Your Numbers'}
              </a>
              <a 
                href="#knowledge-inspiration" 
                className={`px-3 py-1 rounded-lg ${isDarkMode ? themeClasses.textPrimary : 'text-gray-800'} hover:text-emerald-500 hover:${isDarkMode ? themeClasses.bgPrimary : 'bg-emerald-50'} transition-all duration-300 font-medium text-sm whitespace-nowrap`}
              >
                {language === 'hebrew' ? 'ידע והשראה' : 'Knowledge & Inspiration'}
              </a>
              <Link 
                to="/recipes" 
                className={`px-3 py-1 rounded-lg ${isDarkMode ? themeClasses.textPrimary : 'text-gray-800'} hover:text-emerald-500 hover:${isDarkMode ? themeClasses.bgPrimary : 'bg-emerald-50'} transition-all duration-300 font-medium text-sm`}
              >
                {language === 'hebrew' ? 'מתכונים' : 'Recipes'}
              </Link>
              <Link 
                to="/about" 
                className={`px-3 py-1 rounded-lg ${isDarkMode ? themeClasses.textPrimary : 'text-gray-800'} hover:text-emerald-500 hover:${isDarkMode ? themeClasses.bgPrimary : 'bg-emerald-50'} transition-all duration-300 font-medium text-sm`}
              >
                {language === 'hebrew' ? 'אודות' : t.nav.about}
              </Link>
            </div>

            {/* Right Side Controls */}
            <div className={`flex items-center ${language === 'hebrew' ? 'space-x-reverse space-x-2' : 'space-x-2'} ml-6`}>
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className={`w-10 h-10 ${isDarkMode ? themeClasses.bgSecondary : 'bg-white/95'} hover:${isDarkMode ? themeClasses.bgPrimary : 'bg-white'} rounded-xl flex items-center justify-center transition-all duration-300 border ${isDarkMode ? themeClasses.borderPrimary : 'border-white/30'} backdrop-blur-sm`}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                  </svg>
                )}
              </button>

              {/* Language Toggle */}
              <button 
                onClick={toggleLanguage}
                className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl flex items-center justify-center transition-all duration-300 text-white font-semibold text-sm"
              >
                {language === 'hebrew' ? 'EN' : 'עב'}
              </button>
              
              {/* Separator */}
              <div className={`w-px h-8 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
              
              {loading ? (
                <div className={`${themeClasses.bgSecondary} ${themeClasses.textSecondary} px-4 py-2 rounded-xl font-medium text-sm border ${themeClasses.borderPrimary} backdrop-blur-sm`}>
                  {language === 'hebrew' ? 'טוען...' : 'Loading...'}
                </div>
              ) : isAuthenticated ? (
                <>
                  {/* Profile Button */}
                  <Link 
                    to="/profile"
                    className={`w-10 h-10 ${isDarkMode ? themeClasses.bgSecondary : 'bg-white/95'} hover:${isDarkMode ? themeClasses.bgPrimary : 'bg-white'} rounded-xl flex items-center justify-center transition-all duration-300 border ${isDarkMode ? themeClasses.borderPrimary : 'border-white/30'} backdrop-blur-sm relative`}
                    title={language === 'hebrew' ? 'פרופיל' : 'Profile'}
                  >
                    <svg className={`w-5 h-5 ${isDarkMode ? themeClasses.textPrimary : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                    {isProfileIncomplete && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                    )}
                  </Link>
                  
                  {/* Separator */}
                  <div className={`w-px h-8 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  
                  {/* Welcome Message */}
                  <div className={`${isDarkMode ? themeClasses.bgCard : 'bg-white/95'} ${isDarkMode ? themeClasses.textPrimary : 'text-gray-800'} px-4 py-2 rounded-xl font-medium text-sm border ${isDarkMode ? themeClasses.borderPrimary : 'border-white/30'} flex items-center backdrop-blur-sm whitespace-nowrap`}>
                    <svg className={`w-4 h-4 ${language === 'hebrew' ? 'ml-2' : 'mr-2'} text-emerald-500 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span className="truncate">{language === 'hebrew' ? `שלום ${userDisplayName}` : `Hello ${userDisplayName}`}</span>
                  </div>
                  
                  {/* Separator */}
                  <div className={`w-px h-8 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  
                  {/* Logout Button */}
                  <button 
                    onClick={handleLogout}
                    className={`${isDarkMode ? themeClasses.bgSecondary : 'bg-white/95'} hover:${isDarkMode ? themeClasses.bgPrimary : 'bg-white'} ${isDarkMode ? themeClasses.textPrimary : 'text-gray-800'} px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 border ${isDarkMode ? themeClasses.borderPrimary : 'border-white/30'} backdrop-blur-sm whitespace-nowrap`}
                  >
                    {language === 'hebrew' ? 'התנתק' : 'Logout'}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap">
                    {t.buttons.login}
                  </Link>
                  
                  {/* Separator */}
                  <div className={`w-px h-8 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                  
                  <Link to="/signup" className={`${isDarkMode ? themeClasses.bgCard : 'bg-white/95'} ${isDarkMode ? themeClasses.textPrimary : 'text-gray-800'} px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 border ${isDarkMode ? themeClasses.borderPrimary : 'border-white/30'} hover:${isDarkMode ? themeClasses.bgSecondary : 'bg-white'} backdrop-blur-sm whitespace-nowrap`}>
                    {t.buttons.signup}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button className={`w-10 h-10 ${isDarkMode ? themeClasses.bgSecondary : 'bg-white/95'} hover:${isDarkMode ? themeClasses.bgPrimary : 'bg-white'} rounded-xl flex items-center justify-center transition-all duration-300 border ${isDarkMode ? themeClasses.borderPrimary : 'border-white/30'} backdrop-blur-sm`}>
                <svg className={`w-5 h-5 ${isDarkMode ? themeClasses.textPrimary : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className={`text-5xl md:text-6xl font-bold ${themeClasses.textPrimary} mb-6`}>
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{t.hero.welcome}</span>
              <br />
              <span className="bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">{t.hero.subtitle}</span>
              <br />
              <span className="bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">{t.hero.description}</span>
              <br />
              <span className="bg-gradient-to-r from-purple-500 to-orange-600 bg-clip-text text-transparent">{t.hero.mainDescription}</span>
            </h2>
            <p className={`text-xl md:text-2xl ${themeClasses.textSecondary} mb-10 leading-relaxed`}>
              {t.hero.fullDescription}
            </p>
            <div className="space-y-4 mb-10">
              {t.hero.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <p className={`text-lg ${themeClasses.textSecondary} text-left`}>{feature}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button className={`${themeClasses.btnPrimary} text-white px-8 py-4 rounded-full text-lg font-semibold transform hover:-translate-y-1 transition-all duration-300 ${themeClasses.shadowCard} ${themeClasses.shadowHover} flex items-center justify-center`}>
                <span className="mr-2">✨</span>
                {t.hero.buttons.joinToday}
                <span className="ml-2">←</span>
              </button>
              <button className={`border-2 border-emerald-600 ${isDarkMode ? 'text-emerald-400 hover:bg-emerald-600 hover:text-white' : 'text-emerald-600 hover:bg-emerald-600 hover:text-white'} px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center justify-center`}>
                <span className="mr-2">🏋️</span>
                {t.hero.buttons.joinGym}
              </button>
            </div>
            <div className="flex justify-center space-x-8 space-x-reverse">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">❤️</span>
                <span className={themeClasses.textSecondary}>{t.hero.footer.satisfiedClients}</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-2">✨</span>
                <span className={themeClasses.textSecondary}>{t.hero.footer.beginJourney}</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✅</span>
                <span className={themeClasses.textSecondary}>{t.hero.footer.verifiedSuccess}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pain Section */}
        <section className={`py-20 ${themeClasses.sectionBg}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>
                <span className="text-blue-500">We see</span> <span className="text-white">your pain</span>
              </h3>
              <p className={`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`}>
                {t.painSection.subtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">{t.painSection.challenges.unbalancedNutrition.percentage}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-xl font-bold ${themeClasses.textPrimary}`}>{t.painSection.challenges.unbalancedNutrition.title}</h4>
                  </div>
                  <div className="text-orange-500 text-2xl">🍽️</div>
                </div>
                <p className={themeClasses.textSecondary}>{t.painSection.challenges.unbalancedNutrition.description}</p>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">{t.painSection.challenges.lackOfMotivation.percentage}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-xl font-bold ${themeClasses.textPrimary}`}>{t.painSection.challenges.lackOfMotivation.title}</h4>
                  </div>
                  <div className="text-red-500 text-2xl">🎯</div>
                </div>
                <p className={themeClasses.textSecondary}>{t.painSection.challenges.lackOfMotivation.description}</p>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">{t.painSection.challenges.noTimeForWorkouts.percentage}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-xl font-bold ${themeClasses.textPrimary}`}>{t.painSection.challenges.noTimeForWorkouts.title}</h4>
                  </div>
                  <div className="text-yellow-500 text-2xl">⏰</div>
                </div>
                <p className={themeClasses.textSecondary}>{t.painSection.challenges.noTimeForWorkouts.description}</p>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-xl">{t.painSection.challenges.noResults.percentage}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-xl font-bold ${themeClasses.textPrimary}`}>{t.painSection.challenges.noResults.title}</h4>
                  </div>
                  <div className="text-blue-500 text-2xl">❌</div>
                </div>
                <p className={themeClasses.textSecondary}>{t.painSection.challenges.noResults.description}</p>
              </div>
            </div>
            
            <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-8 mb-16`}>
              <div className="text-center">
                <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-4 flex items-center justify-center`}>
                  <span className="text-yellow-500 mr-2">⏰</span>
                  {t.painSection.frustration.title}
                </h4>
                <p className={`text-lg ${themeClasses.textSecondary} mb-4`}>
                  {t.painSection.frustration.description}
                </p>
                <p className={`text-xl font-bold text-blue-500 mb-6`}>
                  {t.painSection.frustration.callToAction}
                </p>
                <div className="flex justify-center items-center space-x-8 space-x-reverse">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                    <span className={themeClasses.textSecondary}>{t.painSection.frustration.legend.frustration}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                    <span className={themeClasses.textSecondary}>{t.painSection.frustration.legend.hope}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-teal-500 rounded-full mr-2"></div>
                    <span className={themeClasses.textSecondary}>{t.painSection.frustration.legend.results}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className={`text-4xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'} mb-2`}>
                  {t.painSection.statistics.dietFailure.percentage}
                </div>
                <p className={themeClasses.textSecondary}>{t.painSection.statistics.dietFailure.description}</p>
                <p className={`text-sm ${themeClasses.textMuted} mt-2`}>{t.painSection.statistics.dietFailure.source}</p>
                <a href="#" className="text-emerald-500 hover:text-emerald-400 text-sm flex items-center justify-center mt-2">
                  {t.painSection.statistics.dietFailure.link} ↗️
                </a>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'} mb-2`}>
                  {t.painSection.statistics.motivationLoss.percentage}
                </div>
                <p className={themeClasses.textSecondary}>{t.painSection.statistics.motivationLoss.description}</p>
                <p className={`text-sm ${themeClasses.textMuted} mt-2`}>{t.painSection.statistics.motivationLoss.source}</p>
                <a href="#" className="text-emerald-500 hover:text-emerald-400 text-sm flex items-center justify-center mt-2">
                  {t.painSection.statistics.motivationLoss.link} ↗️
                </a>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} mb-2`}>
                  {t.painSection.statistics.noWorkoutTime.percentage}
                </div>
                <p className={themeClasses.textSecondary}>{t.painSection.statistics.noWorkoutTime.description}</p>
                <p className={`text-sm ${themeClasses.textMuted} mt-2`}>{t.painSection.statistics.noWorkoutTime.source}</p>
                <a href="#" className="text-emerald-500 hover:text-emerald-400 text-sm flex items-center justify-center mt-2">
                  {t.painSection.statistics.noWorkoutTime.link} ↗️
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={`py-20 ${themeClasses.bgSecondary}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>
                {t.features.title}
              </h3>
              <p className={`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`}>
                {t.features.subtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className={`${themeClasses.bgCard} rounded-2xl ${themeClasses.shadowCard} p-8 ${themeClasses.shadowHover} transition-shadow duration-300 hover:-translate-y-2`}>
                <div className="text-center">
                  <div className="text-6xl mb-6">🍎</div>
                  <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.features.nutrition.title}</h4>
                  <p className={`${themeClasses.textSecondary} leading-relaxed`}>
                    {t.features.nutrition.description}
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className={`${themeClasses.bgCard} rounded-2xl ${themeClasses.shadowCard} p-8 ${themeClasses.shadowHover} transition-shadow duration-300 hover:-translate-y-2`}>
                <div className="text-center">
                  <div className="text-6xl mb-6">💪</div>
                  <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.features.fitness.title}</h4>
                  <p className={`${themeClasses.textSecondary} leading-relaxed`}>
                    {t.features.fitness.description}
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className={`${themeClasses.bgCard} rounded-2xl ${themeClasses.shadowCard} p-8 ${themeClasses.shadowHover} transition-shadow duration-300 hover:-translate-y-2`}>
                <div className="text-center">
                  <div className="text-6xl mb-6">📊</div>
                  <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.features.tracking.title}</h4>
                  <p className={`${themeClasses.textSecondary} leading-relaxed`}>
                    {t.features.tracking.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Athletes & Professionals Section */}
        <section className={`py-20 ${themeClasses.sectionBg}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>
                {t.athletesSection.title}
              </h3>
              <p className={`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`}>
                {t.athletesSection.subtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-4">🔗</div>
                  <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.athletesSection.features.advancedNutrition.title}</h4>
                  <p className={`${themeClasses.textSecondary} mb-4`}>{t.athletesSection.features.advancedNutrition.description}</p>
                  <div className={`text-2xl font-bold text-green-500`}>{t.athletesSection.features.advancedNutrition.metric}</div>
                </div>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-4">📈</div>
                  <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.athletesSection.features.performanceTracking.title}</h4>
                  <p className={`${themeClasses.textSecondary} mb-4`}>{t.athletesSection.features.performanceTracking.description}</p>
                  <div className={`text-2xl font-bold text-green-500`}>{t.athletesSection.features.performanceTracking.metric}</div>
                </div>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-4">👥</div>
                  <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.athletesSection.features.professionalSupport.title}</h4>
                  <p className={`${themeClasses.textSecondary} mb-4`}>{t.athletesSection.features.professionalSupport.description}</p>
                  <div className={`text-2xl font-bold text-green-500`}>{t.athletesSection.features.professionalSupport.metric}</div>
                </div>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-4">🏆</div>
                  <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.athletesSection.features.competitionPrograms.title}</h4>
                  <p className={`${themeClasses.textSecondary} mb-4`}>{t.athletesSection.features.competitionPrograms.description}</p>
                  <div className={`text-2xl font-bold text-green-500`}>{t.athletesSection.features.competitionPrograms.metric}</div>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-16">
              <h4 className={`text-3xl font-bold ${themeClasses.textPrimary} mb-8`}>{t.athletesSection.whyChooseUs.title}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                  <div className="text-4xl mb-4">🧠</div>
                  <h5 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.athletesSection.whyChooseUs.reasons.scientificKnowledge.title}</h5>
                  <p className={themeClasses.textSecondary}>{t.athletesSection.whyChooseUs.reasons.scientificKnowledge.description}</p>
                </div>
                <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                  <div className="text-4xl mb-4">⚙️</div>
                  <h5 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.athletesSection.whyChooseUs.reasons.fullPersonalization.title}</h5>
                  <p className={themeClasses.textSecondary}>{t.athletesSection.whyChooseUs.reasons.fullPersonalization.description}</p>
                </div>
                <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                  <div className="text-4xl mb-4">💭</div>
                  <h5 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.athletesSection.whyChooseUs.reasons.mentalSupport.title}</h5>
                  <p className={themeClasses.textSecondary}>{t.athletesSection.whyChooseUs.reasons.mentalSupport.description}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">{t.athletesSection.testimonials.david.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h5 className={`font-bold ${themeClasses.textPrimary}`}>{t.athletesSection.testimonials.david.name}</h5>
                    <p className={`${themeClasses.textSecondary} text-sm`}>{t.athletesSection.testimonials.david.profession}</p>
                  </div>
                </div>
                <p className={`${themeClasses.textSecondary} italic mb-4`}>
                  "{t.athletesSection.testimonials.david.quote}"
                </p>
                <div className={`text-lg font-bold text-green-500`}>{t.athletesSection.testimonials.david.metric}</div>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">{t.athletesSection.testimonials.sarah.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h5 className={`font-bold ${themeClasses.textPrimary}`}>{t.athletesSection.testimonials.sarah.name}</h5>
                    <p className={`${themeClasses.textSecondary} text-sm`}>{t.athletesSection.testimonials.sarah.profession}</p>
                  </div>
                </div>
                <p className={`${themeClasses.textSecondary} italic mb-4`}>
                  "{t.athletesSection.testimonials.sarah.quote}"
                </p>
                <div className={`text-lg font-bold text-green-500`}>{t.athletesSection.testimonials.sarah.metric}</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-8 text-white text-center">
              <h4 className="text-3xl font-bold mb-4">{t.athletesSection.callToAction.title}</h4>
              <p className="text-xl mb-6">{t.athletesSection.callToAction.subtitle}</p>
              <button className="bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 mb-4">
                {t.athletesSection.callToAction.button}
              </button>
              <p className="text-sm opacity-80">{t.athletesSection.callToAction.details}</p>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className={`py-20 ${themeClasses.sectionBg}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.services.title}</h3>
              <p className={`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`}>
                {t.services.subtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 ${themeClasses.shadowHover} transition-shadow duration-300`}>
                <div className="text-4xl mb-4">🥗</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.services.nutrition.title}</h4>
                <p className={themeClasses.textSecondary}>{t.services.nutrition.description}</p>
              </div>
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 ${themeClasses.shadowHover} transition-shadow duration-300`}>
                <div className="text-4xl mb-4">🏃‍♂️</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.services.training.title}</h4>
                <p className={themeClasses.textSecondary}>{t.services.training.description}</p>
              </div>
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 ${themeClasses.shadowHover} transition-shadow duration-300`}>
                <div className="text-4xl mb-4">🧘‍♀️</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.services.mental.title}</h4>
                <p className={themeClasses.textSecondary}>{t.services.mental.description}</p>
              </div>
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 ${themeClasses.shadowHover} transition-shadow duration-300`}>
                <div className="text-4xl mb-4">📱</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.services.app.title}</h4>
                <p className={themeClasses.textSecondary}>{t.services.app.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Science and Expertise Section */}
        <section className={`py-20 ${themeClasses.bgSecondary}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>
                <span className="text-blue-400">{t.scienceSection.title}</span>
                <br />
                <span className="text-green-500">{t.scienceSection.subtitle}</span>
              </h3>
              <p className={`text-xl ${themeClasses.textSecondary} max-w-3xl mx-auto`}>
                {t.scienceSection.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 text-center`}>
                <div className="text-4xl mb-4">📚</div>
                <div className={`text-4xl font-bold ${themeClasses.textPrimary} mb-2`}>{t.scienceSection.metrics.scienceBased.percentage}</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-2`}>{t.scienceSection.metrics.scienceBased.title}</h4>
                <p className={`${themeClasses.textSecondary} text-sm mb-1`}>{t.scienceSection.metrics.scienceBased.description}</p>
                <p className={`${themeClasses.textMuted} text-xs`}>{t.scienceSection.metrics.scienceBased.subDescription}</p>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 text-center`}>
                <div className="text-4xl mb-4">👥</div>
                <div className={`text-4xl font-bold ${themeClasses.textPrimary} mb-2`}>{t.scienceSection.metrics.certifiedExperts.count}</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-2`}>{t.scienceSection.metrics.certifiedExperts.title}</h4>
                <p className={`${themeClasses.textSecondary} text-sm mb-1`}>{t.scienceSection.metrics.certifiedExperts.description}</p>
                <p className={`${themeClasses.textMuted} text-xs`}>{t.scienceSection.metrics.certifiedExperts.subDescription}</p>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 text-center`}>
                <div className="text-4xl mb-4">🛡️</div>
                <div className={`text-4xl font-bold ${themeClasses.textPrimary} mb-2`}>{t.scienceSection.metrics.provenResults.percentage}</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-2`}>{t.scienceSection.metrics.provenResults.title}</h4>
                <p className={`${themeClasses.textSecondary} text-sm mb-1`}>{t.scienceSection.metrics.provenResults.description}</p>
                <p className={`${themeClasses.textMuted} text-xs`}>{t.scienceSection.metrics.provenResults.subDescription}</p>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 text-center`}>
                <div className="text-4xl mb-4">📈</div>
                <div className={`text-4xl font-bold ${themeClasses.textPrimary} mb-2`}>{t.scienceSection.metrics.advancedTechnology.availability}</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-2`}>{t.scienceSection.metrics.advancedTechnology.title}</h4>
                <p className={`${themeClasses.textSecondary} text-sm mb-1`}>{t.scienceSection.metrics.advancedTechnology.description}</p>
                <p className={`${themeClasses.textMuted} text-xs`}>{t.scienceSection.metrics.advancedTechnology.subDescription}</p>
              </div>
            </div>
            
            <div className="text-center mb-16">
              <h4 className={`text-3xl font-bold text-green-500 mb-4`}>{t.scienceSection.team.title}</h4>
              <p className={`text-xl ${themeClasses.textSecondary} mb-8`}>{t.scienceSection.team.subtitle}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-xl">G</span>
                    </div>
                    <div>
                      <h5 className={`text-xl font-bold ${themeClasses.textPrimary}`}>{t.scienceSection.team.members.gal.name}</h5>
                      <p className={`text-green-500 font-semibold`}>{t.scienceSection.team.members.gal.title}</p>
                    </div>
                  </div>
                  <p className={`${themeClasses.textSecondary} mb-4`}>{t.scienceSection.team.members.gal.description}</p>
                  <div>
                    <h6 className={`font-bold ${themeClasses.textPrimary}`}>{t.scienceSection.team.members.gal.experience}</h6>
                    <p className={`${themeClasses.textSecondary} text-sm`}>{t.scienceSection.team.members.gal.experienceDetail}</p>
                  </div>
                </div>
                
                <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold text-xl">Y</span>
                    </div>
                    <div>
                      <h5 className={`text-xl font-bold ${themeClasses.textPrimary}`}>{t.scienceSection.team.members.yarden.name}</h5>
                      <p className={`text-green-500 font-semibold`}>{t.scienceSection.team.members.yarden.title}</p>
                    </div>
                  </div>
                  <p className={`${themeClasses.textSecondary} mb-4`}>{t.scienceSection.team.members.yarden.description}</p>
                  <div>
                    <h6 className={`font-bold ${themeClasses.textPrimary}`}>{t.scienceSection.team.members.yarden.experience}</h6>
                    <p className={`${themeClasses.textSecondary} text-sm`}>{t.scienceSection.team.members.yarden.experienceDetail}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-6`}>{t.scienceSection.research.title}</h4>
                <p className={`${themeClasses.textSecondary} mb-6`}>{t.scienceSection.research.subtitle}</p>
                <div className="space-y-4">
                  <div className={`${themeClasses.bgCard} rounded-lg p-4 ${themeClasses.shadowCard}`}>
                    <div className="flex items-center mb-2">
                      <div className="text-blue-500 text-xl mr-3">📚</div>
                      <h5 className={`font-bold ${themeClasses.textPrimary}`}>{t.scienceSection.research.articles.aiOptimization.title}</h5>
                    </div>
                    <p className={`${themeClasses.textSecondary} text-sm mb-2`}>{t.scienceSection.research.articles.aiOptimization.description}</p>
                    <a href="#" className="text-emerald-500 hover:text-emerald-400 text-sm flex items-center">
                      {t.scienceSection.research.articles.aiOptimization.link} ↗️
                    </a>
                  </div>
                  
                  <div className={`${themeClasses.bgCard} rounded-lg p-4 ${themeClasses.shadowCard}`}>
                    <div className="flex items-center mb-2">
                      <div className="text-green-500 text-xl mr-3">📈</div>
                      <h5 className={`font-bold ${themeClasses.textPrimary}`}>{t.scienceSection.research.articles.personalizedNutrition.title}</h5>
                    </div>
                    <p className={`${themeClasses.textSecondary} text-sm mb-2`}>{t.scienceSection.research.articles.personalizedNutrition.description}</p>
                    <a href="#" className="text-emerald-500 hover:text-emerald-400 text-sm flex items-center">
                      {t.scienceSection.research.articles.personalizedNutrition.link} ↗️
                    </a>
                  </div>
                  
                  <div className={`${themeClasses.bgCard} rounded-lg p-4 ${themeClasses.shadowCard}`}>
                    <div className="flex items-center mb-2">
                      <div className="text-orange-500 text-xl mr-3">🛡️</div>
                      <h5 className={`font-bold ${themeClasses.textPrimary}`}>{t.scienceSection.research.articles.digitalTechnology.title}</h5>
                    </div>
                    <p className={`${themeClasses.textSecondary} text-sm mb-2`}>{t.scienceSection.research.articles.digitalTechnology.description}</p>
                    <a href="#" className="text-emerald-500 hover:text-emerald-400 text-sm flex items-center">
                      {t.scienceSection.research.articles.digitalTechnology.link} ↗️
                    </a>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-6`}>{t.scienceSection.research.keyPoints.title}</h4>
                <div className="space-y-3">
                  {t.scienceSection.research.keyPoints.points.map((point, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className={`${themeClasses.textSecondary}`}>{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className={`py-20 ${themeClasses.bgSecondary}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-6`}>{t.about.title}</h3>
                <p className={`text-lg ${themeClasses.textSecondary} mb-6 leading-relaxed`}>
                  {t.about.description1}
                </p>
                <p className={`text-lg ${themeClasses.textSecondary} mb-8 leading-relaxed`}>
                  {t.about.description2}
                </p>
                <div className="flex flex-wrap gap-4">
                  {t.about.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className={themeClasses.textPrimary}>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-indigo-100 to-purple-100'} rounded-2xl p-8`}>
                <div className="text-center">
                  <div className="text-6xl mb-6">🏆</div>
                  <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.about.achievements.title}</h4>
                  <div className="space-y-4">
                    <div className={`${themeClasses.bgCard} rounded-lg p-4 ${themeClasses.shadowCard}`}>
                      <div className={`text-3xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-indigo-600'}`}>15,000+</div>
                      <div className={themeClasses.textSecondary}>{t.about.achievements.clients}</div>
                    </div>
                    <div className={`${themeClasses.bgCard} rounded-lg p-4 ${themeClasses.shadowCard}`}>
                      <div className={`text-3xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-indigo-600'}`}>98%</div>
                      <div className={themeClasses.textSecondary}>{t.about.achievements.success}</div>
                    </div>
                    <div className={`${themeClasses.bgCard} rounded-lg p-4 ${themeClasses.shadowCard}`}>
                      <div className={`text-3xl font-bold ${isDarkMode ? 'text-emerald-400' : 'text-indigo-600'}`}>5+</div>
                      <div className={themeClasses.textSecondary}>{t.about.achievements.experience}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={`py-20 ${themeClasses.sectionBg}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.testimonials.title}</h3>
              <p className={`text-xl ${themeClasses.textSecondary}`}>{t.testimonials.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-100'} rounded-full flex items-center justify-center mr-4`}>
                    <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} font-bold text-lg`}>{t.testimonials.sarah.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h5 className={`font-bold ${themeClasses.textPrimary}`}>{t.testimonials.sarah.name}</h5>
                    <p className={`${themeClasses.textSecondary} text-sm`}>{t.testimonials.sarah.location}</p>
                  </div>
                </div>
                <p className={`${themeClasses.textSecondary} italic`}>
                  "{t.testimonials.sarah.text}"
                </p>
                <div className="flex text-yellow-400 mt-4">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-100'} rounded-full flex items-center justify-center mr-4`}>
                    <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} font-bold text-lg`}>{t.testimonials.michael.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h5 className={`font-bold ${themeClasses.textPrimary}`}>{t.testimonials.michael.name}</h5>
                    <p className={`${themeClasses.textSecondary} text-sm`}>{t.testimonials.michael.location}</p>
                  </div>
                </div>
                <p className={`${themeClasses.textSecondary} italic`}>
                  "{t.testimonials.michael.text}"
                </p>
                <div className="flex text-yellow-400 mt-4">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-100'} rounded-full flex items-center justify-center mr-4`}>
                    <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} font-bold text-lg`}>{t.testimonials.rachel.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h5 className={`font-bold ${themeClasses.textPrimary}`}>{t.testimonials.rachel.name}</h5>
                    <p className={`${themeClasses.textSecondary} text-sm`}>{t.testimonials.rachel.location}</p>
                  </div>
                </div>
                <p className={`${themeClasses.textSecondary} italic`}>
                  "{t.testimonials.rachel.text}"
                </p>
                <div className="flex text-yellow-400 mt-4">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className={`py-20 ${themeClasses.bgSecondary}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.pricing.title}</h3>
              <p className={`text-xl ${themeClasses.textSecondary}`}>{t.pricing.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`${themeClasses.bgCard} border-2 ${themeClasses.borderPrimary} rounded-xl p-8 hover:border-emerald-500 transition-colors duration-300`}>
                <div className="text-center">
                  <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.pricing.basic.title}</h4>
                  <div className={`text-4xl font-bold ${themeClasses.textPrimary} mb-6`}>{t.pricing.basic.price}<span className={`text-lg ${themeClasses.textSecondary}`}>{t.pricing.basic.period}</span></div>
                  <ul className="space-y-3 mb-8">
                    {t.pricing.basic.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-3">✓</span>
                        <span className={themeClasses.textSecondary}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full ${themeClasses.btnSecondary} py-3 rounded-lg font-semibold transition-colors duration-300`}>
                    {t.buttons.selectPlan}
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-8 text-white relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">{t.pricing.professional.popular}</span>
                </div>
                <div className="text-center">
                  <h4 className="text-2xl font-bold mb-4">{t.pricing.professional.title}</h4>
                  <div className="text-4xl font-bold mb-6">{t.pricing.professional.price}<span className="text-lg opacity-80">{t.pricing.professional.period}</span></div>
                  <ul className="space-y-3 mb-8">
                    {t.pricing.professional.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-300 mr-3">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-white text-emerald-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                    {t.buttons.selectPlan}
                  </button>
                </div>
              </div>
              
              <div className={`${themeClasses.bgCard} border-2 ${themeClasses.borderPrimary} rounded-xl p-8 hover:border-emerald-500 transition-colors duration-300`}>
                <div className="text-center">
                  <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.pricing.premium.title}</h4>
                  <div className={`text-4xl font-bold ${themeClasses.textPrimary} mb-6`}>{t.pricing.premium.price}<span className={`text-lg ${themeClasses.textSecondary}`}>{t.pricing.premium.period}</span></div>
                  <ul className="space-y-3 mb-8">
                    {t.pricing.premium.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-green-500 mr-3">✓</span>
                        <span className={themeClasses.textSecondary}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full ${themeClasses.btnSecondary} py-3 rounded-lg font-semibold transition-colors duration-300`}>
                    {t.buttons.selectPlan}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        <section className={`py-20 ${themeClasses.sectionBg}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.blog.title}</h3>
              <p className={`text-xl ${themeClasses.textSecondary}`}>{t.blog.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {t.blog.posts.map((post, index) => (
                <article key={index} className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} overflow-hidden ${themeClasses.shadowHover} transition-shadow duration-300`}>
                  <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500"></div>
                  <div className="p-6">
                    <div className={`text-sm ${themeClasses.textMuted} mb-2`}>{post.date}</div>
                    <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{post.title}</h4>
                    <p className={`${themeClasses.textSecondary} mb-4`}>{post.description}</p>
                    <a href={post.link} className="text-emerald-600 font-semibold hover:text-emerald-800 transition-colors duration-300">
                      {t.buttons.readMore}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="text-white">
                <div className="text-5xl font-bold mb-2">15K+</div>
                <div className="text-xl opacity-90">{t.stats.users}</div>
              </div>
              <div className="text-white">
                <div className="text-5xl font-bold mb-2">98%</div>
                <div className="text-xl opacity-90">{t.stats.success}</div>
              </div>
              <div className="text-white">
                <div className="text-5xl font-bold mb-2">24/7</div>
                <div className="text-xl opacity-90">{t.stats.support}</div>
              </div>
              <div className="text-white">
                <div className="text-5xl font-bold mb-2">50+</div>
                <div className="text-xl opacity-90">{t.stats.experts}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Library Section */}
        <section className={`py-20 ${themeClasses.bgPrimary}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.learning.title}</h3>
              <p className={`text-xl ${themeClasses.textSecondary}`}>{t.learning.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 ${themeClasses.shadowHover} transition-shadow duration-300`}>
                <div className="text-4xl mb-4">📚</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.learning.nutrition.title}</h4>
                <p className={`${themeClasses.textSecondary} mb-4`}>{t.learning.nutrition.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${themeClasses.textMuted}`}>{t.learning.nutrition.lessons}</span>
                  <button className={`${themeClasses.btnPrimary} text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300`}>
                    {t.buttons.startLesson}
                  </button>
                </div>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 ${themeClasses.shadowHover} transition-shadow duration-300`}>
                <div className="text-4xl mb-4">🏃‍♀️</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.learning.fitness.title}</h4>
                <p className={`${themeClasses.textSecondary} mb-4`}>{t.learning.fitness.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${themeClasses.textMuted}`}>{t.learning.fitness.lessons}</span>
                  <button className={`${themeClasses.btnPrimary} text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300`}>
                    {t.buttons.startLesson}
                  </button>
                </div>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 ${themeClasses.shadowHover} transition-shadow duration-300`}>
                <div className="text-4xl mb-4">🧠</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.learning.mental.title}</h4>
                <p className={`${themeClasses.textSecondary} mb-4`}>{t.learning.mental.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${themeClasses.textMuted}`}>{t.learning.mental.lessons}</span>
                  <button className={`${themeClasses.btnPrimary} text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300`}>
                    {t.buttons.startLesson}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Discussion Center Section */}
        <section className={`py-20 ${themeClasses.bgSecondary}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.discussion.title}</h3>
              <p className={`text-xl ${themeClasses.textSecondary}`}>{t.discussion.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={`${themeClasses.bgCard} rounded-xl p-6`}>
                <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.discussion.forums.title}</h4>
                <div className="space-y-4">
                  <div className={`${themeClasses.bgSecondary} rounded-lg p-4 ${themeClasses.shadowCard}`}>
                    <h5 className={`font-semibold ${themeClasses.textPrimary}`}>{t.discussion.forums.nutrition.title}</h5>
                    <p className={`${themeClasses.textSecondary} text-sm`}>{t.discussion.forums.nutrition.stats}</p>
                  </div>
                  <div className={`${themeClasses.bgSecondary} rounded-lg p-4 ${themeClasses.shadowCard}`}>
                    <h5 className={`font-semibold ${themeClasses.textPrimary}`}>{t.discussion.forums.fitness.title}</h5>
                    <p className={`${themeClasses.textSecondary} text-sm`}>{t.discussion.forums.fitness.stats}</p>
                  </div>
                  <div className={`${themeClasses.bgSecondary} rounded-lg p-4 ${themeClasses.shadowCard}`}>
                    <h5 className={`font-semibold ${themeClasses.textPrimary}`}>{t.discussion.forums.mental.title}</h5>
                    <p className={`${themeClasses.textSecondary} text-sm`}>{t.discussion.forums.mental.stats}</p>
                  </div>
                </div>
              </div>
              
              <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'} rounded-xl p-6`}>
                <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.discussion.recent.title}</h4>
                <div className="space-y-4">
                  <div className={`${themeClasses.bgCard} rounded-lg p-4 ${themeClasses.shadowCard}`}>
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-100'} rounded-full flex items-center justify-center mr-3`}>
                        <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} font-bold text-sm`}>{t.discussion.recent.sarah.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className={`font-semibold ${themeClasses.textPrimary} text-sm`}>{t.discussion.recent.sarah.name}</div>
                        <div className={`${themeClasses.textMuted} text-xs`}>{t.discussion.recent.sarah.time}</div>
                      </div>
                    </div>
                    <p className={`${themeClasses.textSecondary} text-sm`}>"{t.discussion.recent.sarah.message}"</p>
                  </div>
                  <div className={`${themeClasses.bgCard} rounded-lg p-4 ${themeClasses.shadowCard}`}>
                    <div className="flex items-center mb-2">
                      <div className={`w-8 h-8 ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-100'} rounded-full flex items-center justify-center mr-3`}>
                        <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} font-bold text-sm`}>{t.discussion.recent.michael.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className={`font-semibold ${themeClasses.textPrimary} text-sm`}>{t.discussion.recent.michael.name}</div>
                        <div className={`${themeClasses.textMuted} text-xs`}>{t.discussion.recent.michael.time}</div>
                      </div>
                    </div>
                    <p className={`${themeClasses.textSecondary} text-sm`}>"{t.discussion.recent.michael.message}"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Action Plan Board Section */}
        <section className={`py-20 ${themeClasses.sectionBg}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.actionPlan.title}</h3>
              <p className={`text-xl ${themeClasses.textSecondary}`}>{t.actionPlan.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 ${isDarkMode ? 'bg-red-900' : 'bg-red-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-red-600 text-2xl">🎯</span>
                  </div>
                  <h4 className={`text-xl font-bold ${themeClasses.textPrimary}`}>{t.actionPlan.weekly.title}</h4>
                </div>
                <div className="space-y-3">
                  {t.actionPlan.weekly.goals.map((goal, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 ${themeClasses.bgSecondary} rounded-lg`}>
                      <span className={themeClasses.textSecondary}>{goal}</span>
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-blue-600 text-2xl">📅</span>
                  </div>
                  <h4 className={`text-xl font-bold ${themeClasses.textPrimary}`}>{t.actionPlan.monthly.title}</h4>
                </div>
                <div className="space-y-3">
                  <div className={`p-3 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-lg`}>
                    <div className={`font-semibold ${themeClasses.textPrimary} text-sm`}>{t.actionPlan.monthly.week1.period}</div>
                    <div className={`${themeClasses.textSecondary} text-sm`}>{t.actionPlan.monthly.week1.task}</div>
                  </div>
                  <div className={`p-3 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-50'} rounded-lg`}>
                    <div className={`font-semibold ${themeClasses.textPrimary} text-sm`}>{t.actionPlan.monthly.week3.period}</div>
                    <div className={`${themeClasses.textSecondary} text-sm`}>{t.actionPlan.monthly.week3.task}</div>
                  </div>
                </div>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6`}>
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-green-600 text-2xl">📊</span>
                  </div>
                  <h4 className={`text-xl font-bold ${themeClasses.textPrimary}`}>{t.actionPlan.progress.title}</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={themeClasses.textSecondary}>{t.actionPlan.progress.weight}</span>
                    <span className="font-bold text-green-600">-3 ק"ג</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={themeClasses.textSecondary}>{t.actionPlan.progress.workouts}</span>
                    <span className="font-bold text-blue-600">12/15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={themeClasses.textSecondary}>{t.actionPlan.progress.water}</span>
                    <span className="font-bold text-indigo-600">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Private Messages Section */}
        <section className={`py-20 ${themeClasses.bgSecondary}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.messages.title}</h3>
              <p className={`text-xl ${themeClasses.textSecondary}`}>{t.messages.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'} rounded-xl p-8`}>
                <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-6`}>{t.messages.guides.title}</h4>
                <div className="space-y-4">
                  <div className={`${themeClasses.bgCard} rounded-lg p-4 ${themeClasses.shadowCard} flex items-center`}>
                    <div className={`w-12 h-12 ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-100'} rounded-full flex items-center justify-center mr-4`}>
                      <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} font-bold`}>{t.messages.guides.ronit.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${themeClasses.textPrimary}`}>{t.messages.guides.ronit.name}</div>
                      <div className={`${themeClasses.textSecondary} text-sm`}>{t.messages.guides.ronit.specialty}</div>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className={`${themeClasses.bgCard} rounded-lg p-4 ${themeClasses.shadowCard} flex items-center`}>
                    <div className={`w-12 h-12 ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-100'} rounded-full flex items-center justify-center mr-4`}>
                      <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} font-bold`}>{t.messages.guides.alon.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${themeClasses.textPrimary}`}>{t.messages.guides.alon.name}</div>
                      <div className={`${themeClasses.textSecondary} text-sm`}>{t.messages.guides.alon.specialty}</div>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className={`${themeClasses.bgCard} rounded-lg p-4 ${themeClasses.shadowCard} flex items-center`}>
                    <div className={`w-12 h-12 ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-100'} rounded-full flex items-center justify-center mr-4`}>
                      <span className={`${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} font-bold`}>{t.messages.guides.yael.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold ${themeClasses.textPrimary}`}>{t.messages.guides.yael.name}</div>
                      <div className={`${themeClasses.textSecondary} text-sm`}>{t.messages.guides.yael.specialty}</div>
                    </div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-8`}>
                <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-6`}>{t.messages.recentMessages.title}</h4>
                <div className="space-y-4">
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <div className={`font-semibold ${themeClasses.textPrimary}`}>{t.messages.recentMessages.ronit.name}</div>
                    <div className={`${themeClasses.textMuted} text-sm mb-2`}>{t.messages.recentMessages.ronit.time}</div>
                    <p className={themeClasses.textSecondary}>"{t.messages.recentMessages.ronit.message}"</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className={`font-semibold ${themeClasses.textPrimary}`}>{t.messages.recentMessages.alon.name}</div>
                    <div className={`${themeClasses.textMuted} text-sm mb-2`}>{t.messages.recentMessages.alon.time}</div>
                    <p className={themeClasses.textSecondary}>"{t.messages.recentMessages.alon.message}"</p>
                  </div>
                </div>
                <button className={`w-full mt-6 ${themeClasses.btnPrimary} text-white py-3 rounded-lg font-semibold transition-colors duration-300`}>
                  {t.buttons.sendNewMessage}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Celebrations Section */}
        <section className={`py-20 ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900' : 'bg-gradient-to-r from-yellow-50 to-orange-50'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.celebrations.title}</h3>
              <p className={`text-xl ${themeClasses.textSecondary}`}>{t.celebrations.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 ${themeClasses.shadowHover} transition-shadow duration-300`}>
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'} rounded-full flex items-center justify-center mr-4`}>
                    <span className="text-yellow-600 text-2xl">🎉</span>
                  </div>
                  <div>
                    <div className={`font-bold ${themeClasses.textPrimary}`}>{t.celebrations.sarah.name}</div>
                    <div className={`${themeClasses.textMuted} text-sm`}>{t.celebrations.sarah.time}</div>
                  </div>
                </div>
                <p className={`${themeClasses.textSecondary} mb-4`}>"{t.celebrations.sarah.message}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2 space-x-reverse">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                  </div>
                  <span className={`${themeClasses.textMuted} text-sm`}>{t.celebrations.sarah.comments}</span>
                </div>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 ${themeClasses.shadowHover} transition-shadow duration-300`}>
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${isDarkMode ? 'bg-green-900' : 'bg-green-100'} rounded-full flex items-center justify-center mr-4`}>
                    <span className="text-green-600 text-2xl">🏃‍♂️</span>
                  </div>
                  <div>
                    <div className={`font-bold ${themeClasses.textPrimary}`}>{t.celebrations.michael.name}</div>
                    <div className={`${themeClasses.textMuted} text-sm`}>{t.celebrations.michael.time}</div>
                  </div>
                </div>
                <p className={`${themeClasses.textSecondary} mb-4`}>"{t.celebrations.michael.message}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2 space-x-reverse">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                  </div>
                  <span className={`${themeClasses.textMuted} text-sm`}>{t.celebrations.michael.comments}</span>
                </div>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 ${themeClasses.shadowHover} transition-shadow duration-300`}>
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} rounded-full flex items-center justify-center mr-4`}>
                    <span className="text-blue-600 text-2xl">💪</span>
                  </div>
                  <div>
                    <div className={`font-bold ${themeClasses.textPrimary}`}>{t.celebrations.rachel.name}</div>
                    <div className={`${themeClasses.textMuted} text-sm`}>{t.celebrations.rachel.time}</div>
                  </div>
                </div>
                <p className={`${themeClasses.textSecondary} mb-4`}>"{t.celebrations.rachel.message}"</p>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2 space-x-reverse">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-yellow-500">⭐</span>
                  </div>
                  <span className={`${themeClasses.textMuted} text-sm`}>{t.celebrations.rachel.comments}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <button className={`${isDarkMode ? 'bg-gradient-to-r from-yellow-600 to-orange-600' : 'bg-gradient-to-r from-yellow-400 to-orange-500'} text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-yellow-500 hover:to-orange-600 transition-all duration-300 shadow-lg`}>
                {t.buttons.shareAchievement}
              </button>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className={`py-20 ${themeClasses.sectionBg}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.resources.title}</h3>
              <p className={`text-xl ${themeClasses.textSecondary}`}>{t.resources.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 ${themeClasses.shadowHover} transition-shadow duration-300`}>
                <div className="text-4xl mb-4">📋</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.resources.worksheets.title}</h4>
                <p className={`${themeClasses.textSecondary} mb-4`}>{t.resources.worksheets.description}</p>
                <button className={`w-full ${themeClasses.btnPrimary} text-white py-2 rounded-lg font-semibold transition-colors duration-300`}>
                  {t.buttons.download}
                </button>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 ${themeClasses.shadowHover} transition-shadow duration-300`}>
                <div className="text-4xl mb-4">🔗</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.resources.links.title}</h4>
                <p className={`${themeClasses.textSecondary} mb-4`}>{t.resources.links.description}</p>
                <button className={`w-full ${themeClasses.btnPrimary} text-white py-2 rounded-lg font-semibold transition-colors duration-300`}>
                  {t.buttons.viewLinks}
                </button>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 ${themeClasses.shadowHover} transition-shadow duration-300`}>
                <div className="text-4xl mb-4">📱</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.resources.apps.title}</h4>
                <p className={`${themeClasses.textSecondary} mb-4`}>{t.resources.apps.description}</p>
                <button className={`w-full ${themeClasses.btnPrimary} text-white py-2 rounded-lg font-semibold transition-colors duration-300`}>
                  {t.buttons.discoverApps}
                </button>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 ${themeClasses.shadowHover} transition-shadow duration-300`}>
                <div className="text-4xl mb-4">📖</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.resources.books.title}</h4>
                <p className={`${themeClasses.textSecondary} mb-4`}>{t.resources.books.description}</p>
                <button className={`w-full ${themeClasses.btnPrimary} text-white py-2 rounded-lg font-semibold transition-colors duration-300`}>
                  {t.buttons.browseBooks}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Platform Section */}
        <section className={`py-20 ${themeClasses.sectionBg}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>
                {t.professionalPlatform.title}
              </h3>
              <h4 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-8`}>
                <span className="text-blue-400">{t.professionalPlatform.subtitle}</span>
              </h4>
            </div>
            
            <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-8 mb-16`}>
              <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-8 text-center`}>{t.professionalPlatform.challenges.title}</h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h5 className={`text-xl font-bold text-blue-400 mb-4`}>{t.professionalPlatform.challenges.oldReality.title}</h5>
                  <div className="space-y-3">
                    {t.professionalPlatform.challenges.oldReality.points.map((point, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className={`${themeClasses.textSecondary}`}>{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className={`text-xl font-bold text-green-500 mb-4`}>{t.professionalPlatform.challenges.newReality.title}</h5>
                  <div className="space-y-3">
                    {t.professionalPlatform.challenges.newReality.points.map((point, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p className={`${themeClasses.textSecondary}`}>{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 text-center`}>
                <div className="text-4xl mb-4">⏰</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.professionalPlatform.benefits.savesTime.title}</h4>
                <p className={themeClasses.textSecondary}>{t.professionalPlatform.benefits.savesTime.description}</p>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 text-center`}>
                <div className="text-4xl mb-4">📈</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.professionalPlatform.benefits.improvesResults.title}</h4>
                <p className={themeClasses.textSecondary}>{t.professionalPlatform.benefits.improvesResults.description}</p>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 text-center`}>
                <div className="text-4xl mb-4">👥</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.professionalPlatform.benefits.expandsAudience.title}</h4>
                <p className={themeClasses.textSecondary}>{t.professionalPlatform.benefits.expandsAudience.description}</p>
              </div>
              
              <div className={`${themeClasses.bgCard} rounded-xl ${themeClasses.shadowCard} p-6 text-center`}>
                <div className="text-4xl mb-4">🎯</div>
                <h4 className={`text-xl font-bold ${themeClasses.textPrimary} mb-3`}>{t.professionalPlatform.benefits.focusesOnGoals.title}</h4>
                <p className={themeClasses.textSecondary}>{t.professionalPlatform.benefits.focusesOnGoals.description}</p>
              </div>
            </div>
            
            <div className={`bg-gradient-to-r from-blue-500 to-green-500 rounded-xl p-8 mb-16`}>
              <h4 className={`text-3xl font-bold text-white mb-8 text-center`}>{t.professionalPlatform.platform.title}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h5 className={`text-xl font-bold text-blue-200 mb-3`}>{t.professionalPlatform.platform.features.contentCreation.title}</h5>
                  <p className="text-white">{t.professionalPlatform.platform.features.contentCreation.description}</p>
                </div>
                <div className="text-center">
                  <h5 className={`text-xl font-bold text-green-200 mb-3`}>{t.professionalPlatform.platform.features.wideDistribution.title}</h5>
                  <p className="text-white">{t.professionalPlatform.platform.features.wideDistribution.description}</p>
                </div>
                <div className="text-center">
                  <h5 className={`text-xl font-bold text-purple-200 mb-3`}>{t.professionalPlatform.platform.features.performanceTracking.title}</h5>
                  <p className="text-white">{t.professionalPlatform.platform.features.performanceTracking.description}</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h4 className={`text-3xl font-bold ${themeClasses.textPrimary} mb-4`}>
                {t.professionalPlatform.callToAction.question}
              </h4>
              <h5 className={`text-3xl font-bold text-blue-400 mb-8`}>
                {t.professionalPlatform.callToAction.highlightedQuestion}
              </h5>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className={`${themeClasses.btnPrimary} text-white px-8 py-4 rounded-full text-lg font-semibold transform hover:-translate-y-1 transition-all duration-300 ${themeClasses.shadowCard} ${themeClasses.shadowHover} flex items-center justify-center`}>
                  <span className="mr-2">←</span>
                  {t.professionalPlatform.callToAction.buttons.requestDemo}
                </button>
                <button className={`border-2 border-blue-500 ${isDarkMode ? 'text-blue-400 hover:bg-blue-500 hover:text-white' : 'text-blue-500 hover:bg-blue-500 hover:text-white'} px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 flex items-center justify-center`}>
                  <span className="mr-2">🎯</span>
                  {t.professionalPlatform.callToAction.buttons.contactUs}
                </button>
              </div>
            </div>
            
            <div className="text-center">
              <p className={`${themeClasses.textSecondary} text-sm`}>{t.professionalPlatform.footer}</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className={`py-20 ${themeClasses.bgSecondary}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className={`text-4xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.contact.title}</h3>
              <p className={`text-xl ${themeClasses.textSecondary}`}>{t.contact.subtitle}</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h4 className={`text-2xl font-bold ${themeClasses.textPrimary} mb-6`}>{t.contact.form.title}</h4>
                <form className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.textPrimary} mb-2`}>{t.contact.form.fullName}</label>
                    <input type="text" className={`w-full px-4 py-3 ${themeClasses.bgCard} ${themeClasses.borderPrimary} border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${themeClasses.textPrimary}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.textPrimary} mb-2`}>{t.contact.form.email}</label>
                    <input type="email" className={`w-full px-4 py-3 ${themeClasses.bgCard} ${themeClasses.borderPrimary} border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${themeClasses.textPrimary}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.textPrimary} mb-2`}>{t.contact.form.phone}</label>
                    <input type="tel" className={`w-full px-4 py-3 ${themeClasses.bgCard} ${themeClasses.borderPrimary} border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${themeClasses.textPrimary}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.textPrimary} mb-2`}>{t.contact.form.message}</label>
                    <textarea rows="4" className={`w-full px-4 py-3 ${themeClasses.bgCard} ${themeClasses.borderPrimary} border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${themeClasses.textPrimary}`}></textarea>
                  </div>
                  <button type="submit" className={`w-full ${themeClasses.btnPrimary} text-white py-3 rounded-lg font-semibold transition-all duration-300`}>
                    {t.buttons.sendMessage}
                  </button>
                </form>
              </div>
              
              <div className="space-y-8">
                <div className={`${themeClasses.bgCard} rounded-xl p-6`}>
                  <h5 className={`text-xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.contact.details.title}</h5>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-100'} rounded-full flex items-center justify-center mr-4`}>
                        📞
                      </div>
                      <div>
                        <div className={`font-semibold ${themeClasses.textPrimary}`}>{t.contact.details.phone}</div>
                        <div className={themeClasses.textSecondary}>03-1234567</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-100'} rounded-full flex items-center justify-center mr-4`}>
                        ✉️
                      </div>
                      <div>
                        <div className={`font-semibold ${themeClasses.textPrimary}`}>{t.contact.details.email}</div>
                        <div className={themeClasses.textSecondary}>info@betterchoice.co.il</div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-indigo-100'} rounded-full flex items-center justify-center mr-4`}>
                        📍
                      </div>
                      <div>
                        <div className={`font-semibold ${themeClasses.textPrimary}`}>{t.contact.details.address}</div>
                        <div className={themeClasses.textSecondary}>{t.contact.details.addressValue}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'} rounded-xl p-6`}>
                  <h5 className={`text-xl font-bold ${themeClasses.textPrimary} mb-4`}>{t.contact.hours.title}</h5>
                  <div className={`space-y-2 ${themeClasses.textSecondary}`}>
                    <div className="flex justify-between">
                      <span>{t.contact.hours.weekdays}</span>
                      <span>{t.contact.hours.weekdaysHours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.contact.hours.friday}</span>
                      <span>{t.contact.hours.fridayHours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t.contact.hours.saturday}</span>
                      <span>{t.contact.hours.saturdayHours}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`${themeClasses.footerBg} text-white py-12`}>
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

export default HomePage;
