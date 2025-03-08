
-- Special policy for admin
CREATE POLICY "Admin has full access"
  ON user_plans
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) = 'businessai360@gmail.com'
  );

-- Modify handle_new_user function to not create plan automatically
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Only create starter plan for admin
  IF NEW.email = 'businessai360@gmail.com' THEN
    INSERT INTO user_plans (user_id, plan_type, total_tokens)
    VALUES (NEW.id, 'elite', 999999999);
  END IF;
  RETURN NEW;
END;
$$ language plpgsql security definer;