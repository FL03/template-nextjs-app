/**
 * Created At: 2025-04-13:15:23:36
 * @author - @FL03
 * @file - consts.ts
 */
import { logger } from '@/lib/logger';

/** A convenience method for fetching the `SUPABASE_URL` environment variable. */
export const supabaseUrl = (): string => {
  const value = process.env['NEXT_PUBLIC_SUPABASE_URL'];
  // handle the case where no value was found
  if (!value) {
    // log an error if the url is not set
    logger.error('Missing Supabase URL');
    // then throw an error
    throw new Error('Missing Supabase URL');
  }
  // return the parsed value
  return value.trim();
};

/** A convenience method for fetcheing the `SUPABASE_ANON_KEY` variable */
export const supabaseKey = (): string => {
  const value = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  // handle the case where no value was found
  if (!value) {
    // otherwise, log an error
    logger.error('Missing Supabase Anon Key');
    // then throw an error
    throw new Error('Missing Supabase Anon Key');
  }
  // return the parsed value
  return value.trim();
};

export const supabaseCreds = () => ({
  anonKey: supabaseKey(),
  url: supabaseUrl(),
});
