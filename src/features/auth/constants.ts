/**
 * Created At: 2025.07.15:11:39:51
 * @author - @FL03
 * @file - auth/constants.ts
 */
import type { AuthGateMode } from './types';

export const ENDPOINT_AUTH = '/auth';
export const ENDPOINT_AUTH_LOGIN = '/auth/login'; // "/auth?view=login";

/** A simple method for creating dynamic endpoints for the `/auth` prefix */
export function authEndpoint<T extends AuthGateMode>(view?: T): string {
  return `${ENDPOINT_AUTH}/${view}`;
}
