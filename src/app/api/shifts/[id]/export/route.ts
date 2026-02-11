/**
 * Created At: 2025.10.25:14:10:01
 * @author - @FL03
 * @directory - src/app/api/shifts/[id]/export
 * @file - route.ts
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

// the export pipeline for a shift
export async function GET(
  req: NextRequest,
): Promise<ApiResponse<ShiftData | null>> {
  // initialize a supabase client
  const supabase = await createServerClient<Database, 'rms'>('rms');
  // handle the request
  const { pathname } = new URL(req.url);
  // extract the url params
  const id = pathname.split('/').pop();

  if (!id) {
    logger.error('No ID provided');
    return NextResponse.json(
      { error: 'No ID provided', data: null },
      { status: 400 },
    );
  }
  logger.info({ id }, 'Fetching shift data...');

  // define & execute the query on the database
  const { data, error } = await supabase
    .from('shifts')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ error: error.message, data }, { status: 500 });
  }
  logger.info(
    { id },
    'Shift data fetched successfully; preparing to export...',
  );

  return NextResponse.json({ data, error: null }, { status: 200 });
}
