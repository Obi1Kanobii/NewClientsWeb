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
  
  // Consultation - $650
  CONSULTATION: 'price_1Rg5R6HIeYfvCylDcsV3T2Kr'
};

// Product configuration with metadata
export const PRODUCT_CONFIG = {
  [STRIPE_PRODUCTS.BETTER_PRO]: {
    name: 'BetterPro Plan',
    description: 'Complete nutrition and training program with premium features',
    features: [
      'Advanced meal planning',
      'Personal trainer support', 
      'Progress tracking',
      'Priority support',
      'Custom workout plans'
    ],
    category: 'premium',
    prices: [
      {
        id: STRIPE_PRICES.BETTER_PRO_OPTION_1,
        name: '3 Month Plan',
        interval: 'month',
        interval_count: 1,
        commitment: 3,
        amount: 68000, // $680/month in cents
        currency: 'USD',
        popular: false
      },
      {
        id: STRIPE_PRICES.BETTER_PRO_OPTION_2, 
        name: '6 Month Plan',
        interval: 'month',
        interval_count: 1,
        commitment: 6,
        amount: 60000, // $600/month in cents
        currency: 'USD',
        discount: '15% off',
        popular: true
      }
    ]
  },
  
  [STRIPE_PRODUCTS.NUTRITION_TRAINING]: {
    name: 'Nutrition + Training',
    description: 'Comprehensive nutrition guidance with training support',
    features: [
      'Personalized meal plans',
      'Workout routines',
      'Progress monitoring',
      'Expert consultations',
      'Mobile app access'
    ],
    category: 'complete',
    prices: [
      {
        id: STRIPE_PRICES.NUTRITION_TRAINING_MONTHLY_1,
        name: 'Monthly Sessions',
        interval: 'month',
        interval_count: 1,
        frequency: 'monthly',
        amount: 75000, // $750/month in cents
        currency: 'USD',
        popular: false
      },
      {
        id: STRIPE_PRICES.NUTRITION_TRAINING_MONTHLY_2,
        name: 'Monthly Premium',
        interval: 'month', 
        interval_count: 1,
        frequency: 'monthly',
        amount: 83000, // $830/month in cents
        currency: 'USD',
        popular: true
      },
      {
        id: STRIPE_PRICES.NUTRITION_TRAINING_BIWEEKLY,
        name: 'Bi-weekly Sessions',
        interval: 'month',
        interval_count: 1,
        frequency: 'biweekly',
        amount: 50000, // $500/month in cents
        currency: 'USD',
        popular: false
      }
    ]
  },
  
  [STRIPE_PRODUCTS.NUTRITION_ONLY]: {
    name: 'Nutrition Only',
    description: 'Focused nutrition planning and guidance',
    features: [
      'Custom meal plans',
      'Nutritional analysis',
      'Progress tracking',
      'Email support',
      'Recipe library'
    ],
    category: 'nutrition',
    prices: [
      {
        id: STRIPE_PRICES.NUTRITION_ONLY_MONTHLY_1,
        name: 'Monthly Basic',
        interval: 'month',
        interval_count: 1,
        frequency: 'monthly',
        amount: 50000, // $500/month in cents
        currency: 'USD',
        popular: false
      },
      {
        id: STRIPE_PRICES.NUTRITION_ONLY_MONTHLY_2,
        name: 'Monthly Pro', 
        interval: 'month',
        interval_count: 1,
        frequency: 'monthly',
        amount: 58000, // $580/month in cents
        currency: 'USD',
        popular: true
      },
      {
        id: STRIPE_PRICES.NUTRITION_ONLY_BIWEEKLY,
        name: 'Bi-weekly Support',
        interval: 'month',
        interval_count: 1, 
        frequency: 'biweekly',
        amount: 73000, // $730/month in cents
        currency: 'USD',
        popular: false
      }
    ]
  },
  
  [STRIPE_PRODUCTS.PODCAST]: {
    name: 'Podcast Room',
    description: 'Access to premium podcast content and community',
    features: [
      'Exclusive podcast episodes',
      'Community access',
      'Live Q&A sessions',
      'Downloadable content',
      'Early access to new content'
    ],
    category: 'content',
    prices: [
      {
        id: STRIPE_PRICES.PODCAST_ROOM,
        name: 'Monthly Access',
        interval: 'month',
        interval_count: 1,
        amount: 30000, // $300/month in cents
        currency: 'USD',
        popular: true
      }
    ]
  },
  
  [STRIPE_PRODUCTS.CONSULTATION]: {
    name: 'One-on-One Consultation',
    description: 'Personal consultation with nutrition expert',
    features: [
      '60-minute session',
      'Personalized recommendations',
      'Follow-up support',
      'Action plan',
      'Progress evaluation'
    ],
    category: 'consultation',
    prices: [
      {
        id: STRIPE_PRICES.CONSULTATION,
        name: 'Single Session',
        interval: null, // One-time payment
        amount: 65000, // $650.00 in cents
        currency: 'USD',
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
