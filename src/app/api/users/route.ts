/**
 * Created At: 2025.09.25:22:24:12
 * @author - @FL03
 * @endpoint - /api/profiles
 * @file - route.ts
 */
'use server';
import { NextRequest, NextResponse } from 'next/server';
// project
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase';
// types
import type { ProfileData } from '@/features/profiles';
import type { ApiResponse } from '@/types';

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<ProfileData[]>> {
  // initialize the supabase client
  const supabase = await createServerClient();
  // parse the request url
  const { searchParams } = new URL(req.url);
  // extract the search parameters
  const limit = searchParams.get('limit')?.toString();
  const sortBy = searchParams.get('sortBy')?.toString();
  const filterBy = searchParams.get('filterBy')?.toString();
  // initialize the query
  let query = supabase.from('profiles').select('*', { count: 'estimated' });

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
    return NextResponse.json({ data, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data: data ?? [], error }, { status: 200 });
}
