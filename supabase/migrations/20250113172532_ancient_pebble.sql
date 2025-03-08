-- First, drop the existing view
DROP VIEW IF EXISTS admin_user_view;

-- Recreate the view without trying to add a policy directly to it
CREATE OR REPLACE VIEW admin_user_view AS
SELECT 
  au.id as user_id,
  au.email,
  au.created_at as joined_at,
  COALESCE(up.plan_type, 'starter') as plan_type,
  COALESCE(up.total_tokens, 35000) as total_tokens,
  COALESCE(up.used_tokens, 0) as used_tokens,
  COALESCE(up.billing_period_start, au.created_at) as billing_period_start,
  COALESCE(up.billing_period_end, au.created_at + interval '1 month') as billing_period_end,
  up.stripe_customer_id,
  up.stripe_subscription_id,
  COALESCE(up.subscription_status, 'active') as subscription_status
FROM auth.users au
LEFT JOIN user_plans up ON au.id = up.user_id
WHERE au.email != 'businessai360@gmail.com';

-- Grant access to authenticated users
GRANT SELECT ON admin_user_view TO authenticated;

-- Create a secure function to check admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT email = 'businessai360@gmail.com'
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a secure policy on the auth.users table for admin access
CREATE POLICY "Admin can view all users"
  ON auth.users
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Create a secure policy on user_plans for admin access
CREATE POLICY "Admin can manage user plans"
  ON user_plans
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());