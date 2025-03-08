import { supabase } from '../lib/supabase';
import { trackTokenUsage } from './tokenService';
import { IDEA_CONTENT_GENERATION_ENDPOINTS } from '../utils/webhookConfig';

export async function generateIdeasContent(idea, platformName, funnelStage) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Track token usage before generation - use ideas_content type
    await trackTokenUsage('ideas_content', idea.idea_text);

    // Get platform ID - handle Twitter Post/Thread case
    const lookupName = platformName === 'Twitter' ? 'Twitter Post' : platformName;
    
    const { data: platform } = await supabase
      .from('content_platforms')
      .select('id')
      .eq('name', lookupName)
      .single();

    if (!platform) throw new Error('Platform not found');

    // Get brand voice guidelines
    const { data: brandVoice } = await supabase
      .from('brand_voice')
      .select('content_guidelines, personal_stories, emotional_vocabulary, conversational_rhythm, call_to_actions')
      .eq('user_id', user.id)
      .single();

    // Get the appropriate webhook endpoint based on funnel stage and platform
    const endpoint = IDEA_CONTENT_GENERATION_ENDPOINTS[funnelStage]?.[platformName === 'Twitter' ? 'Twitter Post' : platformName];
    if (!endpoint) {
      throw new Error(`No endpoint found for ${platformName} at ${funnelStage} stage`);
    }

    // Generate content using webhook
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idea: idea.idea_text,
        topic: idea.topic,
        platform: platformName === 'Twitter' ? 'Twitter Post' : platformName,
        guidelines: brandVoice?.content_guidelines || '',
        funnel_stage: funnelStage,
        pea: brandVoice?.personal_stories?.selected_story 
          ? brandVoice.personal_stories.stories.find(s => s.id === brandVoice.personal_stories.selected_story)
          : null,
        evm: brandVoice?.emotional_vocabulary?.selected_section
          ? brandVoice.emotional_vocabulary.sections.find(s => s.id === brandVoice.emotional_vocabulary.selected_section)
          : null,
        crs: brandVoice?.conversational_rhythm?.selected_section
          ? brandVoice.conversational_rhythm.sections.find(s => s.id === brandVoice.conversational_rhythm.selected_section)
          : null,
        cta: brandVoice?.call_to_actions?.selected_cta
          ? brandVoice.call_to_actions.ctas.find(c => c.id === brandVoice.call_to_actions.selected_cta)
          : null
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate content from idea');
    }

    const generatedContent = await response.text();
    const contentText = typeof generatedContent === 'string' ? 
      generatedContent : 
      JSON.parse(generatedContent).content;

    // Save to ideas_content table
    const { data, error } = await supabase
      .from('ideas_content')
      .insert([{
        content_text: contentText,
        platform_id: platform.id,
        user_id: user.id,
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
    return data;
  } catch (error) {
    console.error('Error generating ideas content:', error);
    throw error;
  }
}

export async function getIdeasContent(platformName = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let query = supabase
      .from('ideas_content')
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
      
      const { data: platform } = await supabase
        .from('content_platforms')
        .select('id')
        .eq('name', lookupName)
        .single();

      if (platform) {
        query = query.eq('platform_id', platform.id);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting ideas content:', error);
    throw error;
  }
}

export async function updateIdeasContent(id, newContent) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('ideas_content')
      .update({ content_text: newContent })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating ideas content:', error);
    throw error;
  }
}

export async function deleteIdeasContent(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('ideas_content')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting ideas content:', error);
    throw error;
  }
}