/**
 * Created At: 2025.07.06:15:56:33
 * @author - @FL03
 * @file - database.merged.types.ts
 */
// public
import { Database as PublicDatabase } from './database.public.types';
// wrappers
import { Database as StripeDatabase } from './database.stripe.types';
// custom schemas
import { Database as AccountDatabase } from './database.account.types';
import { Database as OrgsDatabase } from './database.orgs.types';
// project specific
import { Database as RmsDatabase } from './database.rms.types';

export type Database = {
  public: PublicDatabase['public'];
  account: AccountDatabase['account'];
  orgs: OrgsDatabase['orgs'];
  rms: RmsDatabase['rms'];
  stripe: StripeDatabase['stripe'];
};

export type Tables = {
  public: PublicDatabase['public']['Tables'];
  account: AccountDatabase['account']['Tables'];
  orgs: OrgsDatabase['orgs']['Tables'];
  rms: RmsDatabase['rms']['Tables'];
  stripe: StripeDatabase['stripe']['Tables'];
};

export type Enums = {
  public: PublicDatabase['public']['Enums'];
  account: AccountDatabase['account']['Enums'];
  orgs: OrgsDatabase['orgs']['Enums'];
  rms: RmsDatabase['rms']['Enums'];
  stripe: StripeDatabase['stripe']['Enums'];
};

export type Functions = {
  public: PublicDatabase['public']['Functions'];
  account: AccountDatabase['account']['Functions'];
  orgs: OrgsDatabase['orgs']['Functions'];
  rms: RmsDatabase['rms']['Functions'];
  stripe: StripeDatabase['stripe']['Functions'];
};

export type Views = {
  public: PublicDatabase['public']['Views'];
  account: AccountDatabase['account']['Views'];
  orgs: OrgsDatabase['orgs']['Views'];
  rms: RmsDatabase['rms']['Views'];
  stripe: StripeDatabase['stripe']['Views'];
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
