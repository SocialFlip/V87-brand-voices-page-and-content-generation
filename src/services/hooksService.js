import { supabase } from '../lib/supabase';
import { trackTokenUsage } from './tokenService';

export async function getHooks() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('hooks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting hooks:', error);
    throw error;
  }
}

export async function getHooksByType(type) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const query = supabase
      .from('hooks')
      .select('*')
      .eq('user_id', user.id);

    if (type !== 'All Hooks') {
      query.eq('type', type);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting hooks by type:', error);
    throw error;
  }
}

export async function createHook(content, type) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Track token usage
    await trackTokenUsage('hook', content);

    const { data, error } = await supabase
      .from('hooks')
      .insert([{
        user_id: user.id,
        type,
        content
      }])
      .select()
      .single();

    if (error) {
      if (error.message.includes('Hook limit reached')) {
        throw new Error('You have reached the maximum limit of 12 hooks for this type');
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating hook:', error);
    throw error;
  }
}

export async function updateHook(id, content) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('hooks')
      .update({ content })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating hook:', error);
    throw error;
  }
}

export async function deleteHook(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('hooks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting hook:', error);
    throw error;
  }
}