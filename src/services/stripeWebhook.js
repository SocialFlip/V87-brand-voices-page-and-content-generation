import { supabase } from '../lib/supabase';

const PLAN_TOKENS = {
  starter: 35000,
  premium: 55000,
  elite: 90000
};

const PLAN_MAPPING = {
  'price_1QfUdRAPsY1QdyG2KTIGje7u': 'starter',
  'price_1QfUeRAPsY1QdyG2LMNOkj8p': 'premium',
  'price_1QfUfRAPsY1QdyG2PQRStuv3': 'elite'
};

export async function handleStripeWebhook(event) {
  try {
    const { type, data } = event;

    switch (type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = data.object;
        const priceId = subscription.items.data[0].price.id;
        const planType = PLAN_MAPPING[priceId];
        const customerId = subscription.customer;
        const subscriptionId = subscription.id;

        // Get user by Stripe customer ID
        const { data: user, error: userError } = await supabase
          .from('auth.users')
          .select('id')
          .eq('raw_app_meta_data->stripe_customer_id', customerId)
          .single();

        if (userError) throw userError;

        // Check if user plan exists
        const { data: existingPlan } = await supabase
          .from('user_plans')
          .select('id')
          .eq('user_id', user.id)
          .single();

        const planData = {
          plan_type: planType,
          total_tokens: PLAN_TOKENS[planType],
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_status: subscription.status,
          billing_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          billing_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        };

        if (existingPlan) {
          // Update existing plan
          const { error: updateError } = await supabase
            .from('user_plans')
            .update(planData)
            .eq('user_id', user.id);

          if (updateError) throw updateError;
        } else {
          // Create new plan
          const { error: insertError } = await supabase
            .from('user_plans')
            .insert([{
              user_id: user.id,
              used_tokens: 0,
              ...planData
            }]);

          if (insertError) throw insertError;
        }
        break;

      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        const cancelledSubscription = data.object;
        const { data: cancelledUser } = await supabase
          .from('auth.users')
          .select('id')
          .eq('raw_app_meta_data->stripe_customer_id', cancelledSubscription.customer)
          .single();

        if (cancelledUser) {
          const { error: cancelError } = await supabase
            .from('user_plans')
            .update({
              subscription_status: 'cancelled',
              plan_type: 'starter',
              total_tokens: PLAN_TOKENS.starter
            })
            .eq('user_id', cancelledUser.id);

          if (cancelError) throw cancelError;
        }
        break;
    }

    return { success: true };
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    throw error;
  }
}