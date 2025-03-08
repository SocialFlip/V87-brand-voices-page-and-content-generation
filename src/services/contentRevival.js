import { supabase } from '../lib/supabase';
import { trackTokenUsage } from './tokenService';

// Basic webhook endpoints
const BASIC_REVIVAL_ENDPOINTS = {
  blog: {
    'LinkedIn': 'https://hook.us2.make.com/7lmwb7qus8qwguntmwjsqoy4ilk2rrq2',
    'Twitter Post': 'https://hook.us2.make.com/c8jk3g3k58s21newgd6vjbkzmaqd1s2l',
    'Twitter Thread': 'https://hook.us2.make.com/89ih35vmjv74debmqisofqadvckvwfdo',
    'Instagram': 'https://hook.us2.make.com/r19n2yowfvbki8gpv4ewe3x1vynf1l3o',
    'Carousel': 'https://hook.us2.make.com/477e1uef4mzdfl1umo8kr6eu8jvodfq3',
    'Story Breakdown': 'https://hook.us2.make.com/y12im85n4qiwxigzrpmsxldgh05ekl5i',
    'Mini-Guide': 'https://hook.us2.make.com/gdqumkielfxhxmfuy0dyag5qc39laaet'
  },
  industry: {
    'LinkedIn': 'https://hook.us2.make.com/qd7w951wdwnljbm6rtwffei6yt93huk3',
    'Twitter Post': 'https://hook.us2.make.com/qyddrs4x484mzh4kgfp2m94pfuofcox1',
    'Twitter Thread': 'https://hook.us2.make.com/q1u7b0esd1fwthmmxrlhvrpovcrqmd9h',
    'Instagram': 'https://hook.us2.make.com/0vqrqrsdjt9v4sim7tm1y2clwhq4rxlo',
    'Carousel': 'https://hook.us2.make.com/nk85t0nsk65jo8p3hb6vsbpc3frnt6mx',
    'Story Breakdown': 'https://hook.us2.make.com/9ma21guwol1hiba5nm4iujpvghvxtg35',
    'Mini-Guide': 'https://hook.us2.make.com/wnkapn8vobq1xfz057kddiwaoblxwgvg'
  },
  video: {
    'LinkedIn': 'https://hook.us2.make.com/wvlx19gbad7v8hqlagcr85fmx9jm1g4t',
    'Twitter Post': 'https://hook.us2.make.com/jrg1ggv6pc7z1605g19eunovlamxt5sr',
    'Twitter Thread': 'https://hook.us2.make.com/lgja32tbcy9tbqcv903lu9gcegkgw462',
    'Instagram': 'https://hook.us2.make.com/vyiqhsionjw4pl2dh1cyf97dsnvrme8b',
    'Carousel': 'https://hook.us2.make.com/57b470gwv3g5sd7y4mou5qgc36rrmq0l',
    'Story Breakdown': 'https://hook.us2.make.com/gcjl252p2q8yci3kmuxg5guard1yw4pb',
    'Mini-Guide': 'https://hook.us2.make.com/qh09hngu1hbccwcb4q57ob7534m613do'
  },
  yturl: {
    'LinkedIn': 'https://hook.us2.make.com/vfebxnkpnhvxhg3ixdoblxyco8o16xnj',
    'Twitter Post': 'https://hook.us2.make.com/ci3a8d4bwro7yjz5e8yxivom5ujw9kdo',
    'Twitter Thread': 'https://hook.us2.make.com/ifn3qu8f7b5ysaeu6kis9qljv28pv36j',
    'Instagram': 'https://hook.us2.make.com/k1tbishe652jf4j3241jqyyqsbvvpyam',
    'Carousel': 'https://hook.us2.make.com/07jdclj06lo02yqy62mhf56nzummuk8h',
    'Story Breakdown': 'https://hook.us2.make.com/lwzriavru4sblt43ddj5yrhx6e8gsxg3',
    'Mini-Guide': 'https://hook.us2.make.com/kjp2iakncyotal5g7sodhfhep34h1val'
  },
  image: {
    'LinkedIn': 'https://hook.us2.make.com/6rdkkzaznnb4nw41vhh1kuqw7gy6kjy7',
    'Twitter Post': 'https://hook.us2.make.com/p35cupqkk5unf5uyu4t18ny8mayw9x8b',
    'Twitter Thread': 'https://hook.us2.make.com/h2oplbgf56lhrd92dyj6f9fgjfwcdhou',
    'Instagram': 'https://hook.us2.make.com/cqxhro9k7unplhb5lq59jhbhjrwrrm8n',
    'Carousel': 'https://hook.us2.make.com/i2uxrf278mdrn2iwsiz2wogbbebm6yjp',
    'Story Breakdown': 'https://hook.us2.make.com/ekk65ali56mpsm9oc7l7o9uz7s9cift8',
    'Mini-Guide': 'https://hook.us2.make.com/225si4pphwue6kxcue10pfmkfi2bexfl'
  }
};

// Enhanced webhook endpoints
const ENHANCED_REVIVAL_ENDPOINTS = {
  blog: {
    'LinkedIn': 'https://hook.us2.make.com/tea4qllsfa46x85zxzvl3vqrewl8chum',
    'Twitter Post': 'https://hook.us2.make.com/qh56802cm94jkvc6n4naaj8ad4f1uet1',
    'Twitter Thread': 'https://hook.us2.make.com/86sger261hpfd2q0zxavy1msd4sbil6k',
    'Instagram': 'https://hook.us2.make.com/pgdo3s6r9lvoqjiil9ns14h9f8ya3ble',
    'Carousel': 'https://hook.us2.make.com/ff7lwxwrb7zggvwmoh44qvsqlhjdjugc',
    'Story Breakdown': 'https://hook.us2.make.com/hlpwm81drwo7ur9ek0n2g8ajv4xyoe3i',
    'Mini-Guide': 'https://hook.us2.make.com/hixh1iwjmgdd1r5gwrawnb7e35nvqp27'
  },
  industry: {
    'LinkedIn': 'https://hook.us2.make.com/industry-linkedin-enhanced',
    'Twitter Post': 'https://hook.us2.make.com/industry-twitter-post-enhanced',
    'Twitter Thread': 'https://hook.us2.make.com/industry-twitter-thread-enhanced',
    'Instagram': 'https://hook.us2.make.com/industry-instagram-enhanced',
    'Carousel': 'https://hook.us2.make.com/industry-carousel-enhanced',
    'Story Breakdown': 'https://hook.us2.make.com/industry-story-enhanced',
    'Mini-Guide': 'https://hook.us2.make.com/industry-guide-enhanced'
  },
  video: {
    'LinkedIn': 'https://hook.us2.make.com/mct55v3ssy3d287uki90ljtou6w29u97',
    'Twitter Post': 'https://hook.us2.make.com/x6vpgoa6x4xxbrj15optarlgbfifwltw',
    'Twitter Thread': 'https://hook.us2.make.com/fs6selv67fjooerkl190j98njea56kub',
    'Instagram': 'https://hook.us2.make.com/hs07v4btjrkgwnlu9oj802t26fft4p18',
    'Carousel': 'https://hook.us2.make.com/u9shkjq9x08zqtei4sx7g6jfphjxqpfc',
    'Story Breakdown': 'https://hook.us2.make.com/x2kebjtta2giwhkipu5o2jooyteihjwb',
    'Mini-Guide': 'https://hook.us2.make.com/fe42ssxnfot7ppne5akkrj7mh313pegl'
  },
  yturl: {
    'LinkedIn': 'https://hook.us2.make.com/nppe9ffpafzbjw8acmx1mzrocndy2mtp',
    'Twitter Post': 'https://hook.us2.make.com/w4b7q5krgprwr9sih9anx2u582gbm47q',
    'Twitter Thread': 'https://hook.us2.make.com/zwrcf0vep7w3y6phnxtmktkb4oy4ifes',
    'Instagram': 'https://hook.us2.make.com/nktu6osj9hjbz68w7mdrhh0yp66rft50',
    'Carousel': 'https://hook.us2.make.com/js9t61nugg96q1tyitmwt4nb6rfsfrcv',
    'Story Breakdown': 'https://hook.us2.make.com/cuv9i17yyp0dl523xjgyatgoin1crvxx',
    'Mini-Guide': 'https://hook.us2.make.com/rv8yk9j1w13ddnnexiyymyah8ro7aph1'
  },
  image: {
    'LinkedIn': 'https://hook.us2.make.com/68v4kmqai7k2j4ivxxl79v24oin5rwcd',
    'Twitter Post': 'https://hook.us2.make.com/pwt7qurl560y3wwwg0jyd2ew4r3wr0fi',
    'Twitter Thread': 'https://hook.us2.make.com/q80t7tvsos54pujgwbhdo52j64wcvmxt',
    'Instagram': 'https://hook.us2.make.com/hq933vh5syfa35m5413wuv7stu4i3pqp',
    'Carousel': 'https://hook.us2.make.com/bp8m1j9eastax9h5y6fr15uarpp3rdy4',
    'Story Breakdown': 'https://hook.us2.make.com/6f39y1k9e6peiz798u7j0bm8iat8hh0k',
    'Mini-Guide': 'https://hook.us2.make.com/ouivde9iemfbhw7mcrj3gw6v3yrca3ly'
  }
};

export async function reviveContent({ type, url, transcript, image, platform, isEnhanced = false }) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Track token usage before revival
    const contentToTrack = url || transcript || 'image-content';
    await trackTokenUsage('revival', contentToTrack);

    // Get brand voice settings including selected sections
    const { data: brandVoice } = await supabase
      .from('brand_voice')
      .select('content_guidelines, personal_stories, emotional_vocabulary, conversational_rhythm, call_to_actions')
      .eq('user_id', user.id)
      .single();

    const endpoints = isEnhanced ? ENHANCED_REVIVAL_ENDPOINTS[type] : BASIC_REVIVAL_ENDPOINTS[type];
    if (!endpoints) {
      throw new Error(`Unsupported content type: ${type}`);
    }

    const endpoint = endpoints[platform];
    if (!endpoint) {
      throw new Error(`Unsupported platform for ${type}: ${platform}`);
    }

    let body;
    let headers = {
      'Content-Type': 'application/json'
    };

    // Get selected sections
    const selectedPEA = brandVoice?.personal_stories?.selected_story 
      ? brandVoice.personal_stories.stories.find(s => s.id === brandVoice.personal_stories.selected_story)
      : null;
    const selectedEVM = brandVoice?.emotional_vocabulary?.selected_section
      ? brandVoice.emotional_vocabulary.sections.find(s => s.id === brandVoice.emotional_vocabulary.selected_section)
      : null;
    const selectedCRS = brandVoice?.conversational_rhythm?.selected_section
      ? brandVoice.conversational_rhythm.sections.find(s => s.id === brandVoice.conversational_rhythm.selected_section)
      : null;
    const selectedCTA = brandVoice?.call_to_actions?.selected_cta
      ? brandVoice.call_to_actions.ctas.find(c => c.id === brandVoice.call_to_actions.selected_cta)
      : null;

    switch (type) {
      case 'blog':
      case 'video':
      case 'yturl':
      case 'industry':
        body = JSON.stringify({
          url: type === 'video' ? undefined : url,
          transcript: type === 'video' ? transcript : undefined,
          type: type,
          ...(isEnhanced ? {
            filter: 'content',
            pea: selectedPEA,
            evm: selectedEVM,
            crs: selectedCRS,
            cta: selectedCTA
          } : {
            filter: 'content',
            guidelines: brandVoice?.content_guidelines
          })
        });
        break;
      case 'image':
        const formData = new FormData();
        formData.append('image', image);
        formData.append('filter', 'content');

        if (isEnhanced) {
          if (selectedPEA) {
            formData.append('peaCollection[id]', selectedPEA.id);
            formData.append('peaCollection[keyStory]', selectedPEA.keyStory);
            formData.append('peaCollection[background]', selectedPEA.background);
            formData.append('peaCollection[challenges]', selectedPEA.challenges);
          }

          if (selectedEVM) {
            formData.append('evmCollection[id]', selectedEVM.id);
            formData.append('evmCollection[excited_phrasesArray]', selectedEVM.excited_phrases.join('\n'));
            formData.append('evmCollection[problem_phrasesArray]', selectedEVM.problem_phrases.join('\n'));
            formData.append('evmCollection[solution_phrasesArray]', selectedEVM.solution_phrases.join('\n'));
          }

          if (selectedCRS) {
            formData.append('crsCollection[id]', selectedCRS.id);
            formData.append('crsCollection[emoji_usage]', selectedCRS.emoji_usage);
            formData.append('crsCollection[post_length]', selectedCRS.post_length);
            formData.append('crsCollection[closing_style]', selectedCRS.closing_style);
            formData.append('crsCollection[opening_style]', selectedCRS.opening_style);
          }

          if (selectedCTA) {
            formData.append('ctaCollection[id]', selectedCTA.id);
            formData.append('ctaCollection[text]', selectedCTA.text);
            formData.append('ctaCollection[link]', selectedCTA.link);
            formData.append('ctaCollection[button_text]', selectedCTA.button_text);
          }
        } else {
          formData.append('guidelines', brandVoice?.content_guidelines || '');
        }

        body = formData;
        delete headers['Content-Type'];
        break;
      default:
        throw new Error(`Invalid content type: ${type}`);
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body
    });

    if (!response.ok) {
      throw new Error(`Revival failed: ${response.statusText}`);
    }

    const data = await response.text();
    return typeof data === 'string' ? data : JSON.parse(data).content;
  } catch (error) {
    console.error('Content revival error:', error);
    throw new Error('Failed to revive content. Please try again.');
  }
}

export async function saveRevivedContent(content, platformName, contentType, sourceUrl = '') {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get platform ID
    const { data: platform } = await supabase
      .from('content_platforms')
      .select('id')
      .eq('name', platformName)
      .single();

    if (!platform) throw new Error(`Platform not found: ${platformName}`);

    // Save the revived content
    const { data, error } = await supabase
      .from('revived_content')
      .insert([{
        content_text: content,
        platform_id: platform.id,
        user_id: user.id,
        original_url: sourceUrl,
        content_type: contentType
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('This content has already been revived and saved');
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error saving revived content:', error);
    throw error;
  }
}

export async function updateRevivedContent(id, newContent) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('revived_content')
      .update({ content_text: newContent })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating revived content:', error);
    throw error;
  }
}

export async function deleteRevivedContent(id) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('revived_content')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting revived content:', error);
    throw error;
  }
}

export async function getRevivedContents(platform) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get platform ID
    const { data: platformData } = await supabase
      .from('content_platforms')
      .select('id')
      .ilike('name', platform)
      .single();

    if (!platformData) throw new Error('Platform not found');

    const { data, error } = await supabase
      .from('revived_content')
      .select(`
        *,
        platform:platform_id (
          name,
          icon_name,
          color
        )
      `)
      .eq('user_id', user.id)
      .eq('platform_id', platformData.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(item => ({
      id: item.id,
      content: item.content_text,
      platform: item.platform.name,
      timestamp: item.created_at,
      content_type: item.content_type
    }));
  } catch (error) {
    console.error('Error getting revived contents:', error);
    throw error;
  }
}