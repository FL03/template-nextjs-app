import { Database as PublicDatabase } from './database.public.types';
import { Database as StripeDatabase } from './database.stripe.types';

import { SupabaseClient } from '@supabase/supabase-js';

export type Database = {
  public: PublicDatabase['public'];
};

export type Tables = {
  public: PublicDatabase['public']['Tables'];
};

export type Enums = {
  public: PublicDatabase['public']['Enums'];
};


export type Functions = {
  public: PublicDatabase['public']['Functions'];
};

export type Views = {
  public: PublicDatabase['public']['Views'];
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type StripeSupaClient = SupabaseClient<StripeDatabase, "stripe">