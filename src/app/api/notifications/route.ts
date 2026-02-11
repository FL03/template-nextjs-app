/**
 * Created At: 2025.09.23:15:54:56
 * @author - @FL03
 * @endpoint - /api/notifications
 * @file - route.ts
 */
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
// project
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase';
// types
import type { NotificationData } from '@/features/notifications';
import type { ApiResponse } from '@/types';
import type { Database } from '@/types/database.types';

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<NotificationData[]>> {
  // initialize the supabase client
  const supabase = await createServerClient<Database, 'account'>('account');
  // parse the request url
  const { searchParams } = new URL(req.url);
  // extract the search parameters
  const limit = searchParams.get('limit')?.toString();
  const sortBy = searchParams.get('sortBy')?.toString();
  const filterBy = searchParams.get('filterBy')?.toString();
  // initialize the query
  let query = supabase.from('notifications').select('*', {
    count: 'estimated',
  });

  if (limit) {
    query = query.limit(limit === 'all' ? 1000 : parseInt(limit, 10));
  }
  if (filterBy) {
    const [column, value] = filterBy.split(':');
    query = query.eq(column, value);
  }
  if (sortBy) {
    const [column, order] = sortBy.split(':');
    query = query.order(column, { ascending: order === 'asc' });
  }

  const { data, error } = await query;

  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ data: null, error }, { status: 400 });
  }

  return NextResponse.json({ data: data ?? [], error: null }, { status: 200 });
}
