import { supabase } from '../lib/supabase';
import { trackTokenUsage } from './tokenService';

export async function getHooksContent(type = 'All Hooks') {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let query = supabase
      .from('hooks_content')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (type !== 'All Hooks') {
      query = query.eq('hook_type', type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting hooks content:', error);
    throw error;
  }
}

export async function createHooksContent(content, platform, contentType, hookType) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Track token usage before creating content
    await trackTokenUsage('hook_content', content);

    // Create hooks content
    const { data, error } = await supabase
      .from('hooks_content')
      .insert([{
        user_id: user.id,
        content,
        platform,
        content_type: contentType,
        hook_type: hookType
      }])
      .select()
      .single();

    if (error) {
      if (error.message.includes('Limit reached')) {
        throw new Error('You have reached the maximum limit of 12 content items for this hook type');
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating hooks content:', error);
    throw error;
  }
}

export async function updateHooksContent(id, content) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('hooks_content')
      .update({ content })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating hooks content:', error);
    throw error;
  }
}

export async function deleteHooksContent(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('hooks_content')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting hooks content:', error);
    throw error;
  }
}