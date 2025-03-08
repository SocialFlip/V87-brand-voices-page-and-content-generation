-- Create enum for plan types
CREATE TYPE plan_type AS ENUM ('starter', 'premium', 'elite');

-- Create user plans table
CREATE TABLE IF NOT EXISTS user_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  plan_type plan_type NOT NULL DEFAULT 'starter',
  total_tokens integer NOT NULL,
  used_tokens integer DEFAULT 0,
  billing_period_start timestamptz DEFAULT now(),
  billing_period_end timestamptz DEFAULT now() + interval '1 month',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create token usage table
CREATE TABLE IF NOT EXISTS token_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  action_type text NOT NULL,
  tokens_used integer NOT NULL,
  content_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_usage ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own plan"
  ON user_plans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their token usage"
  ON token_usage FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_plans_user_id ON user_plans(user_id);
CREATE INDEX idx_token_usage_user_id ON token_usage(user_id);
CREATE INDEX idx_token_usage_created_at ON token_usage(created_at);

-- Create trigger for updated_at
CREATE TRIGGER set_user_plans_updated_at
  BEFORE UPDATE ON user_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle plan creation on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO user_plans (user_id, plan_type, total_tokens)
  VALUES (NEW.id, 'starter', 35000);
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Drop existing trigger if it exists and create new one
DO $$
BEGIN
  -- Drop the trigger if it exists
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  
  -- Create the trigger
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();
EXCEPTION
  WHEN OTHERS THEN
    -- If there's any error, we can safely ignore it
    -- as it likely means we don't have permission to drop the trigger
    NULL;
END $$;