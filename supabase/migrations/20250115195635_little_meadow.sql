-- Create function to check and reset tokens if billing period has ended
CREATE OR REPLACE FUNCTION check_and_reset_tokens(user_id_param uuid)
RETURNS void AS $$
DECLARE
  plan_record record;
BEGIN
  -- Get user's current plan
  SELECT * INTO plan_record
  FROM user_plans
  WHERE user_id = user_id_param;

  -- If billing period has ended, reset tokens and update billing period
  IF plan_record.billing_period_end < NOW() THEN
    UPDATE user_plans
    SET 
      used_tokens = 0,
      billing_period_start = NOW(),
      billing_period_end = NOW() + interval '1 month'
    WHERE user_id = user_id_param;

    -- Clear token usage history for the previous period
    INSERT INTO token_usage_history (
      user_id,
      billing_period_start,
      billing_period_end,
      total_tokens_used
    )
    VALUES (
      user_id_param,
      plan_record.billing_period_start,
      plan_record.billing_period_end,
      plan_record.used_tokens
    );

    -- Clear current usage records
    DELETE FROM token_usage
    WHERE user_id = user_id_param
    AND created_at < NOW();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create token usage history table for tracking past periods
CREATE TABLE IF NOT EXISTS token_usage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  billing_period_start timestamptz NOT NULL,
  billing_period_end timestamptz NOT NULL,
  total_tokens_used integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on token usage history
ALTER TABLE token_usage_history ENABLE ROW LEVEL SECURITY;

-- Create policies for token usage history
CREATE POLICY "Users can view their own token usage history"
  ON token_usage_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_token_usage_history_user_period 
ON token_usage_history(user_id, billing_period_start, billing_period_end);

-- Modify getUserTokenInfo function to check for reset
CREATE OR REPLACE FUNCTION get_user_token_info(user_id_param uuid)
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  -- First check if we need to reset tokens
  PERFORM check_and_reset_tokens(user_id_param);
  
  -- Then get the current plan info
  SELECT json_build_object(
    'plan_type', plan_type,
    'total_tokens', total_tokens,
    'used_tokens', used_tokens,
    'billing_period_start', billing_period_start,
    'billing_period_end', billing_period_end
  ) INTO result
  FROM user_plans
  WHERE user_id = user_id_param;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_and_reset_tokens TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_token_info TO authenticated;