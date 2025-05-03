/*
  Appellation: route <(user)>
  Contrib: @FL03
*/
'use server';
// imports
import { redirect } from 'next/navigation';
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase';

/**
 * `GET` request reroutes to the user's profile page
 * @param request: NextRequest
 */
export const GET = async () => {
  const supabase = await createServerClient();
  const { data: username, error } = await supabase.rpc('username');

  if (error) {
    logger.error(`Error fetching username: ${error.message}`);
    throw new Error(error.message);
  }

  if (!username) {
    logger.warn('No username found; redirecting to login page...');
    return redirect('/auth/register');
  }
  logger.trace(`Redirecting to the admin dashboard`);
  redirect(`/admin/${username}?view=dashboard`);
};
