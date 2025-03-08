-- Update admin user plan to elite with unlimited tokens
UPDATE user_plans
SET 
  plan_type = 'elite',
  total_tokens = 999999999,
  used_tokens = 0
WHERE user_id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'businessai360@gmail.com'
);

-- If no plan exists for admin, create one
INSERT INTO user_plans (user_id, plan_type, total_tokens, used_tokens)
SELECT 
  id,
  'elite',
  999999999,
  0
FROM auth.users 
WHERE email = 'businessai360@gmail.com'
AND NOT EXISTS (
  SELECT 1 
  FROM user_plans 
  WHERE user_id = auth.users.id
);