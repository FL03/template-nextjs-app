-- filename: orgs

-- define the schema
-- along with its privilages
CREATE SCHEMA IF NOT EXISTS orgs;

GRANT USAGE ON SCHEMA orgs TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA orgs TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA orgs TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA orgs TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA orgs GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA orgs GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA orgs GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- *** Tables ***

-- the table for the `orgs.organization` table
CREATE TABLE IF NOT EXISTS orgs.organizations (
  id                UUID NOT NULL UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL DEFAULT '',
  slug              TEXT NOT NULL DEFAULT '',
  structure         TEXT NOT NULL DEFAULT 'LLC',
  category          TEXT NOT NULL DEFAULT 'general',
  description       TEXT DEFAULT NULL,
  homepage          TEXT DEFAULT NULL,
  logo              TEXT DEFAULT NULL,  
  email             TEXT DEFAULT NULL,
  phone             TEXT DEFAULT NULL,
  aliases           TEXT DEFAULT NULL,
  services          TEXT[] NOT NULL DEFAULT '{}'::text[],
  tags              TEXT[] NOT NULL DEFAULT '{}'::text[],
  metadata          JSONB NOT NULL DEFAULT '{}'::jsonb,
  established_on    DATE DEFAULT NULL,
  parent_company    UUID DEFAULT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by        UUID NOT NULL DEFAULT auth.uid(),
  updated_by        UUID NOT NULL DEFAULT auth.uid(),

  CONSTRAINT organizations_fkey_created_by FOREIGN KEY (created_by) REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT organizations_fkey_updated_by FOREIGN KEY (updated_by) REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE
) TABLESPACE pg_default;

-- A table for establishing membership to an organization
CREATE TABLE IF NOT EXISTS orgs.members (
  id                UUID NOT NULL UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL DEFAULT auth.uid(),
  organization_id   UUID NOT NULL,
  role              TEXT NOT NULL DEFAULT 'member',
  permissions       TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  is_owner          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT members_fkey_uid FOREIGN KEY (user_id) REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT members_fkey_oid FOREIGN KEY (organization_id) REFERENCES orgs.organizations ON DELETE CASCADE ON UPDATE CASCADE
);

-- ensure the record timestamp is updated
CREATE OR REPLACE TRIGGER trg_member_updated_at
BEFORE UPDATE ON orgs.members
FOR EACH ROW
EXECUTE FUNCTION public.update_timestamp();
-- keep the updated_at field current
CREATE OR REPLACE TRIGGER trg_organization_updated_at
BEFORE UPDATE ON orgs.organizations
FOR EACH ROW
EXECUTE FUNCTION public.update_timestamp();

-- A function-trigger for automating memberships for organization creators
CREATE OR REPLACE FUNCTION orgs.add_creator_membership()
RETURNS TRIGGER
SET search_path = 'auth, orgs'
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If created_by is NULL, try to use current auth.uid()
  IF (NEW.created_by IS NULL) THEN
    NEW.created_by := (SELECT auth.uid());
  END IF;

  -- If no creator available, skip
  IF (NEW.created_by IS NULL) THEN
    RETURN NEW;
  END IF;

  -- Insert membership if it doesn't already exist
  INSERT INTO orgs.members (user_id, organization_id, role, is_owner)
  SELECT NEW.created_by, NEW.id, 'admin'::TEXT, TRUE
  WHERE NOT EXISTS (
    SELECT 1 FROM orgs.members
    WHERE user_id = NEW.created_by AND organization_id = NEW.id
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_add_creator_membership
AFTER INSERT ON orgs.organizations
FOR EACH ROW
EXECUTE FUNCTION orgs.add_creator_membership();
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
ALTER TABLE orgs.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE orgs.organizations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to manage their memberships" ON orgs.members;

DROP POLICY IF EXISTS "Allow anyone to view created organizations" ON orgs.organizations;
DROP POLICY IF EXISTS "orgs_modify_owner_or_creator" on orgs.organizations;
DROP POLICY IF EXISTS "orgs_modify_by_permission" on orgs.organizations;

CREATE POLICY "Allow authenticated users to manage their memberships" 
ON orgs.members
AS permissive
FOR ALL
TO authenticated 
USING (( SELECT auth.uid()) = user_id) 
WITH check (( SELECT auth.uid()) = user_id);
  
CREATE POLICY "Allow anyone to view created organizations" 
ON orgs.organizations   
AS permissive
FOR SELECT
TO public
USING (true);

-- Update/Delete/Insert: only creator or member with is_owner = true
CREATE POLICY "orgs_modify_owner_or_creator" ON orgs.organizations
  FOR ALL
  TO authenticated
  USING (
    -- allow if user is the creator (created_by) OR is an owner member
    auth.uid() IS NOT NULL AND (
      auth.uid() = created_by
      OR EXISTS (
        SELECT 1 FROM orgs.members m
        WHERE m.organization_id = orgs.organizations.id
          AND m.user_id = auth.uid()
          AND m.is_owner = TRUE
      )
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND (
      auth.uid() = created_by
      OR EXISTS (
        SELECT 1 FROM orgs.members m
        WHERE m.organization_id = orgs.organizations.id
          AND m.user_id = auth.uid()
          AND m.is_owner = TRUE
      )
    )
  );

  -- Example: you store text[] permissions on members, check for 'manage' or 'admin'
CREATE POLICY "orgs_modify_by_permission" ON orgs.organizations
  FOR ALL
  TO authenticated
  USING (
    auth.uid() IS NOT NULL AND (
      auth.uid() = created_by
      OR EXISTS (
        SELECT 1 FROM orgs.members m
        WHERE m.organization_id = orgs.organizations.id
          AND m.user_id = auth.uid()
          AND (
            m.is_owner = TRUE
            OR 'admin' = ANY(m.permissions)
            OR 'manage' = ANY(m.permissions)
          )
      )
    )
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND (
      auth.uid() = created_by
      OR EXISTS (
        SELECT 1 FROM orgs.members m
        WHERE m.organization_id = orgs.organizations.id
          AND m.user_id = auth.uid()
          AND (
            m.is_owner = TRUE
            OR 'admin' = ANY(m.permissions)
            OR 'manage' = ANY(m.permissions)
          )
      )
    )
  );
