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
import type { ShiftData } from '@/features/shifts';
// types
import type { Database } from '@/types/database.types';
import type { ApiResponse } from '@/types';

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<ShiftData | null>> {
  // initialize a supabase client
  const supabase = await createServerClient<Database, 'rms'>('rms');
  // handle the request
  const { pathname, searchParams } = new URL(req.url);
  // extract the url params
  const id = pathname.split('/').pop();
  logger.info(`Fetching the data for the shift with an id of ${id}`);

  if (!id) {
    return NextResponse.json(
      { error: 'No ID provided', data: null },
      { status: 400 },
    );
  }

  // define the query
  let query = supabase.from('shifts').select();

  if (id) {
    query = query.eq('id', id);
  }
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

export async function DELETE(
  req: NextRequest,
): Promise<ApiResponse<ShiftData | null>> {
  // initialize a supabase client
  const supabase = await createServerClient<Database, 'rms'>('rms');
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
  let query = supabase.from('shifts').delete({ count: 'exact' }).eq('id', id);

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

export async function POST(
  req: NextRequest,
): Promise<ApiResponse<ShiftData | null>> {
  const supabase = await createServerClient<Database, 'rms'>('rms');
  // handle the request
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop()?.toString();
  if (!id) {
    logger.error('No shift ID provided');
    return NextResponse.json(
      {
        data: null,
        error: 'Cannot update a shift without its associated identifier.',
      },
      {
        status: 400,
      },
    );
  }
  // get the body of the request
  const payload = await req.json();
  const {
    organization_id,
    assignee,
    date,
    tips_cash,
    tips_credit,
    status,
    attachments,
    clocked_in,
    clocked_out,
    start_at,
    ends_at,
  } = payload as Partial<ShiftData>;

  // Validation
  if (!organization_id) {
    logger.warn('No organization ID provided');
  }
  if (!date || isNaN(Date.parse(date))) {
    logger.error('A valid date is required');
    return NextResponse.json(
      { data: null, error: 'A valid date is required' },
      {
        status: 400,
      },
    );
  }
  // update the data
  const { data, error } = await supabase
    .from('shifts')
    .upsert(
      {
        id,
        organization_id,
        assignee,
        date,
        tips_cash,
        tips_credit,
        status,
        attachments,
        clocked_in,
        clocked_out,
        start_at,
        ends_at,
      },
      { onConflict: 'id' },
    )
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error(error, error.message);
    return NextResponse.json(
      { data: null, error: error.message },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({ data, error }, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
): Promise<ApiResponse<ShiftData | null>> {
  const supabase = await createServerClient<Database, 'rms'>('rms');
  // handle the request
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop()?.toString();
  // ensure an id was provided in the url
  if (!id) {
    return NextResponse.json(
      {
        data: null,
        error: 'Cannot update a shift without its associated identifier.',
      },
      {
        status: 400,
      },
    );
  }
  // load & parse the body of the request
  const payload = await req.json();
  const { ...values } = payload as Partial<ShiftData>;
  // update the data
  const { data, error } = await supabase
    .from('shifts')
    .update({ id, ...values })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    logger.error(error, error.message);
    return NextResponse.json(
      { data: null, error: error.message },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({ data, error }, { status: 200 });
}
