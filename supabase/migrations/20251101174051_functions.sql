-- functions.sql
-- "global" functions for the public schema

-- Simple random username generator
CREATE OR REPLACE FUNCTION public.random_username()
RETURNS TEXT
SET search_path = 'public'
LANGUAGE plpgsql
VOLATILE
SECURITY INVOKER
AS $$
DECLARE
  rand_int INT;
  username TEXT;
BEGIN
  -- Generate a random 6-digit integer between 100000 and 999999
  rand_int := floor(random() * 900000 + 100000)::int;
  username := 'user-' || rand_int::text;
  RETURN username;
END;
$$;

-- Unique username generator that calls public.random_username()
CREATE OR REPLACE FUNCTION public.generate_unique_username()
RETURNS TEXT
SET search_path = 'public'
LANGUAGE plpgsql
VOLATILE
SECURITY INVOKER
AS $$
DECLARE
  _username TEXT;
  tries INT := 0;
BEGIN
  LOOP
    _username := public.random_username();

    -- Check uniqueness in public.profiles
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = _username) THEN
      RETURN _username;
    END IF;

    tries := tries + 1;
    IF tries >= 10 THEN
      RAISE EXCEPTION 'Unable to generate a unique username after % attempts', tries;
    END IF;
  END LOOP;
END;
$$;

-- a function designed to update a particular column with the current timestamp
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER 
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

