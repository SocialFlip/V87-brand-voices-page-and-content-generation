import { supabase } from '../lib/supabase';

export async function getUsers() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email !== 'businessai360@gmail.com') {
      throw new Error('Unauthorized');
    }

    const { data, error } = await supabase
      .from('admin_user_view')
      .select('*')
      .order('joined_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export async function updateUserPlan(userId, plan) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email !== 'businessai360@gmail.com') {
      throw new Error('Unauthorized');
    }

    const tokenLimits = {
      starter: 35000,
      premium: 55000,
      elite: 90000
    };

    const { error } = await supabase
      .from('user_plans')
      .update({ 
        plan_type: plan,
        total_tokens: tokenLimits[plan]
      })
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user plan:', error);
    throw error;
  }
}

export async function deleteUser(userId) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email !== 'businessai360@gmail.com') {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}