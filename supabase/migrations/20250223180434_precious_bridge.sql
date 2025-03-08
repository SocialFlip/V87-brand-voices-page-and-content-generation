-- Drop existing policies on user_plans
DROP POLICY IF EXISTS "Users can view their own plan" ON user_plans;
DROP POLICY IF EXISTS "Admin can manage user plans" ON user_plans;
DROP POLICY IF EXISTS "Admin has full access" ON user_plans;

-- Create new RLS policies for user_plans
CREATE POLICY "Users can manage their own plan"
  ON user_plans
  USING (auth.uid() = user_id OR (SELECT email FROM auth.users WHERE id = auth.uid()) = 'businessai360@gmail.com')
  WITH CHECK (auth.uid() = user_id OR (SELECT email FROM auth.users WHERE id = auth.uid()) = 'businessai360@gmail.com');

-- Create function to handle user plan creation/update
CREATE OR REPLACE FUNCTION handle_user_plan()
RETURNS trigger AS $$
BEGIN
  -- Skip for admin
  IF NEW.email = 'businessai360@gmail.com' THEN
    INSERT INTO user_plans (
      user_id,
      plan_type,
      total_tokens,
      used_tokens,
      billing_period_start,
      billing_period_end
    ) VALUES (
      NEW.id,
      'elite',
      999999999,
      0,
      NOW(),
      NOW() + interval '1 month'
    );
    RETURN NEW;
  END IF;

  -- For regular users
  INSERT INTO user_plans (
    user_id,
    plan_type,
    total_tokens,
    used_tokens,
    billing_period_start,
    billing_period_end
  ) VALUES (
    NEW.id,
    'starter',
    35000,
    0,
    NOW(),
    NOW() + interval '1 month'
  );
  
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- Plan already exists, ignore
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create new trigger for user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_user_plan();

-- Function to increment used tokens
CREATE OR REPLACE FUNCTION increment_used_tokens(
  user_id_param uuid,
  tokens_to_add integer
)
RETURNS void AS $$
DECLARE
  plan_record record;
BEGIN
  -- Skip token tracking for admin
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id_param 
    AND email = 'businessai360@gmail.com'
  ) THEN
    RETURN;
  END IF;

  -- Get or create user plan
  SELECT * INTO plan_record
  FROM user_plans
  WHERE user_id = user_id_param
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO user_plans (
      user_id,
      plan_type,
      total_tokens,
      used_tokens,
      billing_period_start,
      billing_period_end
    ) VALUES (
      user_id_param,
      'starter',
      35000,
      tokens_to_add,
      NOW(),
      NOW() + interval '1 month'
    )
    RETURNING * INTO plan_record;
  ELSE
    -- Check if we have enough tokens
    IF (plan_record.total_tokens - plan_record.used_tokens) < tokens_to_add THEN
      RAISE EXCEPTION 'Insufficient tokens available';
    END IF;

    -- Update token usage
    UPDATE user_plans
    SET used_tokens = used_tokens + tokens_to_add
    WHERE user_id = user_id_param;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_used_tokens TO authenticated;