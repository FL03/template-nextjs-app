/**
 * Created At: 2025.10.25:14:51:38
 * @author - @FL03
 * @directory - src/features/shifts/utils
 * @file - api.ts
 */
// imports
import { ActionStateData } from '@pzzld/actions';
// project
import { parseSearchParams, resolveOrigin } from '@/lib/utils';
import { logger } from '@/lib/logger';
// feature-specific
import { ShiftData, ShiftInsert, ShiftUpdate } from '../types';

const ENDPOINT = '/api/shifts';

const shiftEndpoint = (path?: string) =>
  path && path.trim() !== '' ? `${ENDPOINT}/${path}` : ENDPOINT;

/** Get a shift from the database by its unique identifier.  */
export async function getShift(
  id?: string,
  init?: Omit<RequestInit, 'method'>,
): Promise<ShiftData | null> {
  if (!id) {
    throw new Error('Unable to fetch a shift without a valid identifier');
  }
  // fetch the data
  const res = await fetch(shiftEndpoint(id), {
    ...init,
    method: 'GET',
  });
  // load the response payload
  const { data, error } = await res.json();
  // handle any errors
  if (error) {
    throw new Error(error);
  }
  return data;
}
/** Delete a shift from the database by its id using the `fetch` api  */
export async function deleteShift(
  id?: string,
  init?: Omit<RequestInit, 'method'>,
): Promise<ShiftData | null> {
  if (!id) {
    throw new Error('Unable to delete a shift without its unique identifier.');
  }
  // use the fetch API to delete the shift
  const res = await fetch(shiftEndpoint(id), {
    ...init,
    method: 'DELETE',
  });
  // load the response payload
  const { data, error } = await res.json();
  if (error) {
    throw new Error(error);
  }
  return data;
}

/** Use the API to fetch shifts for a user from the database */
export async function getShifts(
  {
    assignee,
    ...params
  }: {
    assignee?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
  } = {},
  init?: Omit<RequestInit, 'method'>,
): Promise<ShiftData[]> {
  const url = new URL(ENDPOINT, resolveOrigin());
  url.search = parseSearchParams(params).toString();
  if (assignee) url.searchParams.set('filterBy', `assignee:${assignee}`);
  // fetch the data
  const res = await fetch(url, {
    ...init,
    method: 'GET',
  });
  //
  const { data, error } = await res.json();
  if (error) {
    throw new Error(error);
  }
  return data;
}
/** Insert a new shift into the database using the given data. */
export async function createShift(
  values?: ShiftInsert,
  init?: Omit<RequestInit, 'method' | 'body'>,
): Promise<ShiftData | null> {
  if (!values) {
    throw new Error('No values provided for the new shift');
  }
  const res = await fetch(ENDPOINT, {
    ...init,
    method: 'POST',
    body: values ? JSON.stringify(values) : undefined,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
    },
  });

  const { data, error } = await res.json();

  if (error) {
    logger.error(error);
    throw new Error(error);
  }
  return data;
}

/** A client-side method for updating a particular shift */
export async function updateShift(
  { id, ...values }: ShiftUpdate = {},
  init?: Omit<RequestInit, 'method' | 'body'>,
): Promise<ShiftData | null> {
  const res = await fetch(shiftEndpoint(id), {
    ...init,
    method: 'PATCH',
    body: values ? JSON.stringify(values) : undefined,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
    },
  });

  const { data, error } = await res.json();

  if (error) {
    throw new Error(error);
  }
  return data;
}

/** The `upsert` tries to insert  */
export async function upsertShift(
  { id, ...values }: Omit<Partial<ShiftData>, 'id'> & { id: string },
  init?: Omit<RequestInit, 'method' | 'body'>,
): Promise<ShiftData | null> {
  const res = await fetch(shiftEndpoint(id), {
    ...init,
    method: 'PATCH',
    body: values ? JSON.stringify(values) : undefined,
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
    },
  });

  const { data, error } = await res.json();

  if (error) {
    throw new Error(error);
  }
  return data;
}

/** A form-action for saving (creating or updating) some shift. */
export async function saveShiftAction(
  formState: ActionStateData,
  formData: FormData,
): Promise<ActionStateData> {
  // parse the form data
  const payload = Object.fromEntries(formData.entries()) as Partial<ShiftData>;
  const { id, ...values } = payload;

  if (formState.mode === 'update' && !id) {
    return Object.assign(formState, {
      status: 'error',
      error: 'No shift ID provided for update action.',
    });
  }

  if (!id || formState.mode === 'create') {
    // create a new shift
    const data = await createShift(values);
    return Object.assign(formState, { data, status: 'success' });
  } else {
    // update an existing shift
    const data = await upsertShift({ id, ...values });
    return Object.assign(formState, { data, status: 'success' });
  }
}
