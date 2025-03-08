import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const PLAN_TOKENS = {
  'price_1QfUdRAPsY1QdyG2KTIGje7u': { type: 'starter', tokens: 35000 },
  'price_1QfUeRAPsY1QdyG2LMNOkj8p': { type: 'premium', tokens: 55000 },
  'price_1QfUfRAPsY1QdyG2PQRStuv3': { type: 'elite', tokens: 90000 }
}

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Get the signature from the headers
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('No signature', { status: 400 })
    }

    // Get the raw body
    const body = await req.text()

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
      )
    } catch (err) {
      console.error(`⚠️ Webhook signature verification failed.`, err.message)
      return new Response(`Webhook Error: ${err.message}`, { status: 400 })
    }

    const { type, data } = event

    switch (type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = data.object
        const priceId = subscription.items.data[0].price.id
        const customerId = subscription.customer
        const subscriptionId = subscription.id

        if (!PLAN_TOKENS[priceId]) {
          throw new Error(`Invalid price ID: ${priceId}`)
        }

        const { data: user, error: userError } = await supabaseClient
          .from('auth.users')
          .select('id')
          .eq('raw_app_meta_data->stripe_customer_id', customerId)
          .single()

        if (userError) throw userError

        const planData = {
          plan_type: PLAN_TOKENS[priceId].type,
          total_tokens: PLAN_TOKENS[priceId].tokens,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          subscription_status: subscription.status,
          billing_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          billing_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        }

        const { error: upsertError } = await supabaseClient
          .from('user_plans')
          .upsert({
            user_id: user.id,
            ...planData,
            used_tokens: 0
          })

        if (upsertError) throw upsertError
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = data.object
        const customerId = subscription.customer

        const { data: user } = await supabaseClient
          .from('auth.users')
          .select('id')
          .eq('raw_app_meta_data->stripe_customer_id', customerId)
          .single()

        if (user) {
          const { error: updateError } = await supabaseClient
            .from('user_plans')
            .update({
              subscription_status: 'cancelled',
              plan_type: 'starter',
              total_tokens: 35000
            })
            .eq('user_id', user.id)

          if (updateError) throw updateError
        }
        break
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    })
  }
})