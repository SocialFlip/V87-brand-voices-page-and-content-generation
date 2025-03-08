import { supabase } from '../lib/supabase';

const PLAN_TOKENS = {
  'starter': 35000,
  'premium': 55000,
  'elite': 90000
};

export async function handleOutsetaWebhook(event) {
  try {
    const { 
      AccountId: userId,
      PlanName: planName,
      StripeCustomerId,
      StripeSubscriptionId
    } = event;

    // Normalize plan name to lowercase
    const normalizedPlan = planName.toLowerCase();
    
    if (!PLAN_TOKENS[normalizedPlan]) {
      throw new Error(`Invalid plan: ${planName}`);
    }

    // Check if user plan exists
    const { data: existingPlan } = await supabase
      .from('user_plans')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingPlan) {
      // Update existing plan
      const { error: updateError } = await supabase
        .from('user_plans')
        .update({
          plan_type: normalizedPlan,
          total_tokens: PLAN_TOKENS[normalizedPlan],
          stripe_customer_id: StripeCustomerId,
          stripe_subscription_id: StripeSubscriptionId,
          billing_period_start: new Date(),
          billing_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;
    } else {
      // Create new plan
      const { error: insertError } = await supabase
        .from('user_plans')
        .insert([{
          user_id: userId,
          plan_type: normalizedPlan,
          total_tokens: PLAN_TOKENS[normalizedPlan],
          stripe_customer_id: StripeCustomerId,
          stripe_subscription_id: StripeSubscriptionId,
          used_tokens: 0,
          billing_period_start: new Date(),
          billing_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }]);

      if (insertError) throw insertError;
    }

    return { success: true };
  } catch (error) {
    console.error('Error handling Outseta webhook:', error);
    throw error;
  }
}