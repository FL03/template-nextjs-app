/**
 * Created At: 2025.07.06:15:56:33
 * @author - @FL03
 * @file - database.merged.types.ts
 */
// public
import { Database as PublicDatabase } from "./database.public.types";
// custom schemas
import { Database as AccountDatabase } from "./database.account.types";
import { Database as NotebookDatabase } from "./database.notebook.types";
// wrappers
import { Database as StripeDatabase } from "./database.stripe.types";


export type Database = {
  public: PublicDatabase["public"];
  account: AccountDatabase["account"];
  notebook: NotebookDatabase["notebook"];
  stripe: StripeDatabase["stripe"];
};

export type Tables = {
  public: PublicDatabase["public"]["Tables"];
  account: AccountDatabase["account"]["Tables"];
  notebook: NotebookDatabase["notebook"]["Tables"];
  stripe: StripeDatabase["stripe"]["Tables"];
};

export type Enums = {
  public: PublicDatabase["public"]["Enums"];
  account: AccountDatabase["account"]["Enums"];
  notebook: NotebookDatabase["notebook"]["Enums"];
  stripe: StripeDatabase["stripe"]["Enums"];
};

export type Functions = {
  public: PublicDatabase["public"]["Functions"];
  account: AccountDatabase["account"]["Functions"];
  notebook: NotebookDatabase["notebook"]["Functions"];
  stripe: StripeDatabase["stripe"]["Functions"];
};

export type Views = {
  public: PublicDatabase["public"]["Views"];
  account: AccountDatabase["account"]["Views"];
  notebook: NotebookDatabase["notebook"]["Views"];
  stripe: StripeDatabase["stripe"]["Views"];
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
