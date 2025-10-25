import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

const KnowledgePage = () => {
  const { language, t, direction, toggleLanguage, isTransitioning } = useLanguage();
  const { isDarkMode, toggleTheme, themeClasses } = useTheme();

  const studies = [
    {
      id: 1,
      title: language === 'hebrew' 
        ? "יתרונות בריאותיים של פעילות גופנית: סקירה שיטתית של סקירות שיטתיות נוכחיות (2016)"
        : "Health Benefits of Physical Activity: A Systematic Review of Current Systematic Reviews (2016)",
      pubmedId: "28708630",
      pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/28708630/",
      keyFindings: language === 'hebrew'
        ? "אפילו כמויות קטנות של פעילות גופנית סדירה (<150 דקות/שבוע) קשורות לירידה בתמותה כללית ובסיכון למחלות כרוניות."
        : "Even small amounts of regular exercise (<150 min/week) are linked with lower all-cause mortality and chronic disease risk.",
      whyInteresting: language === 'hebrew'
        ? "זה מפריך את המיתוס של \"הכל או כלום\" — מראה שתנועה \"כלשהי\" כבר מביאה יתרונות בריאותיים מדידים."
        : "It debunks the \"all or nothing\" myth — showing that *some* movement already brings measurable health benefits.",
      icon: "💪"
    },
    {
      id: 2,
      title: language === 'hebrew'
        ? "פעילות גופנית אירובית וירידה במשקל במבוגרים: סקירה שיטתית ומטא-אנליזה (2024)"
        : "Aerobic Exercise and Weight Loss in Adults: A Systematic Review and Meta-Analysis (2024)",
      journal: language === 'hebrew' ? "JAMA Network Open" : "JAMA Network Open",
      journalLink: "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2828487",
      keyFindings: language === 'hebrew'
        ? "על פני 116 מחקרים אקראיים מבוקרים (n = 6,880), כל 30 דקות נוספות של פעילות אירובית שבועית הביאו לירידה של ~0.52 ק\"ג במשקל."
        : "Across 116 RCTs (n = 6,880), every additional 30 minutes of aerobic exercise per week resulted in ~0.52 kg of weight loss.",
      whyInteresting: language === 'hebrew'
        ? "מספק נוסחת \"מינון-תגובה\" ברורה — אפשר לכמת תוצאות לפי דקות של פעילות גופנית."
        : "Provides a clear \"dose-response\" formula — you can quantify results per minutes of exercise.",
      icon: "🏃"
    },
    {
      id: 3,
      title: language === 'hebrew'
        ? "יעילות דיאטה ופעילות גופנית בטיפול בהשמנה במבוגרים: סקירה שיטתית (2023)"
        : "Effectiveness of Diet and Exercise in the Management of Obesity in Adults: A Systematic Review (2023)",
      pubmedId: "37084486",
      pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/37084486/",
      keyFindings: language === 'hebrew'
        ? "שילוב תזונה מותאמת אישית עם ≥175 דקות פעילות גופנית שבועית מביא ליתרונות הירידה במשקל והבריאות הגדולים ביותר."
        : "Combining personalized nutrition with ≥175 minutes of exercise per week yields the greatest weight-loss and health benefits.",
      whyInteresting: language === 'hebrew'
        ? "מראה סינרגיה — דיאטה + פעילות גופנית יחד עולות בביצועים על כל אחד בנפרד."
        : "Shows synergy — diet + exercise together outperform either alone.",
      icon: "🥗"
    },
    {
      id: 4,
      title: language === 'hebrew'
        ? "הקשר בין דפוסי תזונה לאיכות חיים הקשורה לבריאות: סקירה שיטתית (2020)"
        : "Association Between Dietary Patterns and Health-Related Quality of Life: A Systematic Review (2020)",
      journal: language === 'hebrew' 
        ? "Health and Quality of Life Outcomes (BMC)"
        : "Health and Quality of Life Outcomes (BMC)",
      journalLink: "https://hqlo.biomedcentral.com/articles/10.1186/s12955-020-01581-z",
      keyFindings: language === 'hebrew'
        ? "דיאטות \"בריאות\" או \"ים-תיכוניות\" נמצאות בקורלציה חזקה עם ציוני רווחה גופנית ונפשית גבוהים יותר."
        : "\"Healthy\" or \"Mediterranean\" diets correlate strongly with higher physical and mental well-being scores.",
      whyInteresting: language === 'hebrew'
        ? "חורג מעבר למניעת מחלות — מחבר תזונה לשביעות רצון מהחיים ורווחה רגשית."
        : "Goes beyond disease prevention — connects diet to *life satisfaction* and emotional well-being.",
      icon: "🧠"
    },
    {
      id: 5,
      title: language === 'hebrew'
        ? "השפעת התערבויות תזונה ופעילות גופנית המועברות על ידי מטפלים למבוגרים (2023)"
        : "Impact of Nutrition and Physical Activity Interventions Delivered by Practitioners for Adults (2023)",
      pubmedId: "35565696",
      pubmedLink: "https://pubmed.ncbi.nlm.nih.gov/35565696/",
      keyFindings: language === 'hebrew'
        ? "התערבויות אורח חיים על ידי תזונאים או מאמני כושר מעלות משמעותיות צריכת פירות/ירקות ופעילות גופנית, ומקטינות היקף מותניים."
        : "Lifestyle interventions by nutritionists or exercise coaches significantly increase fruit/vegetable intake, physical activity, and reduce waist circumference.",
      whyInteresting: language === 'hebrew'
        ? "מדגים את ההשפעה הניתנת למדידה בעולם האמיתי של הדרכה מקצועית — לא רק \"עזרה עצמית\"."
        : "Demonstrates the measurable real-world effect of professional guidance — not just \"self-help.\"",
      icon: "👨‍⚕️"
    }
  ];

  return (
    <div className={`min-h-screen ${themeClasses.bgPrimary} flex language-transition language-text-transition`} dir={direction}>
      {/* Header Section */}
      <div className="w-full">
        {/* Navigation Bar */}
        <nav className={`${themeClasses.bgCard} ${themeClasses.shadowCard} border-b ${themeClasses.borderPrimary} p-4`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="/favicon.ico" alt="BetterChoice Logo" className="w-10 h-10 mr-3 rounded-lg shadow-md" />
              <span className={`${themeClasses.textPrimary} text-xl font-bold`}>BetterChoice</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              {/* Language Control */}
              <button 
                onClick={toggleLanguage}
                className={`${themeClasses.bgSecondary} hover:${themeClasses.bgPrimary} rounded-xl p-2 transition-all duration-200 shadow-md`}
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-blue-400 text-sm font-medium">{language === 'hebrew' ? 'עב' : 'En'}</span>
                </div>
              </button>

              {/* Theme Control */}
              <button 
                onClick={toggleTheme}
                className={`${themeClasses.bgCard} border border-emerald-500/20 rounded-full p-2 hover:${themeClasses.bgSecondary} transition-all duration-200 shadow-lg shadow-emerald-500/10`}
              >
                {isDarkMode ? (
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative bg-gradient-to-b from-slate-800 via-slate-900 to-black py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Icon */}
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/25 animate-pulse">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-emerald-400 mb-6 animate-fadeIn">
              {t.knowledgePage?.title || (language === 'hebrew' ? 'ידע והשראה' : 'Knowledge & Inspiration')}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              {t.knowledgePage?.subtitle || (language === 'hebrew' 
                ? 'מחקרים מדעיים מובילים בתחום התזונה, הבריאות והפעילות הגופנית'
                : 'Leading Scientific Research in Nutrition, Health, and Physical Activity'
              )}
            </p>
          </div>
        </div>

        {/* Studies Section */}
        <div className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-emerald-400 mb-4">
                {t.knowledgePage?.sectionTitle || (language === 'hebrew' ? 'מחקרים מדעיים מובילים' : 'Evidence-Based Scientific Studies')}
              </h2>
              <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                {t.knowledgePage?.sectionDescription || (language === 'hebrew'
                  ? 'חמישה מחקרים מדעיים מוכחים ומעניינים שמראים את הקשר בין תזונה, פעילות גופנית ובריאות'
                  : 'Five well-known, evidence-based, and genuinely interesting scientific papers on nutrition, health, and exercise'
                )}
              </p>
            </div>

            {/* Studies Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {studies.map((study, index) => (
                <div 
                  key={study.id}
                  className={`${themeClasses.bgCard} rounded-2xl p-6 shadow-xl border border-slate-700 hover:border-emerald-500/30 transition-all duration-300 animate-slideInUp h-full flex flex-col`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Study Icon */}
                  <div className="text-4xl mb-4 text-center">
                    {study.icon}
                  </div>

                  {/* Study Title */}
                  <h3 className={`${themeClasses.textPrimary} text-lg font-bold mb-4 line-clamp-3 flex-shrink-0`}>
                    {study.title}
                  </h3>

                  {/* Publication Info */}
                  <div className="mb-4 flex-shrink-0">
                    {study.pubmedId ? (
                      <div className="flex items-center text-sm text-blue-400">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                        </svg>
                        <span>PubMed ID: {study.pubmedId}</span>
                      </div>
                    ) : (
                      <div className="text-sm text-blue-400">
                        <svg className="w-4 h-4 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                        </svg>
                        <span>{study.journal}</span>
                      </div>
                    )}
                  </div>

                  {/* Key Findings */}
                  <div className="mb-4 flex-grow">
                    <h4 className="text-emerald-400 font-semibold text-sm mb-2 uppercase tracking-wide">
                      {t.knowledgePage?.keyFindings || (language === 'hebrew' ? 'ממצאים עיקריים:' : 'Key Findings:')}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {study.keyFindings}
                    </p>
                  </div>

                  {/* Why Interesting */}
                  <div className="mb-6 flex-grow">
                    <h4 className="text-yellow-400 font-semibold text-sm mb-2 uppercase tracking-wide">
                      {t.knowledgePage?.whyInteresting || (language === 'hebrew' ? 'למה זה מעניין:' : 'Why it\'s interesting:')}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {study.whyInteresting}
                    </p>
                  </div>

                  {/* Read More Button */}
                  <div className="flex-shrink-0">
                    <a
                      href={study.pubmedLink || study.journalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                      {t.knowledgePage?.readFullStudy || (language === 'hebrew' ? 'קרא במלואו' : 'Read Full Study')}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Info Section */}
            <div className="mt-16 text-center">
              <div className={`${themeClasses.bgCard} rounded-2xl p-8 border border-slate-700 max-w-4xl mx-auto`}>
                <h3 className="text-2xl font-bold text-emerald-400 mb-4">
                  {t.knowledgePage?.moreStudiesTitle || (language === 'hebrew' ? 'מחקרים נוספים בקרוב' : 'More Studies Coming Soon')}
                </h3>
                <p className="text-slate-300 text-lg">
                  {t.knowledgePage?.moreStudiesDescription || (language === 'hebrew'
                    ? 'אנו מוסיפים בקביעות מחקרים חדשים ומעודכנים מהספרות המדעית המובילה בעולם'
                    : 'We regularly add new and updated research from the world\'s leading scientific literature'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="bg-black py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link
              to="/"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
              {t.knowledgePage?.backToHome || (language === 'hebrew' ? 'חזרה לעמוד הבית' : 'Back to Home')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgePage;
