/**
 * Created At: 2025-04-09:18:50:51
 * @author - @FL03
 * @file - client.ts
 */
// project
import { logger } from '@/lib/logger';
// feature-specific
import { ProfileData, ProfileInsert, ProfileUpdate } from '../types';

const ENDPOINT = '/api/profiles';

const profileEndpoint = (path?: string, params?: { queryBy?: string }) => {
  let value = path ? `${ENDPOINT}/${path}` : ENDPOINT;
  if (params?.queryBy) {
    value += `?queryBy=${params.queryBy}`;
  }
  return value;
};

/** Fetch the user profile from the database using the dedicated api.  */
export const getUserProfile = async (
  {
    userId,
    username,
  }: {
    userId?: string;
    username?: string;
  } = {},
  init?: Omit<RequestInit, 'method'>,
): Promise<ProfileData | null> => {
  if (!userId && !username) {
    logger.error('No userId or username provided to fetch the user profile...');
    return null;
  }
  const endpoint = profileEndpoint(userId ?? username, {
    queryBy: userId ? 'id' : 'username',
  });
  // fetch the data
  const res = await fetch(endpoint, {
    ...init,
    method: 'GET',
    headers: { ...init?.headers, 'Content-Type': 'application/json' },
  });
  // handle any response errors
  if (!res.ok) {
    logger.error(res, 'Failed to fetch data from the database...');
    return null;
  }
  // parse json
  const { data, error } = await res.json();
  if (error) {
    const err = new Error(String(error));
    logger.error(err, err.message);
    throw err;
  }
  // return the data or default to null
  return data ?? null;
};

export const deleteUserProfile = async (
  { userId, username }: { userId?: string; username?: string } = {},
  init?: Omit<RequestInit, 'method'>,
): Promise<ProfileData | null> => {
  let id: string | null = userId ?? username ?? null;
  const queryBy = userId ? 'id' : 'username';
  if (!id) {
    logger.error(
      'No userId or username provided to delete the user profile...',
    );
    throw new Error(
      'No userId or username provided to delete the user profile...',
    );
  }
  const res = await fetch(profileEndpoint(id, { queryBy }), {
    method: 'DELETE',
    headers: { ...init?.headers, 'Content-Type': 'application/json' },
    ...init,
  });

  const { data, error } = await res.json();
  if (error) {
    const err = new Error(String(error));
    logger.error(err, err.message);
    throw err;
  }
  return data ?? null;
};
/** A client-side method for saving a user profile */
export const upsertUserProfile = async (
  values?: ProfileInsert | ProfileUpdate,
  init?: Omit<RequestInit, 'method' | 'body'>,
) => {
  const res = await fetch(profileEndpoint(values?.id), {
    ...init,
    method: 'POST',
    body: values ? JSON.stringify(values) : undefined,
    headers: { ...init?.headers, 'Content-Type': 'application/json' },
  });
  const { data, error } = await res.json();
  if (error) {
    const err = new Error(String(error));
    logger.error(err, err.message);
    throw err;
  }
  return data ?? null;
};

/** A client-side method for saving a user profile */
export const updateUserProfile = async (
  values?: ProfileUpdate,
  init?: Omit<RequestInit, 'method' | 'body'>,
) => {
  const res = await fetch(ENDPOINT, {
    ...init,
    method: 'PATCH',
    body: values ? JSON.stringify(values) : undefined,
    headers: { ...init?.headers, 'Content-Type': 'application/json' },
  });
  const { data, error } = await res.json();
  if (error) {
    const err = new Error(String(error));
    logger.error(err, err.message);
    throw err;
  }
  return data ?? null;
};

/** A client-side method for saving a user profile */
export const createUserProfile = async (
  values?: ProfileInsert | ProfileUpdate,
  init?: Omit<RequestInit, 'method' | 'body'>,
) => {
  const res = await fetch(ENDPOINT, {
    ...init,
    method: 'POST',
    body: values ? JSON.stringify(values) : undefined,
    headers: { ...init?.headers, 'Content-Type': 'application/json' },
  });
  const { data, error } = await res.json();
  if (error) {
    const err = new Error(String(error));
    logger.error(err, err.message);
    throw err;
  }
  return data ?? null;
};

export const updateUsername = async (
  username: string,
): Promise<string | null> => {
  const res = await updateUserProfile({
    username,
  });
  return res?.username ?? '';
};
