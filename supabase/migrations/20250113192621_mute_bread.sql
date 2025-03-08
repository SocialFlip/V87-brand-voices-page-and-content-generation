/*
  # Add Cascade Delete for User References

  1. Changes
    - Add ON DELETE CASCADE to all foreign key constraints referencing auth.users
    - This allows proper cleanup when deleting users
  
  2. Tables Modified
    - user_plans
    - content
    - generated_content
    - revived_content
    - hooks
    - brand_voice
    - token_usage
    - scheduled_content
    - global_hooks
*/

-- Recreate user_plans foreign key with cascade
ALTER TABLE user_plans
  DROP CONSTRAINT IF EXISTS user_plans_user_id_fkey,
  ADD CONSTRAINT user_plans_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Recreate content foreign key with cascade
ALTER TABLE content
  DROP CONSTRAINT IF EXISTS content_user_id_fkey,
  ADD CONSTRAINT content_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Recreate generated_content foreign key with cascade
ALTER TABLE generated_content
  DROP CONSTRAINT IF EXISTS generated_content_user_id_fkey,
  ADD CONSTRAINT generated_content_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Recreate revived_content foreign key with cascade
ALTER TABLE revived_content
  DROP CONSTRAINT IF EXISTS revived_content_user_id_fkey,
  ADD CONSTRAINT revived_content_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Recreate hooks foreign key with cascade
ALTER TABLE hooks
  DROP CONSTRAINT IF EXISTS hooks_user_id_fkey,
  ADD CONSTRAINT hooks_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Recreate brand_voice foreign key with cascade
ALTER TABLE brand_voice
  DROP CONSTRAINT IF EXISTS brand_voice_user_id_fkey,
  ADD CONSTRAINT brand_voice_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Recreate token_usage foreign key with cascade
ALTER TABLE token_usage
  DROP CONSTRAINT IF EXISTS token_usage_user_id_fkey,
  ADD CONSTRAINT token_usage_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Recreate scheduled_content foreign key with cascade
ALTER TABLE scheduled_content
  DROP CONSTRAINT IF EXISTS scheduled_content_user_id_fkey,
  ADD CONSTRAINT scheduled_content_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Recreate global_hooks created_by foreign key with cascade
ALTER TABLE global_hooks
  DROP CONSTRAINT IF EXISTS global_hooks_created_by_fkey,
  ADD CONSTRAINT global_hooks_created_by_fkey
    FOREIGN KEY (created_by)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;