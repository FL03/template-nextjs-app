/**
 * Created At: 2025-04-04:18:05:28
 * @author - @FL03
 * @description - the root auth route handler
 * @file - route.ts
 */
'use server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
// project
import { getDefaultSignInView } from '@/lib/supabase';

export const GET = async (req: NextRequest) => {
  const cookieStore = await cookies();
  const preferredSignInView = cookieStore.get('preferredSignInView')?.value;
  const defaultView = getDefaultSignInView(preferredSignInView || null);
  // redirect to the default view
  redirect(`/auth/${defaultView}`);
};

export const POST = async (req: NextRequest) => {
  const origin = new URL(req.url);
  const view = origin.searchParams.get('view') || 'login';

  if (view === 'signup') {
    return redirect(`/auth/register`);
  }
  redirect(`/auth/${view}`);
}