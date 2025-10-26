import { createClient } from '@supabase/supabase-js'

// Primary Supabase connection (for users, clients, auth)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log('Primary Supabase URL:', supabaseUrl ? 'Loaded' : 'Missing');
  console.log('Primary Supabase Key:', supabaseAnonKey ? 'Loaded' : 'Missing');
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing primary Supabase environment variables. Please check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Secondary Supabase connection (for meal plans, messages, food logs)
const supabaseSecondaryUrl = process.env.REACT_APP_SUPABASE_SECONDARY_URL
const supabaseSecondaryAnonKey = process.env.REACT_APP_SUPABASE_SECONDARY_ANON_KEY

// Only log in development
if (process.env.NODE_ENV === 'development') {
  console.log('Secondary Supabase URL:', supabaseSecondaryUrl ? 'Loaded' : 'Missing');
  console.log('Secondary Supabase Key:', supabaseSecondaryAnonKey ? 'Loaded' : 'Missing');
  console.log('Secondary URL value:', supabaseSecondaryUrl);
  console.log('Secondary Key value:', supabaseSecondaryAnonKey ? `${supabaseSecondaryAnonKey.substring(0, 10)}...` : 'undefined');
}

if (!supabaseSecondaryUrl || !supabaseSecondaryAnonKey) {
  console.warn('Secondary Supabase environment variables not found. Meal plans, messages, and food logs will not be available.')
}

export const supabaseSecondary = supabaseSecondaryUrl && supabaseSecondaryAnonKey 
  ? createClient(supabaseSecondaryUrl, supabaseSecondaryAnonKey, {
      auth: {
        persistSession: false, // Don't persist session for secondary client
        autoRefreshToken: false,
        detectSessionInUrl: false
      }
    })
  : null
