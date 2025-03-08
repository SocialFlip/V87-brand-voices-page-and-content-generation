-- Create enum for calendar event status
CREATE TYPE calendar_event_status AS ENUM ('pending', 'posted', 'failed');

-- Create calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content_id uuid NOT NULL,
  content_type text NOT NULL,
  platform_id uuid REFERENCES content_platforms(id) NOT NULL,
  scheduled_at timestamptz NOT NULL,
  status calendar_event_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, scheduled_at, content_id)
);

-- Enable RLS
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can create their own calendar events"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own calendar events"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar events"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar events"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_calendar_events_user_date ON calendar_events(user_id, scheduled_at);
CREATE INDEX idx_calendar_events_content ON calendar_events(content_id);
CREATE INDEX idx_calendar_events_platform ON calendar_events(platform_id);

-- Create trigger for updated_at
CREATE TRIGGER set_calendar_events_updated_at
  BEFORE UPDATE ON calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();