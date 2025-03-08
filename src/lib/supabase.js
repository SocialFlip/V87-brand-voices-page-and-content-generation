import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Content operations
export async function saveContentToDb(content, platformId) {
  try {
    const { data, error } = await supabase
      .from('content')
      .insert([{
        content_text: content,
        platform_id: platformId,
        status: 'draft',
        is_generated: true
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving content:', error);
    throw error;
  }
}

export async function updateContentInDb(id, content) {
  const { data, error } = await supabase
    .from('content')
    .update({ content_text: content })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteContentFromDb(id) {
  const { error } = await supabase
    .from('content')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Calendar operations
export async function scheduleContentInDb(contentId, scheduledAt) {
  const { data, error } = await supabase
    .from('scheduled_content')
    .insert([{
      content_id: contentId,
      scheduled_at: scheduledAt
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getScheduledContentFromDb() {
  const { data, error } = await supabase
    .from('scheduled_content')
    .select(`
      *,
      content:content_id (
        content_text,
        platform:platform_id (
          name,
          icon_name,
          color
        )
      )
    `)
    .order('scheduled_at', { ascending: true });

  if (error) throw error;
  return data;
}

// Platform operations
export async function getPlatforms() {
  const { data, error } = await supabase
    .from('content_platforms')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

// Content history operations
export async function getContentHistory(contentId) {
  const { data, error } = await supabase
    .from('content_history')
    .select('*')
    .eq('content_id', contentId)
    .order('changed_at', { ascending: false });

  if (error) throw error;
  return data;
}