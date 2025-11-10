-- create the schema if it does not exist
CREATE SCHEMA IF NOT EXISTS rms;
-- grant the schema certain permissions
GRANT USAGE ON SCHEMA rms TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA rms TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA rms TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA rms TO anon, authenticated, service_role;
-- alter the default privileges for the schema
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA rms GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA rms GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA rms GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
-- The pay_periods table
CREATE TABLE IF NOT EXISTS rms.pay_periods
(
  id              UUID NOT NULL UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
  date            DATE NOT NULL,
  days            NUMERIC NOT NULL DEFAULT 14,
  metadata        jsonb,
  organization_id UUID,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  constraint pay_periods_org_id_fkey foreign key (organization_id) references orgs.organizations (id) on delete set null on update cascade
);
-- The shifts table
CREATE TABLE IF NOT EXISTS rms.shifts
(
  id              UUID NOT NULL UNIQUE PRIMARY KEY DEFAULT gen_random_uuid(),
  assignee        TEXT NOT NULL DEFAULT public.username(),
  date            DATE NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending',
  tips_cash       NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  tips_credit     NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  clocked_in      TIMESTAMPTZ,
  clocked_out     TIMESTAMPTZ,
  start_at        TIMESTAMPTZ,
  ends_at         TIMESTAMPTZ,
  attachments     TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  tags            TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  metadata        JSONB NOT NULL DEFAULT '{}'::JSONB,
  pay_period      UUID,
  organization_id UUID NULL DEFAULT orgs.primary_organization(),
  created_by      UUID NOT NULL DEFAULT auth.uid(),
  updated_by      UUID NOT NULL DEFAULT auth.uid(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  constraint shift_fkey_assignee FOREIGN KEY (assignee) REFERENCES public.profiles (username) ON DELETE SET NULL ON UPDATE CASCADE,
  constraint shift_fkey_pay_period FOREIGN KEY (pay_period) REFERENCES rms.pay_periods ON DELETE SET NULL ON UPDATE CASCADE,
  constraint shift_fkey_organization FOREIGN KEY (organization_id) REFERENCES orgs.organizations ON DELETE SET NULL ON UPDATE CASCADE,
  constraint shift_fkey_created_by foreign key (created_by) REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE,  
  constraint shift_fkey_updated_by foreign key (updated_by) REFERENCES auth.users ON DELETE CASCADE ON UPDATE CASCADE
);

-- update the timestamp of a note before every update
CREATE OR REPLACE TRIGGER trg_shift_updated_at
BEFORE UPDATE ON rms.shifts
FOR EACH ROW
EXECUTE FUNCTION public.update_timestamp();

-- update the timestamp of a note before every update
CREATE OR REPLACE TRIGGER trg_pay_period_updated_at
BEFORE UPDATE ON rms.pay_periods
FOR EACH ROW
EXECUTE FUNCTION public.update_timestamp();

-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
ALTER TABLE rms.pay_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE rms.shifts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can manage their created or assigned shifts"  ON rms.shifts;

CREATE POLICY "Authenticated users can manage their created or assigned shifts"
ON rms.shifts
AS PERMISSIVE
FOR ALL
TO authenticated
USING (
  auth.uid() = created_by
  OR auth.uid() = (SELECT id FROM public.profiles WHERE username = assignee)
)
WITH CHECK (
  auth.uid() = created_by
  OR auth.uid() = (SELECT id FROM public.profiles WHERE username = assignee)
);

