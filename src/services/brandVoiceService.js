import { supabase } from '../lib/supabase';

export async function getBrandVoice() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('brand_voice')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      // Handle "no rows" case gracefully
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting brand voice:', error);
    throw error;
  }
}

export async function saveBrandVoice(brandVoiceData, guideContent = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Initialize default values for nested objects
    const saveData = {
      company_name: brandVoiceData.companyName || '',
      positioning: brandVoiceData.positioning || '',
      tone_of_voice: brandVoiceData.toneOfVoice || '',
      industry_keywords: brandVoiceData.industryKeywords || '',
      target_audience: brandVoiceData.targetAudience || '',
      brand_values: brandVoiceData.brandValues || '',
      avoid_language: brandVoiceData.avoidLanguage || '',
      writing_style: brandVoiceData.writingStyle || '',
      content_examples: brandVoiceData.contentExamples || '',
      guide_content: guideContent || {},
      user_id: user.id
    };

    const { data: existing } = await supabase
      .from('brand_voice')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from('brand_voice')
        .update(saveData)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('brand_voice')
        .insert([saveData])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error saving brand voice:', error);
    throw error;
  }
}

export async function hasBrandVoice() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('brand_voice')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return false;
      }
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking brand voice:', error);
    return false;
  }
}