-- Description: Setup the stripe integration with Supabase

-- create the Stripe schema and foreign tables
CREATE extension IF NOT EXISTS wrappers WITH SCHEMA extensions;
-- ensure the stripe schema exists
CREATE SCHEMA IF NOT EXISTS stripe;
-- create the stripe wrapper for foreign data
CREATE foreign DATA wrapper stripe_wrapper
  handler stripe_fdw_handler
  validator stripe_fdw_validator;
-- create the stripe server with the API key
CREATE server IF NOT EXISTS stripe_server
  foreign data wrapper stripe_wrapper
  options (
    api_key_name 'stripe_secret_key' -- The Key Name from above, required if api_key_id is not specified.
  );

-- Create the table for public.pricing
CREATE TABLE IF NOT EXISTS public.pricing (
  id              UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL DEFAULT ''::TEXT,
  description     TEXT DEFAULT ''::TEX,
  price           NUMERIC(10, 2) DEFAULT '0.00'::numeric,
  currency        TEXT NOT NULL DEFAULT 'usd'::TEX,
  interval        TEXT DEFAULT 'monthly'::TEXT,
  trial_period    INT DEFAULT 0::int,
  metadata        jsonb DEFAULT '{}'::jsonb
); 
-- Set up Row Level Security (RLS)
-- See https://supabase.com/docs/guides/auth/row-level-security for more details.
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view the product pricing table." ON public.pricing
  FOR SELECT
  USING (true);

-- ** Foreign Tables **
-- Description: Create foreign tables for the Stripe API

-- create a foreign table for the stripe accounts
create foreign table if not exists stripe.accounts (
  id              TEXT,
  business_type   TEXT,
  country         TEXT,
  email           TEXT,
  type            TEXT,
  created         timestamptz NOT NULL DEFAULT now(),
  attrs           jsonb
)
-- configure the stripe server to use the 'accounts' object
server stripe_server
options (
  object 'accounts'
);
-- create a foreign table for the stripe customers
create foreign table if not exists stripe.customers (
  id              TEXT,
  email           TEXT,
  name            TEXT,
  description     TEXT,
  created         timestamptz NOT NULL DEFAULT now(),
  attrs           jsonb
)
-- configure the stripe server to use the 'customers' object
server stripe_server
options (
  object 'customers',
  rowid_column 'id'
);
-- create a foreign table for the stripe prices
create foreign table if not exists stripe.prices (
  id              TEXT,
  active          bool,
  currency        TEXT,
  unit_amount     numeric,
  recurring       jsonb,
  product         TEXT,
  created         timestamptz NOT NULL DEFAULT now(),
  attrs           jsonb
)
-- configure the stripe server to use the 'prices' object
server stripe_server
options (
  object 'prices',
  rowid_column 'id'
);

-- create a foreign table for the stripe products
create foreign table if not exists stripe.products (
  id              TEXT,
  name            TEXT,
  active          bool,
  default_price   TEXT,
  description     TEXT,
  created         timestamptz NOT NULL DEFAULT now(),
  updated         timestamptz NOT NULL DEFAULT now(),
  attrs           jsonb
)
-- configure the stripe server to use the 'products' object
server stripe_server
options (
  object 'products',
  rowid_column 'id'
);

