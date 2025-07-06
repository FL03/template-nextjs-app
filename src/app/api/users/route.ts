/**
 * Created At: 2025-04-09:18:59:43
 * @author - @FL03
 * @file - route.ts
 */
'use server';
// imports
import { NextRequest, NextResponse } from 'next/server';
// project
import { logger } from '@/lib/logger';
import { createServerClient } from '@/lib/supabase';

export const GET = async ({ url }: NextRequest) => {
  // initialize the supabase client
  const supabase = await createServerClient<any, "public">();

  const { searchParams } = new URL(url);
  const username = searchParams.get('username');
  const userId = searchParams.get('uid') ?? searchParams.get('userId') ?? searchParams.get('user_id');

  let query = supabase.from('profiles').select('*', { count: 'estimated' });

  if (username) {
    query = query.eq('username', username);
  }

  if (userId) {
    query = query.eq('id', userId);
  }

  const { data, error } = (userId || username) ? await query.single() : await query;

  if (error) {
    logger.error(error, 'Error querying the database...');
    throw new Error(error.message);
  }
  if (!data) {
    logger.warn({ username, userId }, 'No data found for the given username or userId...');
    return NextResponse.json({ message: 'No data found' }, { status: 404 });
  }
  
  return NextResponse.json(data, { status: 200 });
};
