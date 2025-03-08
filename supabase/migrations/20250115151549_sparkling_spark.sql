-- Enable RLS on token_usage if not already enabled
ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can insert their own token usage" ON token_usage;
DROP POLICY IF EXISTS "Users can view their own token usage" ON token_usage;
DROP POLICY IF EXISTS "Admin can view all token usage" ON token_usage;

-- Create policies for token_usage table
CREATE POLICY "Users can insert their own token usage"
  ON token_usage
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own token usage"
  ON token_usage
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all token usage"
  ON token_usage
  FOR SELECT
  TO authenticated
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'businessai360@gmail.com'
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_token_usage_user_action 
ON token_usage(user_id, action_type);

-- Create function to validate token usage
CREATE OR REPLACE FUNCTION validate_token_usage()
RETURNS trigger AS $$
BEGIN
  -- Check if user exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = NEW.user_id
  ) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;

  -- Validate tokens_used is positive
  IF NEW.tokens_used <= 0 THEN
    RAISE EXCEPTION 'tokens_used must be positive';
  END IF;

  -- Special case for admin - always allow
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = NEW.user_id 
    AND email = 'businessai360@gmail.com'
  ) THEN
    RETURN NEW;
  END IF;

  -- Check if user has enough tokens
  IF EXISTS (
    SELECT 1 FROM user_plans up
    WHERE up.user_id = NEW.user_id
    AND (up.total_tokens - up.used_tokens) < NEW.tokens_used
  ) THEN
    RAISE EXCEPTION 'Insufficient tokens';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for token validation
DROP TRIGGER IF EXISTS validate_token_usage_trigger ON token_usage;
CREATE TRIGGER validate_token_usage_trigger
  BEFORE INSERT ON token_usage
  FOR EACH ROW
  EXECUTE FUNCTION validate_token_usage();