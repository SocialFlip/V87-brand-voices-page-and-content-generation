-- Function to calculate token usage for current billing period
CREATE OR REPLACE FUNCTION calculate_current_period_usage(user_id_param uuid)
RETURNS integer AS $$
DECLARE
  period_start timestamptz;
  period_end timestamptz;
  total_used integer;
BEGIN
  -- Skip token tracking for admin
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id_param 
    AND email = 'businessai360@gmail.com'
  ) THEN
    RETURN 0;
  END IF;

  -- Get current billing period
  SELECT billing_period_start, billing_period_end 
  INTO period_start, period_end
  FROM user_plans
  WHERE user_id = user_id_param;

  -- If no plan exists, create one
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
      0,
      NOW(),
      NOW() + interval '1 month'
    )
    RETURNING billing_period_start, billing_period_end INTO period_start, period_end;
  END IF;

  -- Calculate total tokens used in current period
  SELECT COALESCE(SUM(tokens_used), 0)
  INTO total_used
  FROM token_usage
  WHERE user_id = user_id_param
  AND created_at >= period_start
  AND created_at <= period_end;

  RETURN total_used;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to sync token usage with current period
CREATE OR REPLACE FUNCTION sync_token_usage()
RETURNS trigger AS $$
DECLARE
  current_usage integer;
BEGIN
  -- Get current usage
  SELECT calculate_current_period_usage(NEW.user_id) INTO current_usage;
  
  -- Update used_tokens in user_plans
  UPDATE user_plans
  SET used_tokens = current_usage
  WHERE user_id = NEW.user_id;
  
  -- Create plan if it doesn't exist
  IF NOT FOUND THEN
    INSERT INTO user_plans (
      user_id,
      plan_type,
      total_tokens,
      used_tokens,
      billing_period_start,
      billing_period_end
    ) VALUES (
      NEW.user_id,
      'starter',
      35000,
      current_usage,
      NOW(),
      NOW() + interval '1 month'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync usage after each token usage record
DROP TRIGGER IF EXISTS sync_token_usage_trigger ON token_usage;
CREATE TRIGGER sync_token_usage_trigger
  AFTER INSERT ON token_usage
  FOR EACH ROW
  EXECUTE FUNCTION sync_token_usage();

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION calculate_current_period_usage TO authenticated;