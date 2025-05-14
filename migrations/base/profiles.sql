-- Create a table for public profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id              uuid NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY DEFAULT auth.uid(),
  username        TEXT NOT NULL UNIQUE,
  customer_id     uuid UNIQUE,
  avatar_url      TEXT,
  bio             TEXT DEFAULT ''::TEXT,
  full_name       TEXT DEFAULT ''::TEXT,
  name_prefix     TEXT,
  name_suffix     TEXT,
  first_name      TEXT,
  middle_name     TEXT,
  last_name       TEXT,
  role            TEXT default 'user',
  status          TEXT default 'active',
  email           TEXT array,
  phone           TEXT array,
  socials         TEXT array,
  department      TEXT,
  titles          TEXT array,
  metadata        jsonb,
  website         TEXT,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz default now(),

  constraint username_length check (char_length(username) >= 3 and char_length(username) <= 20)
);

-- *** Functions for the profiles table ***

-- A function for retriving the username for a user given their id
CREATE OR REPLACE FUNCTION public.get_username(profile_id uuid)
RETURNS TEXT
LANGUAGE plpgsql 
SECURITY definer
AS $$
DECLARE
  username uuid;
BEGIN
  SELECT p.username INTO username
  FROM public.profiles p
  WHERE p.id = profile_id;

  RETURN username;
END;
$$;

-- A function for retriving the username for the current user
CREATE OR REPLACE FUNCTION public.username()
RETURNS TEXT
LANGUAGE plpgsql 
SECURITY definer
AS $$
DECLARE
  _username TEXT;
BEGIN
  -- Retrieve the username for the current user
  SELECT username INTO _username
  FROM public.profiles
  WHERE id = (SELECT auth.uid());

  RETURN _username;
END;
$$;

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view a user's profile" public.profiles
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can manage their own data"  public.profiles
  AS permissive
  FOR ALL
  TO authenticated 
  USING (( SELECT auth.uid() AS uid) = id) 
  WITH check (( SELECT auth.uid() AS uid) = id);