/**
 * Created At: 2025.09.11:16:13:27
 * @author - @FL03
 * @file - route.ts
 * @endpoint - /api/shifts/[id]
 */
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { logger } from '@/lib/logger';
// types
import type { MemberData } from '@/features/orgs';
import type { Database } from '@/types/database.types';
import type { ApiResponse } from '@/types';

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<MemberData | null>> {
  // initialize a supabase client
  const supabase = await createServerClient<Database, 'orgs'>('orgs');
  // deconstruct the parsed url
  const { pathname, searchParams } = new URL(req.url);
  // extract the necessary query params
  const username = searchParams.get('username');
  const id = pathname.split('/').pop();

  if (!id) {
    return NextResponse.json(
      { error: 'No ID provided', data: null },
      { status: 400 },
    );
  }

  // define the query
  let query = supabase.from('members').select();

  if (id) {
    query = query.eq('id', id);
  }

  if (username) {
    query = query.eq('assignee', username);
  }

  logger.info(`Fetching the data for the shift with an id of ${id}`);
  // execute the query
  const { data, error } = await query.single();

  if (error) {
    logger.error(error.message);
    return NextResponse.json(
      { error: error.message, data: null },
      { status: 500 },
    );
  }
  return NextResponse.json({ data, error }, { status: 200 });
}

/** The `DELETE` method employees */
export async function DELETE(
  req: NextRequest,
): Promise<ApiResponse<MemberData>> {
  // initialize a supabase client
  const supabase = await createServerClient<Database, 'orgs'>('orgs');
  // deconstruct the parsed url
  const { pathname, searchParams } = new URL(req.url);
  // extract the necessary query params
  const username = searchParams.get('username');
  const id = pathname.split('/').pop();
  logger.info(`Fetching the data for the shift with an id of ${id}`);

  if (!id) {
    return NextResponse.json(
      { error: 'No ID provided', data: null },
      { status: 400 },
    );
  }

  // define the query
  let query = supabase.from('members').delete({ count: 'exact' });

  if (id) {
    query = query.eq('id', id);
  }

  if (username) {
    query = query.eq('assignee', username);
  }
  // execute the query
  const { data, error } = await query.select().single();

  if (error) {
    logger.error(error.message);
    return NextResponse.json(
      { error: error.message, data: null },
      { status: 500 },
    );
  }
  return NextResponse.json({ data, error }, { status: 200 });
}
