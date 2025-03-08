-- Add Stripe fields to user_plans if they don't exist
ALTER TABLE user_plans
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS stripe_subscription_id text,
ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'active';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_plans_stripe_customer ON user_plans(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_plans_stripe_subscription ON user_plans(stripe_subscription_id);

-- Create Stripe webhook handler function
CREATE OR REPLACE FUNCTION handle_stripe_webhook()
RETURNS trigger AS $$
BEGIN
  -- Update user plan based on Stripe event
  UPDATE user_plans
  SET 
    plan_type = NEW.plan_type,
    total_tokens = CASE 
      WHEN NEW.plan_type = 'starter' THEN 35000
      WHEN NEW.plan_type = 'premium' THEN 55000
      WHEN NEW.plan_type = 'elite' THEN 90000
    END,
    subscription_status = NEW.subscription_status
  WHERE stripe_customer_id = NEW.stripe_customer_id;
  
  RETURN NEW;
END;
$$ language plpgsql security definer;