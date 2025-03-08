import { supabase } from '../lib/supabase';
import { normalizeContent } from './contentHelpers';

export async function checkForDuplicateContent(userId, platformId, content) {
  try {
    const normalizedContent = normalizeContent(content);
    
    const { data, error } = await supabase
      .from('content')
      .select('id')
      .eq('user_id', userId)
      .eq('platform_id', platformId)
      .eq('normalized_content', normalizedContent)
      .maybeSingle();

    if (error) throw error;
    return data !== null;
  } catch (error) {
    console.error('Error checking for duplicate content:', error);
    return false;
  }
}

export async function validateContentScheduling(content, userId, platformName) {
  try {
    if (typeof content === 'object' && content.id) {
      return { isValid: true, contentId: content.id, error: null };
    }

    const contentText = typeof content === 'object' ? content.content_text : content;

    const { data: platform } = await supabase
      .from('content_platforms')
      .select('id')
      .ilike('name', platformName)
      .single();

    if (!platform) {
      return { isValid: false, contentId: null, error: 'Platform not found' };
    }

    const { data: existingContent } = await supabase
      .from('content')
      .select('id')
      .eq('user_id', userId)
      .eq('platform_id', platform.id)
      .eq('normalized_content', normalizeContent(contentText))
      .maybeSingle();

    if (existingContent) {
      return { isValid: true, contentId: existingContent.id, error: null };
    }

    const { data: newContent, error: createError } = await supabase
      .from('content')
      .insert([{
        content_text: contentText,
        platform_id: platform.id,
        user_id: userId,
        status: 'draft',
        is_generated: true,
        normalized_content: normalizeContent(contentText)
      }])
      .select('id')
      .single();

    if (createError) {
      return { isValid: false, contentId: null, error: 'Failed to create content' };
    }

    return { isValid: true, contentId: newContent.id, error: null };
  } catch (error) {
    console.error('Content validation error:', error);
    return { isValid: false, contentId: null, error: error.message };
  }
}