import { supabase } from '../lib/supabase';

export async function getBrandVoiceProfiles() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('brand_voice_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting brand voice profiles:', error);
    throw error;
  }
}

export async function createBrandVoiceProfile(profile) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('brand_voice_profiles')
      .insert([{
        user_id: user.id,
        name: profile.name,
        tone: profile.tone,
        style: profile.style,
        description: profile.description
      }])
      .select()
      .single();

    if (error) {
      if (error.message.includes('unique_user_voice_name')) {
        throw new Error('A brand voice with this name already exists');
      }
      if (error.message.includes('Maximum limit')) {
        throw new Error('Maximum limit of 5 brand voice profiles reached');
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating brand voice profile:', error);
    throw error;
  }
}

export async function updateBrandVoiceProfile(id, profile) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('brand_voice_profiles')
      .update({
        name: profile.name,
        tone: profile.tone,
        style: profile.style,
        description: profile.description
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      if (error.message.includes('unique_user_voice_name')) {
        throw new Error('A brand voice with this name already exists');
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating brand voice profile:', error);
    throw error;
  }
}

export async function deleteBrandVoiceProfile(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('brand_voice_profiles')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting brand voice profile:', error);
    throw error;
  }
}