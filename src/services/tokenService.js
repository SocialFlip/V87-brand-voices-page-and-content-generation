import { supabase } from '../lib/supabase';

// Token costs for different operations
const TOKEN_COSTS = {
  template: {
    base: 100,
    perWord: 0.2
  },
  hook: {
    base: 75,
    perWord: 0.15
  },
  hook_content: {
    base: 150,
    perWord: 0.25
  },
  generation: {
    base: 150,
    perWord: 0.25
  },
  revival: {
    base: 200,
    perWord: 0.3
  },
  idea: {
    base: 125,
    perWord: 0.2
  },
  ideas_content: {
    base: 150,
    perWord: 0.25
  }
};

// Calculate tokens for content
function calculateTokens(content, operation) {
  if (!content) return 0;
  const wordCount = content.trim().split(/\s+/).length;
  const { base, perWord } = TOKEN_COSTS[operation];
  return Math.ceil(base + (wordCount * perWord));
}

// Track token usage
export async function trackTokenUsage(operation, content, contentId = null) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;
    
    // Admin bypass - don't track usage
    if (user.email === 'businessai360@gmail.com') {
      return 0;
    }

    const tokensUsed = calculateTokens(content, operation);

    // Get user's current plan
    const { data: userPlan, error: planError } = await supabase
      .from('user_plans')
      .select('total_tokens, used_tokens')
      .eq('user_id', user.id)
      .single();

    if (planError) {
      throw planError;
    }

    // Check if user has enough tokens
    const remainingTokens = userPlan.total_tokens - userPlan.used_tokens;
    if (remainingTokens < tokensUsed) {
      throw new Error('Insufficient tokens available');
    }

    // Insert token usage record
    const { error: usageError } = await supabase
      .from('token_usage')
      .insert({
        user_id: user.id,
        action_type: operation,
        tokens_used: tokensUsed,
        content_id: contentId
      });

    if (usageError) {
      throw usageError;
    }

    // Update user's total used tokens
    const { error: updateError } = await supabase.rpc('increment_used_tokens', {
      user_id_param: user.id,
      tokens_to_add: tokensUsed
    });

    if (updateError) {
      throw updateError;
    }

    return tokensUsed;
  } catch (error) {
    console.error('Error tracking token usage:', error);
    throw error;
  }
}

// Get token usage history with filters
export async function getTokenUsageHistory(dateRange = 'all', contentType = 'all') {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('token_usage')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let daysAgo;
      switch (dateRange) {
        case '7days':
          daysAgo = 7;
          break;
        case '30days':
          daysAgo = 30;
          break;
        case '90days':
          daysAgo = 90;
          break;
        default:
          daysAgo = 0;
      }
      if (daysAgo > 0) {
        const startDate = new Date(now.setDate(now.getDate() - daysAgo)).toISOString();
        query = query.gte('created_at', startDate);
      }
    }

    // Apply content type filter
    if (contentType !== 'all') {
      query = query.eq('action_type', contentType);
    }

    const { data, error } = await query;
    if (error) {
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Error getting token usage history:', error);
    throw error;
  }
}

// Get user's token information
export async function getUserTokenInfo() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Admin bypass
    if (user.email === 'businessai360@gmail.com') {
      return null;
    }

    const { data: userPlan, error } = await supabase
      .from('user_plans')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      throw error;
    }

    // Check if billing period has ended and reset tokens if needed
    if (userPlan && new Date(userPlan.billing_period_end) < new Date()) {
      const { data: updatedPlan, error: updateError } = await supabase
        .from('user_plans')
        .update({
          used_tokens: 0,
          billing_period_start: new Date().toISOString(),
          billing_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }
      return updatedPlan;
    }

    // Get current token usage from RPC function
    const { data: currentUsage, error: usageError } = await supabase.rpc('calculate_current_period_usage', {
      user_id_param: user.id
    });

    if (usageError) {
      throw usageError;
    }

    // Return plan with current usage
    return {
      ...userPlan,
      used_tokens: currentUsage || 0
    };
  } catch (error) {
    console.error('Error getting token info:', error);
    throw error;
  }
}