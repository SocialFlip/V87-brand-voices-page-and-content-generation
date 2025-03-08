-- Drop the existing view
DROP VIEW IF EXISTS admin_user_view;

-- Create admin view with specific column selection
CREATE OR REPLACE VIEW admin_user_view AS
SELECT 
  up.user_id,
  up.plan_type,
  up.total_tokens,
  up.used_tokens,
  up.billing_period_start,
  up.billing_period_end,
  up.stripe_customer_id,
  up.stripe_subscription_id,
  up.subscription_status,
  u.email,
  u.created_at as joined_at
FROM user_plans up
JOIN auth.users u ON u.id = up.user_id;

-- Grant access to the view
GRANT SELECT ON admin_user_view TO authenticated;