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
import type { OrganizationData } from '@/features/orgs';
import type { ApiResponse } from '@/types';
import type { Database } from '@/types/database.types';

export async function GET(
  req: NextRequest,
): Promise<ApiResponse<OrganizationData[]>> {
  const supabase = await createServerClient<Database, 'orgs'>('orgs');
  // handle the request
  const { searchParams } = new URL(req.url);
  // define the query
  let query = supabase.from('organizations').select();
  // extract the params
  const { limit, filterBy, sortBy } = {
    limit: searchParams.get('limit')?.toString(),
    filterBy: searchParams.get('filterBy')?.toString(),
    sortBy: searchParams.get('sortBy')?.toString(),
  };
  if (limit && (limit !== 'all' || !isNaN(parseInt(limit, 10)))) {
    query = query.limit(parseInt(limit, 10));
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
    return NextResponse.json({ data, error }, { status: 400 });
  }

  return NextResponse.json({ data, error }, { status: 200 });
}

export async function POST(
  req: NextRequest,
): Promise<ApiResponse<OrganizationData | null>> {
  const supabase = await createServerClient<Database, 'orgs'>('orgs');
  // handle the request
  const { name, description, id } = await req.json();

  const { data, error } = await supabase
    .from('organizations')
    .insert({
      id,
      name,
      description,
    })
    .select()
    .single();
  // handle any errors
  if (error) {
    logger.error(error, error.message);
    return NextResponse.json({ error: error.message, data }, { status: 400 });
  }
  // return the response
  return NextResponse.json({ data, error }, { status: 200 });
}
