import { supabase } from '../lib/supabase';

export async function scheduleContent({ content, scheduledAt, platform = 'LinkedIn' }) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get platform ID
    const { data: platformData } = await supabase
      .from('content_platforms')
      .select('id')
      .ilike('name', platform)
      .single();

    if (!platformData) throw new Error('Platform not found');

    // Create or get content ID
    let contentId;
    const contentText = content.content_text || content;

    // If content already has an ID, use it
    if (content.id) {
      contentId = content.id;
    } else {
      // Create new content
      const { data: newContent, error: contentError } = await supabase
        .from('content')
        .insert([{
          content_text: contentText,
          platform_id: platformData.id,
          user_id: user.id,
          status: 'draft',
          is_generated: true
        }])
        .select('id')
        .single();

      if (contentError) throw contentError;
      contentId = newContent.id;
    }

    // Check for scheduling conflicts
    const { data: existingSchedule } = await supabase
      .from('scheduled_content')
      .select('id')
      .eq('user_id', user.id)
      .eq('scheduled_at', scheduledAt)
      .maybeSingle();

    if (existingSchedule) {
      throw new Error('Another event is already scheduled for this time');
    }

    // Schedule the content
    const { data, error: scheduleError } = await supabase
      .from('scheduled_content')
      .insert([{
        content_id: contentId,
        user_id: user.id,
        scheduled_at: scheduledAt,
        platform_status: 'pending'
      }])
      .select(`
        *,
        content:content_id (
          id,
          content_text,
          platform:platform_id (
            name,
            icon_name,
            color
          )
        )
      `)
      .single();

    if (scheduleError) throw scheduleError;
    return data;
  } catch (error) {
    console.error('Error scheduling content:', error);
    throw error;
  }
}

export async function getScheduledContent() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('scheduled_content')
      .select(`
        *,
        content:content_id (
          id,
          content_text,
          platform:platform_id (
            name,
            icon_name,
            color
          )
        )
      `)
      .eq('user_id', user.id)
      .order('scheduled_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting scheduled content:', error);
    throw error;
  }
}

export async function updateScheduledContent(id, scheduledAt) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Check for scheduling conflicts
    const { data: existingSchedule } = await supabase
      .from('scheduled_content')
      .select('id')
      .eq('user_id', user.id)
      .eq('scheduled_at', scheduledAt)
      .neq('id', id)
      .maybeSingle();

    if (existingSchedule) {
      throw new Error('Another event is already scheduled for this time');
    }

    const { error } = await supabase
      .from('scheduled_content')
      .update({ scheduled_at: scheduledAt })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating scheduled content:', error);
    throw error;
  }
}

export async function deleteScheduledContent(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('scheduled_content')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting scheduled content:', error);
    throw error;
  }
}