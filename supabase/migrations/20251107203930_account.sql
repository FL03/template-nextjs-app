-- filename: account

DROP TABLE IF EXISTS account.portfolios;
DROP TABLE IF EXISTS account.contacts;
DROP TABLE IF EXISTS account.notifications;
DROP SCHEMA IF EXISTS account CASCADE;

-- ****************************
-- ***        Schema        ***
-- ****************************

-- create the schema if it does not exist
CREATE SCHEMA IF NOT EXISTS account;
-- grant the schema certain permissions
GRANT USAGE ON SCHEMA account TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA account TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA account TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA account TO anon, authenticated, service_role;
-- alter the default privileges for the schema
ALTER default PRIVILEGES FOR ROLE postgres IN SCHEMA account GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER default PRIVILEGES FOR ROLE postgres IN SCHEMA account GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER default PRIVILEGES FOR ROLE postgres IN SCHEMA account GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ****************************
-- ***        Tables        ***
-- ****************************

-- define the table for the user portfolios
create table if not exists account.portfolios (
  id                    uuid not null unique default gen_random_uuid() primary key,
  net_worth             numeric not null default '0'::numeric,

  created_at            timestamptz not null default now(),
  created_by            uuid not null default auth.uid() references auth.users on delete cascade on update cascade,
  updated_at            timestamptz not null default now()
);
-- Create a new table for user notifications
create table if not exists account.notifications (
  id          uuid not null UNIQUE default gen_random_uuid() primary key,
  sender      text not null default 'system'::text,
  message     text not null default ''::text,
  category    text not null default 'general'::text,
  priority    text not null default 'low'::text,
  status      text not null default 'unread'::text,
  type        text not null default 'info'::text,
  pinned      boolean not null default FALSE,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  user_id     uuid not null default auth.uid() references public.profiles (id) on delete cascade on update cascade
);

-- the contacts table for users to manage their connections
create table if not exists account.contacts (
  id              uuid not null unique default gen_random_uuid() primary key,
  address         text,
  full_name       text not null default ''::text,
  name_prefix     text default NULL,
  name_suffix     text default NULL,
  first_name      text default ''::text,
  middle_name     text default NULL,
  last_name       text default ''::text,
  homepage        text default NULL,
  aliases         text[] not null default '{}'::text[],
  emails          text[] not null default '{}'::text[],
  phone_numbers   text[] not null default '{}'::text[],
  socials         text[] not null default '{}'::text[],
  urls            text[] not null default '{}'::text[],
  department      text,
  titles          text[] not null default '{}'::text[],
  organization    text,
  notes           text not null default ''::text,
  metadata        JSONB default '{}'::jsonb,
  username        text references public.profiles on delete cascade on update cascade,
  created_by      uuid not null default auth.uid() references auth.users on delete cascade on update cascade,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ****************************
-- ***     Auth Policies    ***
-- ****************************
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.  

ALTER TABLE account.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE account.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE account.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their contacts" ON account.contacts;
-- Enable authenticated users to manage their own contacts
CREATE POLICY "Users can manage their own data" ON account.contacts
AS permissive
FOR ALL
TO authenticated 
USING (( SELECT auth.uid() AS uid) = created_by) 
WITH check (( SELECT auth.uid() AS uid) = created_by);


DROP POLICY IF EXISTS "Users can view and manage their own notifications." ON account.notifications;
-- Enable authenticated users to manage their notifications
CREATE POLICY "Users can view and manage their own notifications." ON account.notifications 
AS permissive 
FOR ALL 
TO authenticated 
USING (( SELECT auth.uid() AS uid) = user_id) 
WITH CHECK (( SELECT auth.uid() AS uid) = user_id);

DROP POLICY IF EXISTS "Users can manage their own data" ON account.portfolios;
-- Enable authenticated users to manage created portfolios
CREATE POLICY "Users can manage their own data" ON account.portfolios 
AS permissive
FOR ALL
TO authenticated 
USING (( SELECT auth.uid()) = created_by) 
WITH CHECK (( SELECT auth.uid()) = created_by);

-- A function triggered by an update to add a timestamp to the event
CREATE OR REPLACE FUNCTION account.update_timestamp()
RETURNS TRIGGER 
SET search_path = 'account'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER account_trg_before_update_on_contacts
BEFORE UPDATE
ON account.contacts
FOR EACH ROW
EXECUTE FUNCTION account.update_timestamp();

CREATE OR REPLACE TRIGGER account_trg_before_update_on_notifications
BEFORE UPDATE
ON account.notifications
FOR EACH ROW
EXECUTE FUNCTION account.update_timestamp();

CREATE OR REPLACE TRIGGER account_trg_before_update_on_portfolios
BEFORE UPDATE
ON account.portfolios
FOR EACH ROW
EXECUTE FUNCTION account.update_timestamp();
