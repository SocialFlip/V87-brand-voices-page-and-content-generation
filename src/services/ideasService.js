import { supabase } from '../lib/supabase';
import { trackTokenUsage } from './tokenService';
import { CONTENT_IDEAS_ENDPOINTS } from '../utils/webhookConfig';

export async function getIdeas(platformName = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('content_ideas')
      .select(`
        *,
        platform:platform_id (
          name,
          icon_name,
          color
        )
      `)
      .eq('user_id', user.id);

    if (platformName) {
      // Handle Twitter Post/Thread case
      const lookupName = platformName === 'Twitter' ? 'Twitter Post' : platformName;
      
      try {
        const { data: platform } = await supabase
          .from('content_platforms')
          .select('id')
          .eq('name', lookupName)
          .single();

        if (platform) {
          query = query.eq('platform_id', platform.id);
        }
      } catch (err) {
        console.error('Error looking up platform:', err);
        // Continue with query without platform filter if lookup fails
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching ideas:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error getting ideas:', error);
    return []; // Return empty array instead of throwing
  }
}

export async function getIdeasCount(platformName) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    // Handle Twitter Post/Thread case
    const lookupName = platformName === 'Twitter' ? 'Twitter Post' : platformName;

    try {
      // First get the platform ID
      const { data: platform } = await supabase
        .from('content_platforms')
        .select('id')
        .eq('name', lookupName)
        .single();

      if (!platform) {
        console.error('Platform not found:', platformName);
        return 0;
      }

      // Then get the count of ideas for this platform
      const { count, error: countError } = await supabase
        .from('content_ideas')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('platform_id', platform.id);

      if (countError) {
        console.error('Error getting count:', countError);
        return 0;
      }

      return count || 0;
    } catch (err) {
      // Log error but don't throw - return 0 as a safe default
      console.error('Error getting platform count:', err);
      return 0;
    }
  } catch (error) {
    // Log error but don't throw - return 0 as a safe default
    console.error('Error getting ideas count:', error);
    return 0;
  }
}

export async function createIdea(topic, platformName, funnelStage) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Validate funnel stage
    if (!funnelStage || !['TOFU', 'MOFU', 'BOFU'].includes(funnelStage)) {
      throw new Error('Invalid funnel stage. Must be TOFU, MOFU, or BOFU');
    }

    // Handle Twitter Post/Thread case
    const lookupName = platformName === 'Twitter' ? 'Twitter Post' : platformName;

    // Get platform ID
    const { data: platform, error: platformError } = await supabase
      .from('content_platforms')
      .select('id')
      .eq('name', lookupName)
      .single();

    if (platformError || !platform) {
      throw new Error(`Platform not found: ${platformName}`);
    }

    // Get the appropriate webhook endpoint
    const endpoint = CONTENT_IDEAS_ENDPOINTS[funnelStage]?.[platformName];
    if (!endpoint) {
      throw new Error(`No endpoint found for ${platformName} at ${funnelStage} stage`);
    }

    // Track token usage
    await trackTokenUsage('idea', topic);

    // Generate idea using webhook
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        topic,
        funnel_stage: funnelStage,
        platform: platformName
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate idea');
    }

    const generatedIdea = await response.text();
    const ideaText = typeof generatedIdea === 'string' ? 
      generatedIdea : 
      JSON.parse(generatedIdea).content;

    // Save to database with retry logic
    let retries = 3;
    let savedIdea = null;
    
    while (retries > 0 && !savedIdea) {
      try {
        const { data, error } = await supabase
          .from('content_ideas')
          .insert([{
            user_id: user.id,
            platform_id: platform.id,
            topic,
            idea_text: ideaText,
            funnel_stage: funnelStage
          }])
          .select(`
            *,
            platform:platform_id (
              name,
              icon_name,
              color
            )
          `)
          .single();

        if (error) throw error;
        savedIdea = data;
      } catch (err) {
        retries--;
        if (retries === 0) throw err;
        // Wait a short time before retrying
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return savedIdea;
  } catch (error) {
    console.error('Error creating idea:', error);
    throw error;
  }
}

export async function updateIdea(id, newText) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('content_ideas')
      .update({ idea_text: newText })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating idea:', error);
    throw error;
  }
}

export async function deleteIdea(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('content_ideas')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting idea:', error);
    throw error;
  }
}