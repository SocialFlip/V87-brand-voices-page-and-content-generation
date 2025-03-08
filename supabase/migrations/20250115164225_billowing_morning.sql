-- Create function to increment used tokens
CREATE OR REPLACE FUNCTION increment_used_tokens(
  user_id_param uuid,
  tokens_to_add integer
)
RETURNS void AS $$
BEGIN
  -- Skip token tracking for admin
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = user_id_param 
    AND email = 'businessai360@gmail.com'
  ) THEN
    RETURN;
  END IF;

  -- Update user's token usage
  UPDATE user_plans
  SET used_tokens = used_tokens + tokens_to_add
  WHERE user_id = user_id_param
  AND (total_tokens - used_tokens) >= tokens_to_add;

  -- If no rows were updated, it means user doesn't have enough tokens
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient tokens available';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_used_tokens TO authenticated;