-- Create a new table for user notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  username    TEXT NOT NULL REFERENCES public.profiles (username) ON DELETE CASCADE DEFAULT public.username(),
  sender      TEXT NOT NULL DEFAULT public.username(),
  message     TEXT NOT NULL DEFAULT ''::TEXT,
  category    TEXT NOT NULL DEFAULT 'general'::TEXT,
  priority    TEXT NOT NULL DEFAULT 'low'::TEXT,
  status      TEXT NOT NULL DEFAULT 'unread'::TEXT,
  type        TEXT NOT NULL DEFAULT 'info'::TEXT,
  pinned      BOOLEAN NOT NULL DEFAULT false,
  created_at  timestamp with time zone NOT NULL DEFAULT now(),
  updated_at  timestamp with time zone NOT NULL DEFAULT now()
);

-- trigger for updating the timestamp for a profile
CREATE OR REPLACE TRIGGER trg_notification_updated_at
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users may manage their notifications" ON public.notifications
  AS permissive
  FOR ALL
  TO authenticated 
  USING (( SELECT public.username() AS username) = username) 
  WITH CHECK (( SELECT public.username() AS username) = username);