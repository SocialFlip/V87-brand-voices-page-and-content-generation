import { supabase } from '../lib/supabase';

export async function getContents() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get generated content
    const { data: generatedContent, error: generatedError } = await supabase
      .from('generated_content')
      .select(`
        id,
        content_text,
        created_at,
        updated_at,
        status,
        platform:platform_id (
          name,
          icon_name,
          color
        )
      `)
      .eq('user_id', user.id);

    if (generatedError) throw generatedError;

    // Get revived content
    const { data: revivedContent, error: revivedError } = await supabase
      .from('revived_content')
      .select(`
        id,
        content_text,
        created_at,
        updated_at,
        status,
        platform:platform_id (
          name,
          icon_name,
          color
        )
      `)
      .eq('user_id', user.id);

    if (revivedError) throw revivedError;

    // Get ideas content
    const { data: ideasContent, error: ideasError } = await supabase
      .from('content')
      .select(`
        id,
        content_text,
        created_at,
        updated_at,
        status,
        platform:platform_id (
          name,
          icon_name,
          color
        )
      `)
      .eq('user_id', user.id)
      .eq('source', 'ideas');

    if (ideasError) throw ideasError;

    // Combine and sort by creation date
    const allContent = [
      ...(generatedContent || []).map(content => ({
        ...content,
        source: 'generated'
      })),
      ...(revivedContent || []).map(content => ({
        ...content,
        source: 'revived'
      })),
      ...(ideasContent || []).map(content => ({
        ...content,
        source: 'ideas'
      }))
    ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return allContent;
  } catch (error) {
    console.error('Error getting contents:', error);
    throw error;
  }
}

export async function deleteContent(id, source) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const table = source === 'generated' ? 'generated_content' : 
                 source === 'revived' ? 'revived_content' : 'content';
                 
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
}

export async function updateContent(id, newContent, source) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const table = source === 'generated' ? 'generated_content' : 
                 source === 'revived' ? 'revived_content' : 'content';

    const { data, error } = await supabase
      .from(table)
      .update({ content_text: newContent })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
}