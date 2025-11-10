/**
 * Created At: 2025.10.31:14:59:17
 * @author - @FL03
 * @directory - src/lib
 * @file - actions.ts
 */

import { ActionMode, ActionStage } from "@pzzld/actions";

/**
 * The `ActionStateData` object defines a common object for managing the state of various actions.
 */
export type ActionStateData<TData = unknown> = {
  data?: TData;
  error?: string;
  message?: string;
  mode?: ActionMode;
  status?: ActionStage | null;
};

