/**
 * Created At: 2025.10.16:17:11:02
 * @author - @FL03
 * @directory - src/features/orgs/utils
 * @file - actions.ts
 */
'use server';
// imports
import { ActionStateData } from '@pzzld/actions';
// project
import { logger } from '@/lib/logger';
// types
import { OrganizationData } from '../types';
import { createOrganization, upsertOrganization } from './api';

/** A server-side form action used to save various organizations created and / or updated using the `OrgForm`. */
export async function saveOrganizationAction(
  formState: ActionStateData,
  formData: FormData,
): Promise<ActionStateData> {
  // parse the form data
  const payload = Object.fromEntries(formData.entries());
  const { id } = payload as Partial<OrganizationData>;
  try {
    // setup the query
    const res = id
      ? await upsertOrganization({ ...payload, id })
      : await createOrganization({ ...payload });
    return Object.assign(formState, {
      res,
      message: 'Organization saved successfully.',
      status: 'success',
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    logger.error(error, error.message);
    return Object.assign(formState, {
      message: 'Failed to save the organization. Please try again.',
      status: 'error',
    });
  }
}
