/**
 * Created At: 2025.08.08:18:23:32
 * @author - @FL03
 * @file - auth/route.ts
 */
import { NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions
import { createServerClient } from '@/lib/supabase';
import { logger } from '@/lib/logger';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code')?.toString();
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(`${origin}/error?message=auth-code-missing`);
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
  const isLocalEnv = process.env.NODE_ENV === 'development';
  if (isLocalEnv) {
    // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
    return NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    return NextResponse.redirect(`${origin}${next}`);
  }
}
