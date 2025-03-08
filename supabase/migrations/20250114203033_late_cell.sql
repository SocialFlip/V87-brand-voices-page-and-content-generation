-- Drop the existing table if it exists
DROP TABLE IF EXISTS user_social_connections;

-- Create the new table
CREATE TABLE IF NOT EXISTS user_social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  provider text NOT NULL,
  access_token text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider)
);

-- Enable RLS
ALTER TABLE user_social_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own social accounts"
  ON user_social_accounts FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_social_accounts_user ON user_social_accounts(user_id);
CREATE INDEX idx_user_social_accounts_provider ON user_social_accounts(provider);

-- Create updated_at trigger
CREATE TRIGGER set_user_social_accounts_updated_at
  BEFORE UPDATE ON user_social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();