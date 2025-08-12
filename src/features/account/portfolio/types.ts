/**
 * Created At: 2025.07.05:21:10:02
 * @author - @FL03
 * @file - portfolio/types.ts
 */

import type { Database } from "@/types/database.types/database.account.types";

/** A type alias for a portfolio when **inserting**. */
export type PortfolioInsert =
  Database["account"]["Tables"]["portfolio"]["Insert"];
/** A type alias for a **updating** a portfolio */
export type PortfolioUpdate =
  Database["account"]["Tables"]["portfolio"]["Update"];
/** The `PortfolioData` object defines the _type_ of **row** that is stored within the database.  */
export type PortfolioData = Database["account"]["Tables"]["portfolio"]["Row"];

/** A type alias for objects capable of being used to define a portfolio. */
export type Portfolio = PortfolioData | PortfolioInsert | PortfolioUpdate;
