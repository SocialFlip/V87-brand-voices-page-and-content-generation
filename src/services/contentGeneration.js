import { supabase } from '../lib/supabase';
import { trackTokenUsage } from './tokenService';

const BASIC_WEBHOOK_ENDPOINTS = {
  'LinkedIn': 'https://hook.us2.make.com/i29xgcznnbst56ggqtq6q1oo0l3qnk8r',
  'Twitter Post': 'https://hook.us2.make.com/qpc8es38g0jd7psqi8wuhjxl66nfe3jv',
  'Twitter Thread': 'https://hook.us2.make.com/1ct7evbo78fatuzidq9kj7lphmohekep',
  'Instagram': 'https://hook.us2.make.com/gfg9exljs3sbcarqom4t6y04u4c8zfxv',
  'Carousel': 'https://hook.us2.make.com/47zunmhsr9lvthiv3t8r08nxkggy3xg8',
  'Story Breakdown': 'https://hook.us2.make.com/sjr8vsf8ijbrxooyu254e5blh11j9dvx',
  'Mini-Guide': 'https://hook.us2.make.com/5ytvkd7xvawoetj7zuiw9boxdwoxxl1u'
};

const ENHANCED_WEBHOOK_ENDPOINTS = {
  'LinkedIn': 'https://hook.us2.make.com/tgmu7kxag6r2d1nv4woiwh2orn2ikxs5',
  'Twitter Post': 'https://hook.us2.make.com/v08brab443trartz1xfhpp2oaxtbdn9h',
  'Twitter Thread': 'https://hook.us2.make.com/qwrgbrr2oxbhbh67wwqx5b8xf1ubea63',
  'Instagram': 'https://hook.us2.make.com/82eyfyukemywruvrulag2tnkhbfbezbv',
  'Carousel': 'https://hook.us2.make.com/rdnfoazfli3ycvmcktioto2l4qtoprn9',
  'Story Breakdown': 'https://hook.us2.make.com/ser2zagl6k4h11rct6yhwkprfaxil6qv',
  'Mini-Guide': 'https://hook.us2.make.com/nngqdjg30fawi4foyo4e5gfntwmqmb3m'
};

async function generateContent(content, platform, isEnhanced = false, brandVoice = null) {
  try {
    const endpoint = isEnhanced ? 
      ENHANCED_WEBHOOK_ENDPOINTS[platform] : 
      BASIC_WEBHOOK_ENDPOINTS[platform];

    if (!endpoint) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    // Prepare request body
    const requestBody = {
      content,
      platform: platform.toLowerCase().replace('-', ''),
      ...(brandVoice && {
        brandVoice: {
          name: brandVoice.name,
          tone: brandVoice.tone,
          style: brandVoice.style,
          description: brandVoice.description
        }
      })
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.text();
    return { content: typeof data === 'string' ? data : JSON.parse(data).content };
  } catch (error) {
    console.error('Content generation error:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
}

export async function generateAndSaveContent(content, platformName, isEnhanced = false, brandVoice = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Track token usage before generation
    await trackTokenUsage('generation', content);

    // Get platform ID
    const { data: platform } = await supabase
      .from('content_platforms')
      .select('id')
      .eq('name', platformName)
      .single();

    if (!platform) throw new Error('Platform not found');

    // Generate content
    const generatedContent = await generateContent(content, platformName, isEnhanced, brandVoice);

    // Save to generated_content table
    const { data: savedContent, error } = await supabase
      .from('generated_content')
      .insert([{
        content_text: generatedContent.content,
        platform_id: platform.id,
        user_id: user.id,
        brand_voice_id: brandVoice?.id || null
      }])
      .select(`
        *,
        platform:platform_id (
          name,
          icon_name,
          color
        ),
        brand_voice:brand_voice_id (
          name,
          tone,
          style,
          description
        )
      `)
      .single();

    if (error) throw error;
    return savedContent;
  } catch (error) {
    console.error('Generate and save error:', error);
    throw error;
  }
}

export async function updateGeneratedContent(id, newContent) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('generated_content')
      .update({ content_text: newContent })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating generated content:', error);
    throw error;
  }
}

export async function deleteGeneratedContent(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('generated_content')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting generated content:', error);
    throw error;
  }
}

export async function getGeneratedContent(platformName = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('generated_content')
      .select(`
        *,
        platform:platform_id (
          name,
          icon_name,
          color
        ),
        brand_voice:brand_voice_id (
          name,
          tone,
          style,
          description
        )
      `)
      .eq('user_id', user.id);

    if (platformName) {
      const { data: platform } = await supabase
        .from('content_platforms')
        .select('id')
        .eq('name', platformName)
        .single();

      if (platform) {
        query = query.eq('platform_id', platform.id);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting generated content:', error);
    return [];
  }
}