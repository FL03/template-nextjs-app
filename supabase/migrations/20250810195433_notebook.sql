-- create the schema if it does not exist
CREATE SCHEMA IF NOT EXISTS notebook;
-- grant the schema certain permissions
GRANT USAGE ON SCHEMA notebook TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA notebook TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA notebook TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA notebook TO anon, authenticated, service_role;
-- alter the default privileges for the schema
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA notebook GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA notebook GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA notebook GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- create a table for managing user notes
CREATE TABLE IF NOT EXISTS  notebook.books (
    id                  UUID NOT NULL PRIMARY KEY UNIQUE DEFAULT gen_random_uuid(),
    description         TEXT DEFAULT NULL,
    title               TEXT NOT NULL DEFAULT ''::text,
    slug                TEXT NOT NULL DEFAULT ''::text,
    tumbnail            TEXT DEFAULT NULL,
    category            TEXT NOT NULL DEFAULT 'general'::text,
    status              TEXT NOT NULL DEFAULT 'draft'::text,
    tags                TEXT[] NOT NULL DEFAULT '{}'::text[],
    pinned              BOOLEAN NOT NULL DEFAULT false,
    content_address     TEXT UNIQUE DEFAULT NULL,
    username            TEXT NOT NULL DEFAULT public.username(),  
    user_id             UUID NOT NULL DEFAULT auth.uid(),    
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    constraint books_creator_fkey foreign key (username) references public.profiles (username) ON DELETE CASCADE ON UPDATE CASCADE,
    constraint books_user_id_fkey foreign key (user_id) references auth.users (id) ON DELETE CASCADE ON UPDATE CASCADE
) TABLESPACE pg_default;

-- create a table for managing user notes
CREATE TABLE IF NOT EXISTS  notebook.notes (
    id                  UUID NOT NULL PRIMARY KEY UNIQUE DEFAULT gen_random_uuid(),
    description         TEXT DEFAULT null,
    title               TEXT NOT NULL DEFAULT ''::text,
    slug                TEXT NOT NULL DEFAULT ''::text,
    content             TEXT NOT NULL DEFAULT ''::text,
    content_address     TEXT NOT NULL UNIQUE DEFAULT ''::text,
    tumbnail            TEXT DEFAULT null,
    bookmarks           INTEGER NOT NULL DEFAULT 0,
    category            TEXT NOT NULL DEFAULT 'general'::text,
    status              TEXT NOT NULL DEFAULT 'draft'::text,
    tags                TEXT[] NOT NULL DEFAULT '{}'::text[],
    likes               INTEGER NOT NULL DEFAULT 0,
    pinned              BOOLEAN NOT NULL DEFAULT false,
    is_published        BOOLEAN NOT NULL DEFAULT false,
    book_id             UUID DEFAULT NULL,  
    user_id             UUID NOT NULL DEFAULT auth.uid(),    
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at        TIMESTAMPTZ DEFAULT NULL,
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    constraint notes_book_id foreign key (book_id) references notebook.books (id) ON DELETE CASCADE ON UPDATE CASCADE,
    constraint notes_user_fkey foreign key (user_id) references auth.users (id) ON DELETE CASCADE ON UPDATE CASCADE
) TABLESPACE pg_default;

-- *** Row Level Security (RLS) ***
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.

-- Enable RLS for the notes table
ALTER TABLE notebook.notes ENABLE ROW LEVEL SECURITY;

-- enable authenticated users to manage their own books
CREATE POLICY "Authenticated users can manage their own books." 
  ON notebook.books
  AS permissive
  FOR ALL
  TO authenticated 
  USING (( SELECT auth.uid() AS userId) = user_id) 
  WITH CHECK (( SELECT auth.uid() AS userId) = user_id);

-- enable authenticated users to manage their own notes
CREATE POLICY "Authenticated users can manage their own notes." 
  ON notebook.notes
  AS permissive
  FOR ALL
  TO authenticated 
  USING (( SELECT auth.uid() AS userId) = user_id) 
  WITH CHECK (( SELECT auth.uid() AS userId) = user_id);
