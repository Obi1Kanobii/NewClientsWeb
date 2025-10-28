import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { supabase, supabaseSecondary } from '../supabase/supabaseClient';

const OnboardingModal = ({ isOpen, onClose, user, userCode }) => {
  const { language, t, direction, toggleLanguage } = useLanguage();
  const { isDarkMode, themeClasses } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [checkingData, setCheckingData] = useState(true);
  const [error, setError] = useState('');
  const [filteredSteps, setFilteredSteps] = useState([]);

  const [formData, setFormData] = useState({
    phone: '',
    phoneCountryCode: '+972',
    language: 'en',
    city: '',
    date_of_birth: '',
    gender: '',
    weight_kg: '',
    target_weight: '',
    height_cm: '',
    food_allergies: '',
    food_limitations: '',
    activity_level: '',
    goal: '',
    client_preference: '',
    region: '',
    medical_conditions: ''
  });

  // Popular country codes with phone number validation rules
  const countryCodes = [
    { code: '+1', country: '🇺🇸 US/CA', minLength: 10, maxLength: 10 },
    { code: '+44', country: '🇬🇧 UK', minLength: 10, maxLength: 10 },
    { code: '+49', country: '🇩🇪 Germany', minLength: 10, maxLength: 12 },
    { code: '+33', country: '🇫🇷 France', minLength: 9, maxLength: 9 },
    { code: '+39', country: '🇮🇹 Italy', minLength: 9, maxLength: 10 },
    { code: '+34', country: '🇪🇸 Spain', minLength: 9, maxLength: 9 },
    { code: '+31', country: '🇳🇱 Netherlands', minLength: 9, maxLength: 9 },
    { code: '+32', country: '🇧🇪 Belgium', minLength: 9, maxLength: 9 },
    { code: '+41', country: '🇨🇭 Switzerland', minLength: 9, maxLength: 9 },
    { code: '+43', country: '🇦🇹 Austria', minLength: 10, maxLength: 13 },
    { code: '+46', country: '🇸🇪 Sweden', minLength: 9, maxLength: 9 },
    { code: '+47', country: '🇳🇴 Norway', minLength: 8, maxLength: 8 },
    { code: '+45', country: '🇩🇰 Denmark', minLength: 8, maxLength: 8 },
    { code: '+358', country: '🇫🇮 Finland', minLength: 5, maxLength: 10 },
    { code: '+353', country: '🇮🇪 Ireland', minLength: 9, maxLength: 9 },
    { code: '+351', country: '🇵🇹 Portugal', minLength: 9, maxLength: 9 },
    { code: '+30', country: '🇬🇷 Greece', minLength: 10, maxLength: 10 },
    { code: '+972', country: '🇮🇱 Israel', minLength: 9, maxLength: 9 },
    { code: '+971', country: '🇦🇪 UAE', minLength: 9, maxLength: 9 },
    { code: '+7', country: '🇷🇺 Russia', minLength: 10, maxLength: 10 },
    { code: '+86', country: '🇨🇳 China', minLength: 11, maxLength: 11 },
    { code: '+81', country: '🇯🇵 Japan', minLength: 10, maxLength: 10 },
    { code: '+82', country: '🇰🇷 South Korea', minLength: 9, maxLength: 11 },
    { code: '+91', country: '🇮🇳 India', minLength: 10, maxLength: 10 },
    { code: '+61', country: '🇦🇺 Australia', minLength: 9, maxLength: 9 },
    { code: '+64', country: '🇳🇿 New Zealand', minLength: 8, maxLength: 10 },
    { code: '+27', country: '🇿🇦 South Africa', minLength: 9, maxLength: 9 },
    { code: '+55', country: '🇧🇷 Brazil', minLength: 10, maxLength: 11 },
    { code: '+52', country: '🇲🇽 Mexico', minLength: 10, maxLength: 10 },
    { code: '+54', country: '🇦🇷 Argentina', minLength: 10, maxLength: 10 },
    { code: '+60', country: '🇲🇾 Malaysia', minLength: 9, maxLength: 11 },
    { code: '+65', country: '🇸🇬 Singapore', minLength: 8, maxLength: 8 },
    { code: '+66', country: '🇹🇭 Thailand', minLength: 9, maxLength: 9 },
    { code: '+90', country: '🇹🇷 Turkey', minLength: 10, maxLength: 10 }
  ];

  // Function to validate phone number based on country code
  const validatePhoneNumber = (phone, countryCode) => {
    let phoneDigits = phone.replace(/[-\s]/g, ''); // Remove dashes and spaces
    
    // Find the country code rules
    const countryRule = countryCodes.find(c => c.code === countryCode);
    
    if (!countryRule) {
      return { valid: true, error: '' }; // No rule means we don't validate strictly
    }
    
    // Special handling for Israeli numbers: if user enters number starting with 0 (like 0544455656)
    // We need to count it as 10 digits total, but after removing the leading 0 it becomes 9
    // So for validation purposes, we check the digits after potentially removing the leading 0
    if (countryCode === '+972' && phoneDigits.startsWith('0')) {
      phoneDigits = phoneDigits.substring(1); // Remove leading 0 for Israel
    }
    
    // Check length
    if (phoneDigits.length < countryRule.minLength) {
      const expected = countryCode === '+972' && phone.replace(/[-\s]/g, '').startsWith('0') 
        ? `10 (05X-XXX-XXXX)` 
        : `${countryRule.minLength} digits`;
      return { 
        valid: false, 
        error: `Phone number must be ${expected} for ${countryRule.country.replace(/🇺🇸|🇬🇧|🇩🇪|🇫🇷|🇮🇹|🇪🇸|🇳🇱|🇧🇪|🇨🇭|🇦🇹|🇸🇪|🇳🇴|🇩🇰|🇫🇮|🇮🇪|🇵🇹|🇬🇷|🇮🇱|🇦🇪|🇷🇺|🇨🇳|🇯🇵|🇰🇷|🇮🇳|🇦🇺|🇳🇿|🇿🇦|🇧🇷|🇲🇽|🇦🇷|🇲🇾|🇸🇬|🇹🇭|🇹🇷/g, '')}` 
      };
    }
    if (phoneDigits.length > countryRule.maxLength) {
      return { 
        valid: false, 
        error: `Phone number must be no more than ${countryRule.maxLength} digits` 
      };
    }
    
    return { valid: true, error: '' };
  };

  // All possible fields organized by step
  const allSteps = [
    {
      title: language === 'hebrew' ? 'מידע אישי בסיסי' : 'Basic Personal Information',
      fields: ['phone', 'language', 'city', 'region']
    },
    {
      title: language === 'hebrew' ? 'פרטי בריאות' : 'Health Information',
      fields: ['date_of_birth', 'gender', 'weight_kg', 'target_weight', 'height_cm', 'medical_conditions']
    },
    {
      title: language === 'hebrew' ? 'תזונה ומטרות' : 'Nutrition & Goals',
      fields: ['food_allergies', 'food_limitations', 'activity_level', 'goal', 'client_preference']
    }
  ];

  const steps = filteredSteps;

  // Load existing data and determine which fields to show
  useEffect(() => {
    if (isOpen && user) {
      loadExistingData();
    }
  }, [isOpen, user]);

  const loadExistingData = async () => {
    setCheckingData(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('phone, user_language, city, region, birth_date, age, gender, current_weight, target_weight, height, food_allergies, dietary_preferences, activity_level, goal, client_preference, medical_conditions')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading existing data:', error);
        setCheckingData(false);
        return;
      }

      // Pre-fill form with existing data
      if (data) {
        setFormData(prev => ({
          ...prev,
          phone: data.phone || '',
          language: data.user_language || 'en',
          city: data.city || '',
          region: data.region || '',
          date_of_birth: data.birth_date || '',
          gender: data.gender || '',
          weight_kg: data.current_weight ? data.current_weight.toString() : '',
          target_weight: data.target_weight ? data.target_weight.toString() : '',
          height_cm: data.height ? data.height.toString() : '',
          food_allergies: data.food_allergies || '',
          food_limitations: data.dietary_preferences || '',
          activity_level: data.activity_level || '',
          goal: data.goal || '',
          client_preference: typeof data.client_preference === 'string' ? data.client_preference : (data.client_preference?.preference || ''),
          medical_conditions: data.medical_conditions || ''
        }));
      }

      // Determine which fields are missing
      const missingFields = [];
      
      // Helper function to check if a field is empty
      const isEmpty = (value) => {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string' && value.trim() === '') return true;
        if (typeof value === 'number' && value === 0) return false; // 0 is valid
        return !value;
      };

      // Check each field individually
      console.log('Checking existing data from DB:', data);
      
      // Check each field with detailed logging
      if (isEmpty(data?.phone)) {
        missingFields.push('phone');
      } else {
        console.log('✓ Phone has value:', data?.phone);
      }
      
      if (isEmpty(data?.user_language)) {
        missingFields.push('language');
      } else {
        console.log('✓ Language has value:', data?.user_language);
      }
      
      if (isEmpty(data?.city)) {
        missingFields.push('city');
      } else {
        console.log('✓ City has value:', data?.city);
      }
      
      if (isEmpty(data?.region)) {
        missingFields.push('region');
      } else {
        console.log('✓ Region has value:', data?.region);
      }
      
      if (isEmpty(data?.birth_date)) {
        missingFields.push('date_of_birth');
      } else {
        console.log('✓ Birth date has value:', data?.birth_date);
      }
      
      if (isEmpty(data?.gender)) {
        missingFields.push('gender');
      } else {
        console.log('✓ Gender has value:', data?.gender);
      }
      
      if (isEmpty(data?.current_weight)) {
        missingFields.push('weight_kg');
      } else {
        console.log('✓ Weight has value:', data?.current_weight);
      }
      
      if (isEmpty(data?.target_weight)) {
        missingFields.push('target_weight');
      } else {
        console.log('✓ Target weight has value:', data?.target_weight);
      }
      
      if (isEmpty(data?.height)) {
        missingFields.push('height_cm');
      } else {
        console.log('✓ Height has value:', data?.height);
      }
      
      if (isEmpty(data?.food_allergies)) {
        missingFields.push('food_allergies');
      } else {
        console.log('✓ Food allergies has value:', data?.food_allergies);
      }
      
      if (isEmpty(data?.dietary_preferences)) {
        missingFields.push('food_limitations');
      } else {
        console.log('✓ Food limitations has value:', data?.dietary_preferences);
      }
      
      if (isEmpty(data?.activity_level)) {
        missingFields.push('activity_level');
      } else {
        console.log('✓ Activity level has value:', data?.activity_level);
      }
      
      if (isEmpty(data?.goal)) {
        missingFields.push('goal');
      } else {
        console.log('✓ Goal has value:', data?.goal);
      }
      
      if (isEmpty(data?.client_preference)) {
        missingFields.push('client_preference');
      } else {
        console.log('✓ Client preference has value:', data?.client_preference);
      }
      
      if (isEmpty(data?.medical_conditions)) {
        missingFields.push('medical_conditions');
      } else {
        console.log('✓ Medical conditions has value:', data?.medical_conditions);
      }

      console.log('📋 Missing fields to fill:', missingFields);

      // No need to store availableFields, we only need to set filteredSteps

      // Filter steps to only show steps with missing fields
      const filtered = allSteps
        .map(step => ({
          ...step,
          fields: step.fields.filter(field => missingFields.includes(field))
        }))
        .filter(step => step.fields.length > 0);

      setFilteredSteps(filtered);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setCheckingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNoneClick = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: ''
    }));
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleNext = async () => {
    // Validate current step fields
    const currentStepFields = filteredSteps[currentStep]?.fields || [];
    
    // Fields that can be empty (None is a valid selection)
    const optionalFields = ['medical_conditions', 'food_allergies', 'food_limitations', 'client_preference'];
    
    const missingFields = currentStepFields.filter(field => {
      // Skip validation for optional fields (empty string means "None" is selected)
      if (optionalFields.includes(field)) {
        return false;
      }
      // For other fields, empty value means missing
      return !formData[field];
    });

    if (missingFields.length > 0) {
      setError(language === 'hebrew' ? 'אנא מלא את כל השדות' : 'Please fill in all fields');
      return;
    }

    // Validate phone number if it's in the current step
    if (currentStepFields.includes('phone') && formData.phone) {
      const phoneValidation = validatePhoneNumber(formData.phone, formData.phoneCountryCode);
      if (!phoneValidation.valid) {
        setError(phoneValidation.error);
        return;
      }
    }

    setError('');

    if (currentStep < filteredSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step - save data
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Calculate age from date_of_birth
      const age = calculateAge(formData.date_of_birth);

      // Collect all fields that were shown in the onboarding form
      const allOnboardingFields = filteredSteps.flatMap(step => step.fields);
      console.log('📝 Fields shown in onboarding:', allOnboardingFields);
      console.log('📋 Current formData:', formData);
      console.log('🔍 Gender check:', { 
        inFields: allOnboardingFields.includes('gender'), 
        value: formData.gender,
        willSave: allOnboardingFields.includes('gender') && formData.gender 
      });
      console.log('🔍 Phone check:', { 
        inFields: allOnboardingFields.includes('phone'), 
        value: formData.phone,
        countryCode: formData.phoneCountryCode,
        willSave: allOnboardingFields.includes('phone') && formData.phone 
      });
      
      // Prepare data for clients - include all fields from onboarding
      const clientData = {
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      };

      // Save all fields that were part of the onboarding, regardless of whether they have values
      // Format phone number with country code
      if (allOnboardingFields.includes('phone')) {
        if (formData.phone && formData.phone.trim()) {
          let phoneNumber = formData.phone.trim().replace(/[-\s]/g, ''); // Remove dashes and spaces
          
          // If phone starts with 0 and country code is +972 (Israel), remove the 0 and add +972
          if (phoneNumber.startsWith('0') && formData.phoneCountryCode === '+972') {
            phoneNumber = formData.phoneCountryCode + phoneNumber.substring(1);
          } else if (!phoneNumber.startsWith('+')) {
            // If it doesn't start with +, prepend the country code
            phoneNumber = formData.phoneCountryCode + phoneNumber;
          }
          
          clientData.phone = phoneNumber;
          console.log('✅ Phone will be saved:', phoneNumber);
        } else {
          console.log('⚠️ Phone field is in onboarding but empty or whitespace');
        }
      }
      
      if (allOnboardingFields.includes('language') && formData.language) {
        clientData.user_language = formData.language;
      }
      if (allOnboardingFields.includes('city') && formData.city) {
        clientData.city = formData.city;
      }
      if (allOnboardingFields.includes('region') && formData.region) {
        clientData.region = formData.region;
      }
      if (allOnboardingFields.includes('date_of_birth') && formData.date_of_birth) {
        clientData.birth_date = formData.date_of_birth;
      }
      if (allOnboardingFields.includes('date_of_birth') && age) {
        clientData.age = age;
      }
      if (allOnboardingFields.includes('gender')) {
        if (formData.gender) {
          clientData.gender = formData.gender;
          console.log('✅ Gender will be saved:', formData.gender);
        } else {
          console.log('⚠️ Gender field is in onboarding but empty');
        }
      }
      if (allOnboardingFields.includes('weight_kg') && formData.weight_kg) {
        clientData.current_weight = parseFloat(formData.weight_kg);
      }
      if (allOnboardingFields.includes('target_weight') && formData.target_weight) {
        clientData.target_weight = parseFloat(formData.target_weight);
      }
      if (allOnboardingFields.includes('height_cm') && formData.height_cm) {
        clientData.height = parseFloat(formData.height_cm);
      }
      if (allOnboardingFields.includes('food_allergies')) {
        clientData.food_allergies = formData.food_allergies || null;
      }
      if (allOnboardingFields.includes('food_limitations')) {
        clientData.dietary_preferences = formData.food_limitations || null;
      }
      if (allOnboardingFields.includes('activity_level') && formData.activity_level) {
        clientData.activity_level = formData.activity_level;
      }
      if (allOnboardingFields.includes('goal') && formData.goal) {
        clientData.goal = formData.goal;
      }
      if (allOnboardingFields.includes('client_preference')) {
        clientData.client_preference = formData.client_preference || null;
      }
      if (allOnboardingFields.includes('medical_conditions')) {
        clientData.medical_conditions = formData.medical_conditions || null;
      }

      // Prepare data for chat_users
      // Format phone for chat_users (same format as clients)
      let formattedPhone = formData.phone;
      if (formData.phone) {
        let phoneNumber = formData.phone.trim().replace(/[-\s]/g, '');
        if (phoneNumber.startsWith('0') && formData.phoneCountryCode === '+972') {
          phoneNumber = formData.phoneCountryCode + phoneNumber.substring(1);
        } else if (!phoneNumber.startsWith('+')) {
          phoneNumber = formData.phoneCountryCode + phoneNumber;
        }
        formattedPhone = phoneNumber;
      }
      
      const chatUserData = {
        phone_number: formattedPhone,
        whatsapp_number: formattedPhone,
        language: formData.language,
        user_language: formData.language,
        city: formData.city,
        region: formData.region,
        date_of_birth: formData.date_of_birth,
        age: age,
        gender: formData.gender,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
        food_allergies: formData.food_allergies,
        food_limitations: formData.food_limitations,
        Activity_level: formData.activity_level,
        goal: formData.goal,
        client_preference: formData.client_preference,
        onboarding_done: true,
        updated_at: new Date().toISOString()
      };

      console.log('💾 Saving to clients:', clientData);
      
      // Update clients
      const { error: profileError } = await supabase
        .from('clients')
        .update(clientData)
        .eq('user_id', user.id);

      if (profileError) {
        console.error('Error updating clients:', profileError);
        throw profileError;
      }

      // Update chat_users if secondary DB is available
      if (supabaseSecondary && userCode) {
        try {
          const { data: chatUser, error: chatUserError } = await supabaseSecondary
            .from('chat_users')
            .select('id')
            .eq('user_code', userCode)
            .single();

          if (!chatUserError && chatUser) {
            const { error: chatUpdateError } = await supabaseSecondary
              .from('chat_users')
              .update(chatUserData)
              .eq('id', chatUser.id);

            if (chatUpdateError) {
              console.error('Error updating chat_users:', chatUpdateError);
              // Don't throw - continue even if chat_users update fails
            }
          }
        } catch (syncError) {
          console.error('Error syncing to chat_users:', syncError);
          // Don't throw - continue even if sync fails
        }
      }

      // Onboarding complete - close modal
      onClose();
    } catch (err) {
      console.error('Error saving onboarding data:', err);
      setError(language === 'hebrew' ? 'שגיאה בשמירת הנתונים. אנא נסה שוב.' : 'Error saving data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  if (checkingData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn" dir={direction}>
        <div className={`${themeClasses.bgCard} rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 animate-scaleIn`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
            <p className={themeClasses.textPrimary}>
              {language === 'hebrew' ? 'בודק נתונים...' : 'Checking data...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (filteredSteps.length === 0) {
    return null;
  }

  const currentFields = filteredSteps[currentStep]?.fields || [];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn" dir={direction}>
      <div className={`${themeClasses.bgCard} rounded-2xl shadow-2xl border border-white/10 p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-scaleIn relative`}>
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-established-500/20 via-emerald-500/10 to-transparent rounded-t-2xl pointer-events-none"></div>
        
        {/* Language Toggle Button */}
        <button
          onClick={toggleLanguage}
          className={`absolute top-6 ${direction === 'rtl' ? 'left-6' : 'right-6'} z-10 px-4 py-2 rounded-lg ${themeClasses.bgCard} border-2 border-gray-600/50 hover:border-emerald-500/50 transition-all duration-200 text-sm font-semibold ${themeClasses.textPrimary} hover:bg-emerald-500/10`}
          title={language === 'hebrew' ? 'Switch to English' : 'עברית'}
        >
          {language === 'hebrew' ? '🇬🇧 English' : '🇮🇱 עברית'}
        </button>
        
        {/* Header */}
        <div className="mb-8 relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-established-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
              {(currentStep + 1)}
            </div>
            <h2 className={`text-3xl font-bold bg-gradient-to-r from-emerald-400 to-established-400 bg-clip-text text-transparent ${themeClasses.textPrimary}`}>
              {language === 'hebrew' ? 'בואו נעשה כמה שאלות התחלה' : "Let's get started"}
            </h2>
          </div>
          <p className={`${themeClasses.textSecondary} ml-14`}>
            {language === 'hebrew' ? `שלב ${currentStep + 1} מתוך ${filteredSteps.length}` : `Step ${currentStep + 1} of ${filteredSteps.length}`}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-700/50 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-established-500 h-2.5 rounded-full transition-all duration-500 ease-out shadow-lg shadow-emerald-500/50"
              style={{ width: `${((currentStep + 1) / filteredSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {currentFields.includes('phone') && (
            <div className="group">
              <label className={`block text-sm font-semibold mb-2 ${themeClasses.textPrimary}`}>
                {language === 'hebrew' ? 'מספר טלפון' : 'Phone Number'}
              </label>
              <div className="flex gap-2">
                <select
                  name="phoneCountryCode"
                  value={formData.phoneCountryCode}
                  onChange={handleInputChange}
                  className={`px-3 py-3.5 ${themeClasses.bgCard} border-2 border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} hover:border-emerald-500/50 cursor-pointer text-sm`}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.country} {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`flex-1 px-4 py-3.5 ${themeClasses.bgCard} border-2 border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} placeholder:text-gray-400 hover:border-emerald-500/50`}
                  placeholder={language === 'hebrew' ? '50-123-4567' : '50-123-4567'}
                />
              </div>
            </div>
          )}

          {currentFields.includes('language') && (
            <div className="group">
              <label className={`block text-sm font-semibold mb-2 ${themeClasses.textPrimary}`}>
                {language === 'hebrew' ? 'שפה מועדפת' : 'Preferred Language'}
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 ${themeClasses.bgCard} border-2 border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} hover:border-emerald-500/50 cursor-pointer`}
              >
                <option value="en">🇬🇧 English (en)</option>
                <option value="he">🇮🇱 עברית (he)</option>
              </select>
            </div>
          )}

          {currentFields.includes('city') && (
            <div className="group">
              <label className={`block text-sm font-semibold mb-2 ${themeClasses.textPrimary}`}>
                {language === 'hebrew' ? 'עיר' : 'City'}
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 ${themeClasses.bgCard} border-2 border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} placeholder:text-gray-400 hover:border-emerald-500/50`}
                placeholder={language === 'hebrew' ? 'תל אביב' : 'Tel Aviv'}
              />
            </div>
          )}

          {currentFields.includes('region') && (
            <div className="group">
              <label className={`block text-sm font-semibold mb-2 ${themeClasses.textPrimary}`}>
                {language === 'hebrew' ? 'אזור' : 'Region'}
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 ${themeClasses.bgCard} border-2 border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} placeholder:text-gray-400 hover:border-emerald-500/50`}
                placeholder={language === 'hebrew' ? 'מרכז' : 'Center'}
              />
            </div>
          )}

          {currentFields.includes('date_of_birth') && (
            <div className="group">
              <label className={`block text-sm font-semibold ${themeClasses.textPrimary} mb-2`}>
                {language === 'hebrew' ? 'תאריך לידה' : 'Date of Birth'}
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 ${themeClasses.bgCard} border-2 border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} hover:border-emerald-500/50`}
              />
            </div>
          )}

          {currentFields.includes('gender') && (
            <div className="group">
              <label className={`block text-sm font-semibold ${themeClasses.textPrimary} mb-2`}>
                {language === 'hebrew' ? 'מין' : 'Gender'}
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 ${themeClasses.bgCard} border-2 border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} hover:border-emerald-500/50`}
              >
                <option value="">{language === 'hebrew' ? 'בחר' : 'Select'}</option>
                <option value="male">{language === 'hebrew' ? 'זכר' : 'Male'}</option>
                <option value="female">{language === 'hebrew' ? 'נקבה' : 'Female'}</option>
                <option value="other">{language === 'hebrew' ? 'אחר' : 'Other'}</option>
              </select>
            </div>
          )}

          {currentFields.includes('weight_kg') && (
            <div className="group">
              <label className={`block text-sm font-semibold ${themeClasses.textPrimary} mb-2`}>
                {language === 'hebrew' ? 'משקל נוכחי (ק"ג)' : 'Current Weight (kg)'}
              </label>
              <input
                type="number"
                name="weight_kg"
                value={formData.weight_kg}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className={`w-full px-4 py-3.5 ${themeClasses.bgCard} border-2 border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} hover:border-emerald-500/50`}
                placeholder={language === 'hebrew' ? '70' : '70'}
              />
            </div>
          )}

          {currentFields.includes('target_weight') && (
            <div className="group">
              <label className={`block text-sm font-semibold ${themeClasses.textPrimary} mb-2`}>
                {language === 'hebrew' ? 'משקל מטרה (ק"ג)' : 'Target Weight (kg)'}
              </label>
              <input
                type="number"
                name="target_weight"
                value={formData.target_weight}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                className={`w-full px-4 py-3.5 ${themeClasses.bgCard} border-2 border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} hover:border-emerald-500/50`}
                placeholder={language === 'hebrew' ? '65' : '65'}
              />
            </div>
          )}

          {currentFields.includes('height_cm') && (
            <div className="group">
              <label className={`block text-sm font-semibold ${themeClasses.textPrimary} mb-2`}>
                {language === 'hebrew' ? 'גובה (ס"מ)' : 'Height (cm)'}
              </label>
              <input
                type="number"
                name="height_cm"
                value={formData.height_cm}
                onChange={handleInputChange}
                min="0"
                step="1"
                className={`w-full px-4 py-3.5 ${themeClasses.bgCard} border-2 border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} hover:border-emerald-500/50`}
                placeholder={language === 'hebrew' ? '175' : '175'}
              />
            </div>
          )}

          {currentFields.includes('medical_conditions') && (
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-sm font-semibold ${themeClasses.textPrimary}`}>
                  {language === 'hebrew' ? 'מצבים רפואיים' : 'Medical Conditions'}
                </label>
                <button
                  type="button"
                  onClick={() => handleNoneClick('medical_conditions')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    !formData.medical_conditions
                      ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400'
                      : 'bg-gray-700/50 border-2 border-gray-600/50 text-gray-400 hover:bg-gray-600/50 hover:border-emerald-500/30 hover:text-emerald-400'
                  }`}
                >
                  {!formData.medical_conditions ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {language === 'hebrew' ? 'אין' : 'None'}
                </button>
              </div>
              <textarea
                name="medical_conditions"
                value={formData.medical_conditions}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-4 py-3.5 ${themeClasses.bgCard} border-2 ${!formData.medical_conditions ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-gray-600/50'} rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} hover:border-emerald-500/50`}
                placeholder={!formData.medical_conditions ? (language === 'hebrew' ? 'לא נבחר - לחץ כדי להוסיף' : 'None selected - click to add') : (language === 'hebrew' ? 'לדוגמה: סוכרת, לחץ דם...' : 'e.g., diabetes, hypertension...')}
              />
            </div>
          )}

          {currentFields.includes('food_allergies') && (
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-sm font-semibold ${themeClasses.textPrimary}`}>
                  {language === 'hebrew' ? 'אלרגיות למזון' : 'Food Allergies'}
                </label>
                <button
                  type="button"
                  onClick={() => handleNoneClick('food_allergies')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    !formData.food_allergies
                      ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400'
                      : 'bg-gray-700/50 border-2 border-gray-600/50 text-gray-400 hover:bg-gray-600/50 hover:border-emerald-500/30 hover:text-emerald-400'
                  }`}
                >
                  {!formData.food_allergies ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {language === 'hebrew' ? 'אין' : 'None'}
                </button>
              </div>
              <textarea
                name="food_allergies"
                value={formData.food_allergies}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-4 py-3.5 ${themeClasses.bgCard} border-2 ${!formData.food_allergies ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-gray-600/50'} rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} hover:border-emerald-500/50`}
                placeholder={!formData.food_allergies ? (language === 'hebrew' ? 'לא נבחר - לחץ כדי להוסיף' : 'None selected - click to add') : (language === 'hebrew' ? 'לדוגמה: בוטנים, חלב...' : 'e.g., peanuts, dairy...')}
              />
            </div>
          )}

          {currentFields.includes('food_limitations') && (
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-sm font-semibold ${themeClasses.textPrimary}`}>
                  {language === 'hebrew' ? 'הגבלות תזונתיות' : 'Food Limitations'}
                </label>
                <button
                  type="button"
                  onClick={() => handleNoneClick('food_limitations')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    !formData.food_limitations
                      ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400'
                      : 'bg-gray-700/50 border-2 border-gray-600/50 text-gray-400 hover:bg-gray-600/50 hover:border-emerald-500/30 hover:text-emerald-400'
                  }`}
                >
                  {!formData.food_limitations ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {language === 'hebrew' ? 'אין' : 'None'}
                </button>
              </div>
              <textarea
                name="food_limitations"
                value={formData.food_limitations}
                onChange={handleInputChange}
                rows="3"
                className={`w-full px-4 py-3.5 ${themeClasses.bgCard} border-2 ${!formData.food_limitations ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-gray-600/50'} rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} hover:border-emerald-500/50`}
                placeholder={!formData.food_limitations ? (language === 'hebrew' ? 'לא נבחר - לחץ כדי להוסיף' : 'None selected - click to add') : (language === 'hebrew' ? 'לדוגמה: צמחוני, כשר...' : 'e.g., vegetarian, kosher...')}
              />
            </div>
          )}

          {currentFields.includes('activity_level') && (
            <div className="group">
              <label className={`block text-sm font-semibold ${themeClasses.textPrimary} mb-2`}>
                {language === 'hebrew' ? 'רמת פעילות' : 'Activity Level'}
              </label>
              <select
                name="activity_level"
                value={formData.activity_level}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 ${themeClasses.bgCard} border-2 border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} hover:border-emerald-500/50`}
              >
                <option value="">{language === 'hebrew' ? 'בחר' : 'Select'}</option>
                <option value="sedentary">{language === 'hebrew' ? 'יושבני - מעט או ללא פעילות גופנית' : 'Sedentary - Little or no exercise'}</option>
                <option value="light">{language === 'hebrew' ? 'פעילות קלה - 1-3 פעמים בשבוע' : 'Light Activity - 1-3 days/week'}</option>
                <option value="moderate">{language === 'hebrew' ? 'פעילות בינונית - 3-5 פעמים בשבוע' : 'Moderate Activity - 3-5 days/week'}</option>
                <option value="active">{language === 'hebrew' ? 'פעיל - 6-7 פעמים בשבוע' : 'Active - 6-7 days/week'}</option>
                <option value="extreme">{language === 'hebrew' ? 'קיצוני - פעילות אינטנסיבית/עבודה פיזית' : 'Extreme - Very hard exercise/physical job'}</option>
              </select>
            </div>
          )}

          {currentFields.includes('goal') && (
            <div className="group">
              <label className={`block text-sm font-semibold ${themeClasses.textPrimary} mb-2`}>
                {language === 'hebrew' ? 'מטרה' : 'Goal'}
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleInputChange}
                className={`w-full px-4 py-3.5 ${themeClasses.bgCard} border-2 border-gray-600/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} hover:border-emerald-500/50 cursor-pointer`}
              >
                <option value="">{language === 'hebrew' ? 'בחר מטרה' : 'Select a goal'}</option>
                <option value="lose">{language === 'hebrew' ? 'ירידה במשקל' : 'Lose Weight'}</option>
                <option value="cut">{language === 'hebrew' ? 'CUT' : 'CUT'}</option>
                <option value="maintain">{language === 'hebrew' ? 'שמירה על משקל' : 'Maintain Weight'}</option>
                <option value="gain">{language === 'hebrew' ? 'עלייה במשקל' : 'Gain Weight'}</option>
                <option value="muscle">{language === 'hebrew' ? 'בניית שרירים' : 'Build Muscle'}</option>
                <option value="improve_performance">{language === 'hebrew' ? 'שיפור ביצועים' : 'Improve Performance'}</option>
                <option value="improve_health">{language === 'hebrew' ? 'שיפור בריאות' : 'Improve Health'}</option>
              </select>
            </div>
          )}

          {currentFields.includes('client_preference') && (
            <div className="group">
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-sm font-semibold ${themeClasses.textPrimary}`}>
                  {language === 'hebrew' ? 'העדפות אישיות' : 'Personal Preferences'}
                </label>
                <button
                  type="button"
                  onClick={() => handleNoneClick('client_preference')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    !formData.client_preference
                      ? 'bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-400'
                      : 'bg-gray-700/50 border-2 border-gray-600/50 text-gray-400 hover:bg-gray-600/50 hover:border-emerald-500/30 hover:text-emerald-400'
                  }`}
                >
                  {!formData.client_preference ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  {language === 'hebrew' ? 'אין' : 'None'}
                </button>
              </div>
              <textarea
                name="client_preference"
                value={formData.client_preference}
                onChange={handleInputChange}
                rows="4"
                className={`w-full px-4 py-3.5 ${themeClasses.bgCard} border-2 ${!formData.client_preference ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-gray-600/50'} rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 ${themeClasses.textPrimary} hover:border-emerald-500/50`}
                placeholder={!formData.client_preference ? (language === 'hebrew' ? 'לא נבחר - לחץ כדי להוסיף' : 'None selected - click to add') : (language === 'hebrew' ? 'מה אתה אוהב לאכול? מה אתה לא אוהב לאכול?' : 'What do you like to eat? What don\'t you like to eat?')}
              />
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border-2 border-red-500/30 text-red-400 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
          <div>
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                disabled={loading}
                className={`px-8 py-3.5 border-2 border-gray-600/50 rounded-xl font-semibold ${themeClasses.textSecondary} hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ← {language === 'hebrew' ? 'קודם' : 'Previous'}
              </button>
            )}
            {currentStep === 0 && (
              <button
                onClick={handleSkip}
                disabled={loading}
                className={`px-6 py-3.5 text-gray-400 hover:text-white font-semibold transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {language === 'hebrew' ? 'דלג' : 'Skip'}
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {currentStep < filteredSteps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={loading}
                className={`px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {language === 'hebrew' ? 'הבא' : 'Next'} →
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={loading}
                className={`px-6 py-3 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (language === 'hebrew' ? 'שומר...' : 'Saving...') : (language === 'hebrew' ? 'סיום' : 'Finish')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;

