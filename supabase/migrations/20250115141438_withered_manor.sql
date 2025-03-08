-- Create a function to get plan details from admin_user_view
CREATE OR REPLACE FUNCTION get_user_plan_details(user_id uuid)
RETURNS TABLE (
  plan_type plan_type,
  total_tokens integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE auv.plan_type
      WHEN 'starter' THEN 'starter'::plan_type
      WHEN 'premium' THEN 'premium'::plan_type
      WHEN 'elite' THEN 'elite'::plan_type
      ELSE 'starter'::plan_type
    END,
    CASE auv.plan_type
      WHEN 'starter' THEN 35000
      WHEN 'premium' THEN 55000
      WHEN 'elite' THEN 90000
      ELSE 35000
    END
  FROM admin_user_view auv
  WHERE auv.user_id = get_user_plan_details.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  plan_details record;
BEGIN
  -- Special case for admin
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
      'elite'::plan_type,
      999999999,
      0,
      NOW(),
      NOW() + interval '1 month'
    );
  ELSE
    -- Get plan details from admin view
    SELECT * INTO plan_details FROM get_user_plan_details(NEW.id);
    
    -- Insert with dynamic plan details
    INSERT INTO user_plans (
      user_id,
      plan_type,
      total_tokens,
      used_tokens,
      billing_period_start,
      billing_period_end
    ) VALUES (
      NEW.id,
      plan_details.plan_type,
      plan_details.total_tokens,
      0,
      NOW(),
      NOW() + interval '1 month'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sync existing users with their correct plans
DO $$
DECLARE
  user_record record;
  plan_details record;
BEGIN
  -- For each user without a plan
  FOR user_record IN 
    SELECT id, email 
    FROM auth.users u
    WHERE NOT EXISTS (
      SELECT 1 FROM user_plans up WHERE up.user_id = u.id
    )
  LOOP
    -- Skip admin user as they're handled separately
    IF user_record.email != 'businessai360@gmail.com' THEN
      -- Get plan details
      SELECT * INTO plan_details FROM get_user_plan_details(user_record.id);
      
      -- Insert plan with correct details
      INSERT INTO user_plans (
        user_id,
        plan_type,
        total_tokens,
        used_tokens,
        billing_period_start,
        billing_period_end
      ) VALUES (
        user_record.id,
        plan_details.plan_type,
        plan_details.total_tokens,
        0,
        NOW(),
        NOW() + interval '1 month'
      );
    END IF;
  END LOOP;
END;
$$;