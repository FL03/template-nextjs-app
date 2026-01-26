-- A custom pricing table for the software and its features
CREATE TABLE IF NOT EXISTS public.pricing (
  id              UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL DEFAULT ''::TEXT,
  description     TEXT DEFAULT ''::TEXT,
  price           NUMERIC(10, 2) DEFAULT '0.00'::numeric,
  currency        TEXT NOT NULL DEFAULT 'usd'::TEXT,
  interval        TEXT DEFAULT 'monthly'::TEXT,
  trial_period    INT DEFAULT 0::int,
  metadata        JSONB DEFAULT '{}'::JSONB
); 

-- define the table for the user profiles
create table if not exists public.profiles (
  id                    uuid not null unique default auth.uid(),
  username              text primary key not null unique default generate_unique_username(),
  primary_email         text not null unique default auth.email(),
  role                  text not null default 'user'::text,
  status                text not null default 'active'::text,
  subscription_status   text not null default 'inactive'::text,
  avatar_url            text,
  bio                   text,
  department            text,
  website               text,
  full_name             text,
  name_prefix           text,
  name_suffix           text,
  first_name            text,
  middle_name           text,
  last_name             text,
  emails                text[] not null default '{}'::text[],
  phone                 text[] not null default '{}'::text[],
  socials               text[] not null default '{}'::text[],
  titles                text[] not null default '{}'::text[],
  metadata              jsonb not null default '{}'::jsonb,
  customer_id           text unique,
  primary_organization  uuid,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  constraint username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
  constraint profile_fkey_oid foreign key (primary_organization) references orgs.organizations on delete set null on update cascade,
  constraint profile_fkey_uid foreign key (id) references auth.users on delete cascade on update cascade
);

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.  
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view the pricing table" ON public.pricing;

DROP POLICY IF EXISTS "Anyone can view a users profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can manage their own data" ON public.profiles;

CREATE POLICY "Anyone can view the pricing table"
  ON public.pricing
  AS permissive
  FOR SELECT
  TO authenticated 
  USING (true);

CREATE POLICY "Anyone can view a users profile" 
  ON public.profiles
  AS permissive
  FOR SELECT
  TO authenticated 
  USING (true);

CREATE POLICY "Users can manage their own data" 
  ON public.profiles
  AS permissive
  FOR ALL
  TO authenticated 
  USING (( SELECT auth.uid()) = id) 
  WITH CHECK (( SELECT auth.uid()) = id);


--  *** Functions & Triggers  ***

-- trigger for updating the timestamp for a profile
CREATE OR REPLACE TRIGGER trg_profile_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- returns the unique identifier of the users configured default organization
CREATE OR REPLACE FUNCTION public.primary_organization()
RETURNS UUID
SET search_path = 'auth, public'
LANGUAGE plpgsql 
STABLE
SECURITY DEFINER
AS $$
DECLARE
  _org_uuid UUID;
BEGIN
  SELECT primary_organization
  INTO _org_uuid
  FROM public.profiles
  WHERE id = (SELECT auth.uid())
  LIMIT 1;

  RETURN _org_uuid;
END;
$$;

-- A function for retriving the username for the current user
CREATE OR REPLACE FUNCTION public.username()
RETURNS text
SET search_path = 'public'
AS $$
DECLARE
  _username text;
BEGIN
  -- Retrieve the username for the current user
  SELECT username INTO _username
  FROM public.profiles
  WHERE id = (SELECT auth.uid());

  RETURN _username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SET search_path = 'auth,public'
LANGUAGE plpgsql
SECURITY definer
AS $$
BEGIN
  -- Check if the username is provided
  IF new.raw_user_meta_data->>'username' IS NULL OR new.raw_user_meta_data->>'username' = '' THEN
    RAISE EXCEPTION 'Username must be provided for new users';
  END IF;

  INSERT INTO public.profiles (id, primary_email, emails, phone, username, customer_id)
  VALUES (new.id, new.email, ARRAY[new.email], ARRAY[new.phone], new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'customer_id');
  
  RETURN new;
END;
$$;

-- A trigger automatically invoked whenever a new user is created
CREATE OR REPLACE TRIGGER trg_on_new_user_insert
AFTER INSERT 
ON auth.users
FOR each ROW EXECUTE PROCEDURE public.handle_new_user();

-- A function used to trigger the creation of a new profile whenever a new user is created
CREATE OR REPLACE FUNCTION public.sync_user_metadata_with_profile()
RETURNS TRIGGER 
SET search_path = 'public, auth'
AS $$
DECLARE
  existing_meta jsonb;
  patch jsonb;
BEGIN
  -- fetch existing raw_user_meta_data for the user (null-safe)
  SELECT COALESCE(raw_user_meta_data, '{}'::jsonb) INTO existing_meta
  FROM auth.users
  WHERE id = NEW.id;

  -- build a patch with only the keys we want to update from the profile
  patch := jsonb_build_object(
    'username', NEW.username,
    'customer_id', NEW.customer_id,
    'subscription_status', NEW.subscription_status
  );

  -- Apply the patch onto existing_meta, preferring patch values for these keys.
  -- The patch is concatenated on the right so its values overwrite same-named keys.
  UPDATE auth.users
  SET raw_user_meta_data = existing_meta || patch
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- sync changes to the profiles.username field with the associated auth.users metadata
CREATE OR REPLACE TRIGGER trg_after_update_profile
AFTER UPDATE
ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_metadata_with_profile();
