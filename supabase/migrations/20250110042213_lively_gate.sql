/*
  # Add Stripe Integration Fields

  1. Changes
    - Add Stripe fields to user_plans table
    - Add subscription status field
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add Stripe fields to user_plans table
ALTER TABLE user_plans
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active';

-- Create index for Stripe fields
CREATE INDEX IF NOT EXISTS idx_user_plans_stripe_customer ON user_plans(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_stripe_subscription ON user_plans(stripe_subscription_id);