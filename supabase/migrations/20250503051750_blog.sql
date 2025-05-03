CREATE OR REPLACE SCHEMA blogger;
-- Enable row-level security for the schema
ALTER SCHEMA blogger ENABLE ROW LEVEL SECURITY;
GRANT USAGE ON SCHEMA blogger TO anon, authenticated, service_role;
-- -- Grant permissions to the service role and authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA blogger TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA blogger TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA blogger TO anon, authenticated, service_role;
-- Alter default privileges for the service role and authenticated users
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA blogger GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA blogger GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA blogger GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
-- 
CREATE TABLE IF NOT EXISTS  blogger.posts (
    id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid() PRIMARY KEY,
    creator text NOT NULL DEFAULT public.username() references public.profiles on delete cascade foreign key,
    title text NOT NULL DEFAULT ''::text,
    slug text NOT NULL DEFAULT ''::text,
    content text NOT NULL DEFAULT ''::text,
    tumbnail text DEFAULT ''::text,
    bookmarks integer NOT NULL DEFAULT 0,
    category text NOT NULL DEFAULT 'general'::text,
    likes integer NOT NULL DEFAULT 0,
    private boolean NOT NULL DEFAULT false,
    status text NOT NULL DEFAULT 'draft'::text,
    tags text[] NOT NULL DEFAULT '{}'::text[],
    is_featured boolean NOT NULL DEFAULT false,
    published_at timestamp with time zone DEFAULT NULL,
    is_published boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),

    constraint posts_creator_fkey foreign KEY (creator) references public.profiles (username) on delete CASCADE
) TABLESPACE pg_default;

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
ALTER TABLE blogger.posts ENABLE ROW LEVEL SECURITY;

-- RLS policies for posts
CREATE POLICY "Authenticated users can manage their posts" 
  ON blogger.posts
  AS permissive
  FOR ALL
  TO authenticated 
  USING (( SELECT public.username() AS username) = creator) 
  WITH CHECK (( SELECT public.username() AS username) = creator);

CREATE POLICY "Authenticated users can view public posts" 
  ON blogger.posts
  AS permissive
  FOR ALL
  TO authenticated 
  USING (is_published = true)
  WITH CHECK (is_published = true);

-- when called, this function updates the updated_at column of some row
CREATE OR REPLACE FUNCTION blogger.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- trigger a function to update the timestamp of the corresponding row of the posts table
CREATE OR REPLACE TRIGGER trg_blogger_post_updated_at
BEFORE UPDATE ON blogger.posts
FOR EACH ROW
EXECUTE FUNCTION blogger.update_timestamp();