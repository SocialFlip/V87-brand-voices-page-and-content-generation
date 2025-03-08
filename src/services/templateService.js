import { supabase } from '../lib/supabase';
import { trackTokenUsage } from './tokenService';

const WEBHOOK_ENDPOINTS = {
  'LinkedIn': 'https://hook.us2.make.com/qbw4terbfr3c5ldxj6mx6wiowhe2swey',
  'Twitter Post': 'https://hook.us2.make.com/yc3p3sdlnjyi0y16va8irq582vovnkr2',
  'Instagram': 'https://hook.us2.make.com/9qfws415yowawvp4i55lwervug5ytdv1'
};

async function analyzeTemplateStructure(content, platform) {
  try {
    const endpoint = WEBHOOK_ENDPOINTS[platform];
    if (!endpoint) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze template structure');
    }

    const data = await response.text();
    return typeof data === 'string' ? data : JSON.parse(data).content;
  } catch (error) {
    console.error('Template analysis error:', error);
    throw new Error('Failed to analyze template. Please try again.');
  }
}

export async function getTemplates() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('templates')
      .select(`
        *,
        platform:platform_id (
          name,
          icon_name,
          color
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    throw error;
  }
}

export async function createTemplate(content, platformName) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Track token usage before template creation
    await trackTokenUsage('template', content);

    // Get platform ID
    const { data: platform } = await supabase
      .from('content_platforms')
      .select('id')
      .eq('name', platformName)
      .single();

    if (!platform) throw new Error(`Platform not found: ${platformName}`);

    // Analyze template structure
    const analyzedContent = await analyzeTemplateStructure(content, platformName);

    // Check template count for platform
    const { count } = await supabase
      .from('templates')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('platform_id', platform.id);

    if (count >= 25) {
      throw new Error(`Template limit reached for ${platformName}. Please delete an existing template first.`);
    }

    const { data, error } = await supabase
      .from('templates')
      .insert([{
        content_text: analyzedContent,
        platform_id: platform.id,
        user_id: user.id
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
    console.error('Error creating template:', error);
    throw error;
  }
}

export async function updateTemplate(id, content) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('templates')
      .update({ content_text: content })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating template:', error);
    throw error;
  }
}

export async function deleteTemplate(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
}

export async function getTemplateCountByPlatform(platformName) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: platform } = await supabase
      .from('content_platforms')
      .select('id')
      .eq('name', platformName)
      .single();

    if (!platform) throw new Error(`Platform not found: ${platformName}`);

    const { count, error } = await supabase
      .from('templates')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('platform_id', platform.id);

    if (error) throw error;
    return count;
  } catch (error) {
    console.error('Error getting template count:', error);
    throw error;
  }
}