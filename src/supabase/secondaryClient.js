import { supabaseSecondary } from './supabaseClient'

// Check if secondary Supabase is available
const isSecondaryAvailable = () => {
  if (!supabaseSecondary) {
    console.warn('Secondary Supabase client is not available. Please check your environment variables.');
    return false;
  }
  return true;
};

// MEAL PLANS
export const getMealPlan = async (userCode) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    console.log('Searching for meal plan with userCode:', userCode);
    
    const { data, error } = await supabaseSecondary
      .from('meal_plans_and_schemas')
      .select('*')
      .eq('user_code', userCode)
      .eq('record_type', 'meal_plan')
      .eq('status', 'active')
      .single();

    console.log('Meal plan query result:', { data, error });

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching meal plan:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching meal plan:', error);
    return { data: null, error };
  }
};

export const getMealPlanSchemas = async () => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    const { data, error } = await supabaseSecondary
      .from('meal_plans_and_schemas')
      .select('*')
      .eq('record_type', 'schema')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching meal plan schemas:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching meal plan schemas:', error);
    return { data: null, error };
  }
};

export const createMealPlan = async (dietitianId, userCode, mealPlanData) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    const { data, error } = await supabaseSecondary
      .from('meal_plans_and_schemas')
      .insert([{
        record_type: 'meal_plan',
        dietitian_id: dietitianId,
        user_code: userCode,
        meal_plan_name: mealPlanData.meal_plan_name,
        meal_plan: mealPlanData.meal_plan,
        status: mealPlanData.status || 'draft',
        active_from: mealPlanData.active_from,
        active_until: mealPlanData.active_until,
        daily_total_calories: mealPlanData.daily_total_calories,
        macros_target: mealPlanData.macros_target,
        recommendations: mealPlanData.recommendations,
        dietary_restrictions: mealPlanData.dietary_restrictions,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Error creating meal plan:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error creating meal plan:', error);
    return { data: null, error };
  }
};

export const updateMealPlan = async (mealPlanId, mealPlanData) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    const { data, error } = await supabaseSecondary
      .from('meal_plans_and_schemas')
      .update({
        meal_plan_name: mealPlanData.meal_plan_name,
        meal_plan: mealPlanData.meal_plan,
        status: mealPlanData.status,
        active_from: mealPlanData.active_from,
        active_until: mealPlanData.active_until,
        daily_total_calories: mealPlanData.daily_total_calories,
        macros_target: mealPlanData.macros_target,
        recommendations: mealPlanData.recommendations,
        dietary_restrictions: mealPlanData.dietary_restrictions,
        updated_at: new Date().toISOString()
      })
      .eq('id', mealPlanId)
      .select();

    if (error) {
      console.error('Error updating meal plan:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error updating meal plan:', error);
    return { data: null, error };
  }
};

// FOOD LOGS
export const getFoodLogs = async (userCode, date = null) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    console.log('Fetching food logs for userCode:', userCode, 'date:', date);
    
    // First get user_id from chat_users table using user_code
    const { data: userData, error: userError } = await supabaseSecondary
      .from('chat_users')
      .select('id')
      .eq('user_code', userCode)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return { data: null, error: userError };
    }

    if (!userData) {
      return { data: null, error: { message: 'User not found' } };
    }

    // Now get food logs for this user
    let query = supabaseSecondary
      .from('food_logs')
      .select('*')
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false });

    if (date) {
      query = query.eq('log_date', date);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching food logs:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching food logs:', error);
    return { data: null, error };
  }
};

export const createFoodLog = async (userCode, foodLogData) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    console.log('Creating food log for userCode:', userCode, 'data:', foodLogData);
    
    // First get user_id from chat_users table using user_code
    const { data: userData, error: userError } = await supabaseSecondary
      .from('chat_users')
      .select('id')
      .eq('user_code', userCode)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return { data: null, error: userError };
    }

    if (!userData) {
      return { data: null, error: { message: 'User not found' } };
    }

    // Create food log entry
    const { data, error } = await supabaseSecondary
      .from('food_logs')
      .insert([{
        user_id: userData.id,
        meal_label: foodLogData.meal_label,
        food_items: foodLogData.food_items,
        image_url: foodLogData.image_url,
        total_calories: foodLogData.total_calories,
        total_protein_g: foodLogData.total_protein_g,
        total_carbs_g: foodLogData.total_carbs_g,
        total_fat_g: foodLogData.total_fat_g,
        log_date: foodLogData.log_date || new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Error creating food log:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error creating food log:', error);
    return { data: null, error };
  }
};

export const updateFoodLog = async (foodLogId, foodLogData) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    const { data, error } = await supabaseSecondary
      .from('food_logs')
      .update({
        meal_label: foodLogData.meal_label,
        food_items: foodLogData.food_items,
        image_url: foodLogData.image_url,
        total_calories: foodLogData.total_calories,
        total_protein_g: foodLogData.total_protein_g,
        total_carbs_g: foodLogData.total_carbs_g,
        total_fat_g: foodLogData.total_fat_g,
        log_date: foodLogData.log_date,
        updated_at: new Date().toISOString()
      })
      .eq('id', foodLogId)
      .select();

    if (error) {
      console.error('Error updating food log:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error updating food log:', error);
    return { data: null, error };
  }
};

export const deleteFoodLog = async (foodLogId) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    const { data, error } = await supabaseSecondary
      .from('food_logs')
      .delete()
      .eq('id', foodLogId)
      .select();

    if (error) {
      console.error('Error deleting food log:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error deleting food log:', error);
    return { data: null, error };
  }
};

// CHAT MESSAGES
export const getChatMessages = async (userCode, beforeTimestamp = null) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    console.log('Fetching chat messages for userCode:', userCode, 'beforeTimestamp:', beforeTimestamp);
    
    // First get user_id from chat_users table using user_code
    const { data: userData, error: userError } = await supabaseSecondary
      .from('chat_users')
      .select('id')
      .eq('user_code', userCode)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return { data: null, error: userError };
    }

    if (!userData) {
      return { data: null, error: { message: 'User not found' } };
    }

    // Get conversations for this user
    const { data: conversations, error: conversationsError } = await supabaseSecondary
      .from('chat_conversations')
      .select('id')
      .eq('user_id', userData.id)
      .order('started_at', { ascending: false });

    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      return { data: null, error: conversationsError };
    }

    if (!conversations || conversations.length === 0) {
      return { data: [], error: null };
    }

    // Get messages for all conversations
    const conversationIds = conversations.map(conv => conv.id);
    
    // Build query for messages
    let query = supabaseSecondary
      .from('chat_messages')
      .select('*')
      .in('conversation_id', conversationIds);

    // If beforeTimestamp is provided, get messages older than that timestamp
    if (beforeTimestamp) {
      query = query.lt('created_at', beforeTimestamp);
    }

    // Order by created_at descending (newest first) and limit to 20
    query = query.order('created_at', { ascending: false }).limit(20);

    const { data: messages, error: messagesError } = await query;

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      return { data: null, error: messagesError };
    }

    return { data: messages || [], error: null };
  } catch (error) {
    console.error('Unexpected error fetching chat messages:', error);
    return { data: null, error };
  }
};

export const createChatMessage = async (userCode, messageData) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    console.log('Creating chat message for userCode:', userCode, 'data:', messageData);
    
    // First get user_id from chat_users table using user_code
    const { data: userData, error: userError } = await supabaseSecondary
      .from('chat_users')
      .select('id')
      .eq('user_code', userCode)
      .single();

    if (userError) {
      console.error('Error fetching user:', userError);
      return { data: null, error: userError };
    }

    if (!userData) {
      return { data: null, error: { message: 'User not found' } };
    }

    // Get or create conversation for this user
    let { data: conversation, error: conversationError } = await supabaseSecondary
      .from('chat_conversations')
      .select('id')
      .eq('user_id', userData.id)
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (conversationError && conversationError.code !== 'PGRST116') {
      console.error('Error fetching conversation:', conversationError);
      return { data: null, error: conversationError };
    }

    // If no conversation exists, create one
    if (!conversation) {
      const { data: newConversation, error: createError } = await supabaseSecondary
        .from('chat_conversations')
        .insert([{
          user_id: userData.id,
          started_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating conversation:', createError);
        return { data: null, error: createError };
      }

      conversation = newConversation;
    }

    // Create message
    const messageInsert = {
      conversation_id: conversation.id,
      role: messageData.role || 'user',
      topic: messageData.topic,
      extension: messageData.extension,
      attachments: messageData.attachments,
      created_at: new Date().toISOString()
    };

    // Add message or content based on role
    if (messageData.role === 'assistant') {
      messageInsert.message = messageData.message;
    } else {
      messageInsert.content = messageData.content;
    }

    const { data, error } = await supabaseSecondary
      .from('chat_messages')
      .insert([messageInsert])
      .select();

    if (error) {
      console.error('Error creating chat message:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error creating chat message:', error);
    return { data: null, error };
  }
};

// COMPANY MANAGEMENT
export const getCompaniesWithManagers = async () => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };

  try {
    const { data, error } = await supabaseSecondary
      .from('companies')
      .select('id, name, managers:profiles!profiles_company_id_fkey(id, name, role)')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching companies:', error);
      return { data: null, error };
    }

    const formattedCompanies = (data || []).map((company) => ({
      id: company.id,
      name: company.name,
      managers: (company.managers || []).filter((manager) => manager.role === 'company_manager')
    }));

    return { data: formattedCompanies, error: null };
  } catch (error) {
    console.error('Unexpected error fetching companies:', error);
    return { data: null, error };
  }
};

export const getClientCompanyAssignment = async (userCode) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };

  try {
    const { data, error } = await supabaseSecondary
      .from('chat_users')
      .select('provider_id, provider:profiles!chat_users_provider_id_fkey(id, name, company_id)')
      .eq('user_code', userCode)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching client assignment:', error);
      return { data: null, error };
    }

    return { data: data || null, error: null };
  } catch (error) {
    console.error('Unexpected error fetching client assignment:', error);
    return { data: null, error };
  }
};

export const assignClientToCompany = async (userCode, companyId) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };

  try {
    let managerId = null;

    if (companyId) {
      const { data: manager, error: managerError } = await supabaseSecondary
        .from('profiles')
        .select('id')
        .eq('company_id', companyId)
        .eq('role', 'company_manager')
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (managerError && managerError.code !== 'PGRST116') {
        console.error('Error fetching company manager:', managerError);
        return { data: null, error: managerError };
      }

      if (!manager) {
        const customError = { message: 'No manager found for the selected company.' };
        return { data: null, error: customError };
      }

      managerId = manager.id;
    }

    const { data, error } = await supabaseSecondary
      .from('chat_users')
      .update({ provider_id: managerId })
      .eq('user_code', userCode)
      .select('provider_id')
      .single();

    if (error) {
      console.error('Error assigning provider to client:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error assigning provider:', error);
    return { data: null, error };
  }
};

export const getUserMealPlanHistory = async (userCode) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    const { data, error } = await supabaseSecondary
      .from('meal_plans_and_schemas')
      .select('*')
      .eq('user_code', userCode)
      .eq('record_type', 'meal_plan')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching meal plan history:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching meal plan history:', error);
    return { data: null, error };
  }
};


// MESSAGES
export const getMessages = async (userId) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    const { data, error } = await supabaseSecondary
      .from('messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching messages:', error);
    return { data: null, error };
  }
};

export const sendMessage = async (userId, messageData) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    const { data, error } = await supabaseSecondary
      .from('messages')
      .insert([{
        user_id: userId,
        ...messageData,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Error sending message:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error sending message:', error);
    return { data: null, error };
  }
};

export const markMessageAsRead = async (messageId) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    const { data, error } = await supabaseSecondary
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId)
      .select();

    if (error) {
      console.error('Error marking message as read:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error marking message as read:', error);
    return { data: null, error };
  }
};

// FOOD DATABASE (for searching foods)
export const searchFoods = async (query, limit = 20) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    const { data, error } = await supabaseSecondary
      .from('foods')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(limit);

    if (error) {
      console.error('Error searching foods:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error searching foods:', error);
    return { data: null, error };
  }
};

export const getFoodById = async (foodId) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    const { data, error } = await supabaseSecondary
      .from('foods')
      .select('*')
      .eq('id', foodId)
      .single();

    if (error) {
      console.error('Error fetching food by ID:', error);
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Unexpected error fetching food by ID:', error);
    return { data: null, error };
  }
};

// Debug function to check meal plans
export const debugMealPlans = async (userCode) => {
  if (!isSecondaryAvailable()) return { data: null, error: { message: 'Secondary database not available' } };
  
  try {
    console.log('Debug: Checking all meal plans for userCode:', userCode);
    
    // Check all meal plans for this user (any status)
    const { data: allPlans, error: allError } = await supabaseSecondary
      .from('meal_plans_and_schemas')
      .select('*')
      .eq('user_code', userCode)
      .eq('record_type', 'meal_plan');

    console.log('All meal plans for user:', { allPlans, allError });

    // Check all meal plans in the database (for debugging)
    const { data: allPlansInDb, error: allDbError } = await supabaseSecondary
      .from('meal_plans_and_schemas')
      .select('user_code, status, record_type, meal_plan_name')
      .eq('record_type', 'meal_plan')
      .limit(10);

    console.log('All meal plans in database (first 10):', { allPlansInDb, allDbError });

    return { data: { allPlans, allPlansInDb }, error: null };
  } catch (error) {
    console.error('Debug error:', error);
    return { data: null, error };
  }
};
