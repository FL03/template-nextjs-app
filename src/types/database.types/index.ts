// database.types
export * from "./database.merged.types";

export type {
  Database as PublicDatabase,
  Tables as PublicTables,
} from "./database.public.types";
// custom schemas
export type {
  Database as AccountDatabase,
  Tables as AccountTables,
} from "./database.account.types";
export type {
  Database as NotebookDatabase,
  Tables as NotebookTables,
} from "./database.notebook.types";
export type {
  Database as StripeDatabase,
  Tables as StripeTables,
} from "./database.stripe.types";
