/**
 * Created At: 2025-04-03:18:53:23
 * @author - @FL03
 * @endpoint - /api/notifications/[id]
 * @file - route.ts
 */
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
// project
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase';
// types
import type {
  NotificationData,
  NotificationUpdate,
} from '@/features/notifications';
import type { ApiResponse } from '@/types';
import type { Database } from '@/types/database.types';

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<NotificationData | null>> {
  const supabase = await createServerClient<Database, 'account'>('account');
  // parse the request url
  const { pathname } = new URL(req.url);
  // extract the id from the pathname
  const id = pathname.split('/').pop();
  // ensure an id is provided
  if (!id) {
    // return an empty array if no identifier is provided
    return NextResponse.json(
      {
        error: 'Unable to fetch a notification without its unique identifier.',
        data: null,
      },
      { status: 400 },
    );
  }
  // execute the query
  const { data, error } = await supabase
    .from('notifications')
    .select()
    .eq('id', id)
    .single();
  // handle any errors
  if (error) {
    logger.error(
      error,
      'An unexpected error occurred when fetching the notification from the database: ' +
        error.message,
    );
    return NextResponse.json({ error: error.message, data }, { status: 500 });
  }
  return NextResponse.json({ data, error }, { status: 200 });
}

export async function DELETE(
  req: NextRequest,
): Promise<ApiResponse<NotificationData | null>> {
  const supabase = await createServerClient<Database, 'account'>('account');
  const { pathname } = new URL(req.url);
  // extract the id from the pathname
  const id = pathname.split('/').pop();
  // handle the case where the username is present
  if (!id) {
    // log the error
    logger.error('No id passed to the api');
    // return a 400 error response
    return NextResponse.json(
      { data: null, error: 'no id passed to the api' },
      { status: 400 },
    );
  }
  // delete notifications for the user
  const { data, error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ data, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data, error }, { status: 200 });
}

export async function POST(
  req: NextRequest,
): Promise<ApiResponse<NotificationData | null>> {
  const supabase = await createServerClient<Database, 'account'>('account');
  // handle the request
  const { pathname } = new URL(req.url);
  // extract the id from the pathname
  const id = pathname.split('/').pop();
  // handle the case where the username is present
  if (!id) {
    // log the error
    logger.error('No id passed to the api');
    // return a 400 error response
    return NextResponse.json(
      { data: null, error: 'no id passed to the api' },
      { status: 400 },
    );
  }
  const { status = 'unread' } = (await req.json()) as Partial<NotificationData>;
  // delete notifications for the user
  const { data, error } = await supabase
    .from('notifications')
    .update({
      status,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ data, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data, error }, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
): Promise<ApiResponse<NotificationData | null>> {
  const supabase = await createServerClient<Database, 'account'>('account');
  // handle the request
  const { pathname } = new URL(req.url);
  // extract the id from the pathname
  const id = pathname.split('/').pop();
  // handle the case where the username is present
  if (!id) {
    // log the error
    logger.error('No id passed to the api');
    // return a 400 error response
    return NextResponse.json(
      { data: null, error: 'no id passed to the api' },
      { status: 400 },
    );
  }
  const payload = (await req.json()) as NotificationUpdate;
  // delete notifications for the user
  const { data, error } = await supabase
    .from('notifications')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ data, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data, error }, { status: 200 });
}
