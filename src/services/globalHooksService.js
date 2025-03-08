import { supabase } from '../lib/supabase';

export async function getGlobalHooks() {
  try {
    const { data, error } = await supabase
      .from('global_hooks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching global hooks:', error);
    throw error;
  }
}

export async function createGlobalHook(content, type) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    if (user.email !== 'businessai360@gmail.com') {
      throw new Error('Unauthorized: Only admin can create global hooks');
    }

    const { data, error } = await supabase
      .from('global_hooks')
      .insert([{
        type,
        content,
        created_by: user.id
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating global hook:', error);
    throw error;
  }
}

export async function updateGlobalHook(id, content) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    if (user.email !== 'businessai360@gmail.com') {
      throw new Error('Unauthorized: Only admin can update global hooks');
    }

    const { data, error } = await supabase
      .from('global_hooks')
      .update({ content })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating global hook:', error);
    throw error;
  }
}

export async function deleteGlobalHook(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');
    
    if (user.email !== 'businessai360@gmail.com') {
      throw new Error('Unauthorized: Only admin can delete global hooks');
    }

    const { error } = await supabase
      .from('global_hooks')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting global hook:', error);
    throw error;
  }
}