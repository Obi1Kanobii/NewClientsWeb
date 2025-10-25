// Stripe Products and Prices Configuration
// Real product and price IDs from your Stripe Dashboard

export const STRIPE_PRODUCTS = {
  BETTER_PRO: 'prod_SbI1Lu7FWbybUO',
  PODCAST: 'prod_SbI1dssS5NElLZ', 
  NUTRITION_TRAINING: 'prod_SbI1AIv2A46oJ9',
  NUTRITION_ONLY: 'prod_SbI0A23T20wul3',
  CONSULTATION: 'prod_SbI1dssS5NElLZ'
};

export const STRIPE_PRICES = {
  // BetterPro - 2 pricing options
  BETTER_PRO_OPTION_1: 'price_1Rg5R8HIeYfvCylDJ4Xfg5hr',
  BETTER_PRO_OPTION_2: 'price_1Rg5R8HIeYfvCylDxX2PsOrR',
  
  // Podcast Room - $300
  PODCAST_ROOM: 'price_1Rg5R6HIeYfvCylDcsV3T2Kr',
  
  // Nutrition + Training Monthly - 2 options
  NUTRITION_TRAINING_MONTHLY_1: 'price_1Rg5R4HIeYfvCylDy1OT1YJc',
  NUTRITION_TRAINING_MONTHLY_2: 'price_1Rg5R4HIeYfvCylDAshP6FOk',
  
  // Nutrition + Training Biweekly
  NUTRITION_TRAINING_BIWEEKLY: 'price_1Rg5RGHIeYfvCylDxuQODpK4',
  
  // Nutrition Only Monthly - 2 options
  NUTRITION_ONLY_MONTHLY_1: 'price_1Rg5QtHIeYfvCylDyXHY5X6G',
  NUTRITION_ONLY_MONTHLY_2: 'price_1Rg5QtHIeYfvCylDwr9v599a',
  
  // Nutrition Only Biweekly
  NUTRITION_ONLY_BIWEEKLY: 'price_1Rg5RGHIeYfvCylDxuQODpK4',
  
  // Consultation - $650 (One-time payment)
  CONSULTATION: 'price_1RY3uZHIeYfvCylD4mylbEP4'
};

// Product configuration with metadata
export const PRODUCT_CONFIG = {
  [STRIPE_PRODUCTS.BETTER_PRO]: {
    name: 'BetterPro Plan',
    nameHebrew: 'תוכנית BetterPro',
    description: 'Complete nutrition and training program with premium features',
    descriptionHebrew: 'תוכנית תזונה ואימונים מלאה עם תכונות פרימיום',
    features: [
      'Advanced meal planning',
      'Personal trainer support', 
      'Progress tracking',
      'Priority support',
      'Custom workout plans'
    ],
    featuresHebrew: [
      'תכנון ארוחות מתקדם',
      'תמיכת מאמן אישי',
      'מעקב התקדמות',
      'תמיכה עדיפות',
      'תוכניות אימון מותאמות'
    ],
    category: 'premium',
    prices: [
      {
        id: STRIPE_PRICES.BETTER_PRO_OPTION_1,
        name: '3 Month Plan',
        nameHebrew: 'תוכנית 3 חודשים',
        interval: 'month',
        interval_count: 1,
        commitment: 3,
        amount: 68000, // ₪680/month in agorot (680 * 100)
        amountUSD: 19400, // $194/month in cents (680 ÷ 3.5)
        currency: 'ILS',
        popular: false
      },
      {
        id: STRIPE_PRICES.BETTER_PRO_OPTION_2, 
        name: '6 Month Plan',
        nameHebrew: 'תוכנית 6 חודשים',
        interval: 'month',
        interval_count: 1,
        commitment: 6,
        amount: 60000, // ₪600/month in agorot
        amountUSD: 17100, // $171/month in cents
        currency: 'ILS',
        discount: '15% off',
        popular: true
      }
    ]
  },
  
  [STRIPE_PRODUCTS.NUTRITION_TRAINING]: {
    name: 'Nutrition + Training',
    nameHebrew: 'תזונה + אימונים',
    description: 'Comprehensive nutrition guidance with training support',
    descriptionHebrew: 'הדרכה תזונתית מקיפה עם תמיכה באימונים',
    features: [
      'Personalized meal plans',
      'Workout routines',
      'Progress monitoring',
      'Expert consultations',
      'Mobile app access'
    ],
    featuresHebrew: [
      'תוכניות ארוחות מותאמות אישית',
      'שגרות אימון',
      'מעקב התקדמות',
      'יעוצים מומחים',
      'גישה לאפליקציה'
    ],
    category: 'complete',
    prices: [
      {
        id: STRIPE_PRICES.NUTRITION_TRAINING_MONTHLY_1,
        name: 'Monthly Sessions',
        nameHebrew: 'מפגשים חודשיים',
        interval: 'month',
        interval_count: 1,
        frequency: 'monthly',
        amount: 75000, // ₪750/month in agorot
        amountUSD: 21400, // $214/month in cents
        currency: 'ILS',
        popular: false
      },
      {
        id: STRIPE_PRICES.NUTRITION_TRAINING_MONTHLY_2,
        name: 'Monthly Premium',
        nameHebrew: 'פרימיום חודשי',
        interval: 'month', 
        interval_count: 1,
        frequency: 'monthly',
        amount: 83000, // ₪830/month in agorot
        amountUSD: 23700, // $237/month in cents
        currency: 'ILS',
        popular: true
      },
      {
        id: STRIPE_PRICES.NUTRITION_TRAINING_BIWEEKLY,
        name: 'Bi-weekly Sessions',
        nameHebrew: 'מפגשים דו שבועיים',
        interval: 'month',
        interval_count: 1,
        frequency: 'biweekly',
        amount: 65000, // ₪650/month in agorot (biweekly should be higher)
        amountUSD: 18600, // $186/month in cents
        currency: 'ILS',
        popular: false
      }
    ]
  },
  
  [STRIPE_PRODUCTS.NUTRITION_ONLY]: {
    name: 'Nutrition Only',
    nameHebrew: 'תזונה בלבד',
    description: 'Focused nutrition planning and guidance',
    descriptionHebrew: 'תכנון תזונתי ממוקד והדרכה',
    features: [
      'Custom meal plans',
      'Nutritional analysis',
      'Progress tracking',
      'Email support',
      'Recipe library'
    ],
    featuresHebrew: [
      'תוכניות ארוחות מותאמות',
      'ניתוח תזונתי',
      'מעקב התקדמות',
      'תמיכה במייל',
      'ספריית מתכונים'
    ],
    category: 'nutrition',
    prices: [
      {
        id: STRIPE_PRICES.NUTRITION_ONLY_MONTHLY_1,
        name: 'Monthly Basic',
        nameHebrew: 'בסיסי חודשי',
        interval: 'month',
        interval_count: 1,
        frequency: 'monthly',
        amount: 50000, // ₪500/month in agorot
        amountUSD: 14300, // $143/month in cents
        currency: 'ILS',
        popular: false
      },
      {
        id: STRIPE_PRICES.NUTRITION_ONLY_MONTHLY_2,
        name: 'Monthly Pro', 
        nameHebrew: 'מקצועי חודשי',
        interval: 'month',
        interval_count: 1,
        frequency: 'monthly',
        amount: 58000, // ₪580/month in agorot
        amountUSD: 16600, // $166/month in cents
        currency: 'ILS',
        popular: true
      },
      {
        id: STRIPE_PRICES.NUTRITION_ONLY_BIWEEKLY,
        name: 'Bi-weekly Support',
        nameHebrew: 'תמיכה דו שבועית',
        interval: 'month',
        interval_count: 1, 
        frequency: 'biweekly',
        amount: 73000, // ₪730/month in agorot
        amountUSD: 20900, // $209/month in cents
        currency: 'ILS',
        popular: false
      }
    ]
  },
  
  [STRIPE_PRODUCTS.PODCAST]: {
    name: 'Podcast Room',
    nameHebrew: 'חדר הפודקאסט',
    description: 'Access to premium podcast content and community',
    descriptionHebrew: 'גישה לתוכן פודקאסט פרימיום וקהילה',
    features: [
      'Exclusive podcast episodes',
      'Community access',
      'Live Q&A sessions',
      'Downloadable content',
      'Early access to new content'
    ],
    featuresHebrew: [
      'פרקי פודקאסט בלעדיים',
      'גישה לקהילה',
      'מפגשי שאלות ותשובות חיים',
      'תוכן להורדה',
      'גישה מוקדמת לתוכן חדש'
    ],
    category: 'content',
    prices: [
      {
        id: STRIPE_PRICES.PODCAST_ROOM,
        name: 'Monthly Access',
        nameHebrew: 'גישה חודשית',
        interval: 'month',
        interval_count: 1,
        amount: 15000, // ₪150/month in agorot
        amountUSD: 4300, // $43/month in cents
        currency: 'ILS',
        popular: true
      }
    ]
  },
  
  [STRIPE_PRODUCTS.CONSULTATION]: {
    name: 'One-on-One Consultation',
    nameHebrew: 'יעוץ אישי',
    description: 'Personal consultation with nutrition expert',
    descriptionHebrew: 'יעוץ אישי עם מומחה תזונה',
    features: [
      '60-minute session',
      'Personalized recommendations',
      'Follow-up support',
      'Action plan',
      'Progress evaluation'
    ],
    featuresHebrew: [
      'מפגש של 60 דקות',
      'המלצות מותאמות אישית',
      'תמיכה המשך',
      'תוכנית פעולה',
      'הערכת התקדמות'
    ],
    category: 'consultation',
    prices: [
      {
        id: STRIPE_PRICES.CONSULTATION,
        name: 'Single Session',
        nameHebrew: 'מפגש יחיד',
        interval: null, // One-time payment
        amount: 65000, // ₪650.00 in agorot
        amountUSD: 18600, // $186.00 in cents
        currency: 'ILS',
        popular: true
      }
    ]
  }
};

// Helper functions
export const getProduct = (productId) => {
  return PRODUCT_CONFIG[productId];
};

export const getAllProducts = () => {
  return Object.keys(PRODUCT_CONFIG).map(productId => ({
    id: productId,
    ...PRODUCT_CONFIG[productId]
  }));
};

export const getProductsByCategory = (category) => {
  return getAllProducts().filter(product => product.category === category);
};

export const getPriceById = (priceId) => {
  for (const product of getAllProducts()) {
    const price = product.prices?.find(p => p.id === priceId);
    if (price) {
      return { ...price, product: product };
    }
  }
  return null;
};

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  options: {
    success_url: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${window.location.origin}/payment-cancel`,
  }
};
