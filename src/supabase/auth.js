import { supabase, supabaseSecondary } from './supabaseClient'

// Sign up with email and password
export const signUp = async (email, password, userData = {}) => {
  try {
    console.log('Attempting signup with:', { email, userData });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name,
          phone: userData.phone,
          newsletter: userData.newsletter,
          full_name: `${userData.first_name} ${userData.last_name}`.trim()
        }
      }
    })
    
    console.log('Signup response:', { data, error });
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Sign up error:', error)
    return { data: null, error }
  }
}

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Sign in error:', error)
    return { data: null, error }
  }
}

// Sign out
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Sign out error:', error)
    return { error }
  }
}

// Get current user
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error) {
    console.error('Get current user error:', error)
    return { user: null, error }
  }
}

// Reset password
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Reset password error:', error)
    return { error }
  }
}

// Update user profile
export const updateProfile = async (updates) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Update profile error:', error)
    return { data: null, error }
  }
}

// Listen to auth changes
export const onAuthStateChange = (callback) => {
  return supabase.auth.onAuthStateChange(callback)
}

// Generate a unique 6-letter user code
export const generateUniqueUserCode = async () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loops

  while (attempts < maxAttempts) {
    // Generate random 6-letter code
    let userCode = '';
    for (let i = 0; i < 6; i++) {
      userCode += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    // Check if this code already exists in the database
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('user_code')
        .eq('user_code', userCode)
        .single();

      // If no data found (error code PGRST116), the code is unique
      if (error && error.code === 'PGRST116') {
        console.log(`Generated unique user code: ${userCode}`);
        return userCode;
      }

      // If no error, the code exists, try again
      if (!error) {
        console.log(`User code ${userCode} already exists, generating new one...`);
        attempts++;
        continue;
      }

      // If there's a different error, throw it
      throw error;
    } catch (error) {
      console.error('Error checking user code uniqueness:', error);
      throw error;
    }
  }

  throw new Error('Failed to generate unique user code after maximum attempts');
};

// Create client record in clients table and chat_users table
export const createClientRecord = async (userId, userData) => {
  try {
    console.log('Creating client record for user:', userId, 'with data:', userData);
    
    // Generate unique user code
    const userCode = await generateUniqueUserCode();
    console.log('Generated user code:', userCode);
    
    // Use the service role key for this operation
    const serviceRoleKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;
    
    if (!serviceRoleKey) {
      console.warn('Service role key not found, using regular client');
      // Fallback to regular client
      const { data, error } = await supabase
        .from('clients')
        .insert([
          {
            user_id: userId,
            full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
            email: userData.email,
            phone: userData.phone,
            user_code: userCode,
            status: 'active'
          }
        ])
        .select()

      console.log('Client record creation result:', { data, error });

      if (error) {
        console.error('Client record creation error:', error);
        throw error;
      }
      
      // Also create record in chat_users table (secondary database)
      if (supabaseSecondary && data && data[0]) {
        try {
          console.log('Creating chat_users record for user_code:', userCode);
          const chatUserData = {
            user_code: userCode,
            full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
            email: userData.email,
            phone_number: userData.phone,
            platform: 'web',
            activated: false,
            is_verified: false,
            language: 'en',
            created_at: new Date().toISOString()
          };

          const { data: chatUserDataResult, error: chatUserError } = await supabaseSecondary
            .from('chat_users')
            .insert([chatUserData])
            .select();

          if (chatUserError) {
            console.error('Error creating chat_users record:', chatUserError);
            // Don't throw - continue even if chat_users creation fails
          } else {
            console.log('Chat user created successfully:', chatUserDataResult);
          }
        } catch (chatError) {
          console.error('Unexpected error creating chat_users record:', chatError);
          // Don't throw - continue even if chat_users creation fails
        }
      }
      
      return { data, error: null }
    }

    // Use service role client for admin operations
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(
      process.env.REACT_APP_SUPABASE_URL,
      serviceRoleKey
    );

    const { data, error } = await supabaseAdmin
      .from('clients')
      .insert([
        {
          user_id: userId,
          full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          email: userData.email,
          phone: userData.phone,
          user_code: userCode,
          status: 'active'
        }
      ])
      .select()

    console.log('Client record creation result:', { data, error });

    if (error) {
      console.error('Client record creation error:', error);
      throw error;
    }
    
    // Also create record in chat_users table (secondary database)
    if (supabaseSecondary && data && data[0]) {
      try {
        console.log('Creating chat_users record for user_code:', userCode);
        const chatUserData = {
          user_code: userCode,
          full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          email: userData.email,
          phone_number: userData.phone,
          platform: 'web',
          activated: false,
          is_verified: false,
          language: 'en',
          created_at: new Date().toISOString()
        };

        const { data: chatUserDataResult, error: chatUserError } = await supabaseSecondary
          .from('chat_users')
          .insert([chatUserData])
          .select();

        if (chatUserError) {
          console.error('Error creating chat_users record:', chatUserError);
          // Don't throw - continue even if chat_users creation fails
        } else {
          console.log('Chat user created successfully:', chatUserDataResult);
        }
      } catch (chatError) {
        console.error('Unexpected error creating chat_users record:', chatError);
        // Don't throw - continue even if chat_users creation fails
      }
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Create client record error:', error)
    return { data: null, error }
  }
}

// Get client record by user ID
export const getClientRecord = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Get client record error:', error)
    return { data: null, error }
  }
}

// Update client record in clients and optionally sync to chat_users
export const updateClientRecord = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('user_id', userId)
      .select()

    if (error) throw error
    
    // If secondary DB is available and we have user_code, also update chat_users
    if (supabaseSecondary && data && data[0] && data[0].user_code) {
      try {
        // Get the chat_users id using user_code
        const { data: chatUser, error: chatUserError } = await supabaseSecondary
          .from('chat_users')
          .select('id')
          .eq('user_code', data[0].user_code)
          .single();

        if (!chatUserError && chatUser) {
          // Map updates to chat_users fields
          const chatUpdates = {};
          
          // Map fields that exist in both tables
          if (updates.full_name) chatUpdates.full_name = updates.full_name;
          if (updates.email) chatUpdates.email = updates.email;
          if (updates.phone) chatUpdates.phone_number = updates.phone;
          if (updates.region) chatUpdates.region = updates.region;
          if (updates.city) chatUpdates.city = updates.city;
          if (updates.timezone) chatUpdates.timezone = updates.timezone;
          if (updates.age) chatUpdates.age = updates.age;
          if (updates.gender) chatUpdates.gender = updates.gender;
          if (updates.birth_date) chatUpdates.date_of_birth = updates.birth_date;
          if (updates.food_allergies) chatUpdates.food_allergies = updates.food_allergies;
          if (updates.updated_at) chatUpdates.updated_at = updates.updated_at;

          // Only update if there are fields to update
          if (Object.keys(chatUpdates).length > 0) {
            await supabaseSecondary
              .from('chat_users')
              .update(chatUpdates)
              .eq('id', chatUser.id);
            
            console.log('Chat user synced successfully');
          }
        }
      } catch (syncError) {
        console.error('Error syncing to chat_users:', syncError);
        // Don't throw - continue even if sync fails
      }
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Update client record error:', error)
    return { data: null, error }
  }
}
