/**
 * Created At: 2025.10.03:21:28:58
 * @author - @FL03
 * @directory - src/features/orgs
 * @file - types.ts
 */
import type { Tables } from '@/types/database.types';

export type OrganizationData = Tables['orgs']['organizations']['Row'];

export type OrganizationInsert = Tables['orgs']['organizations']['Insert'];

export type OrganizationUpdate = Tables['orgs']['organizations']['Update'];

export type OrganizationUpsert = Omit<Partial<OrganizationData>, 'id'> & {
  id: string;
};

/** A type defining the Member object in the database. */
export type MemberData = Tables['orgs']['members']['Row'];

export type MemberInsert = Tables['orgs']['members']['Insert'];

export type MemberUpdate = Tables['orgs']['members']['Update'];

export type MemberRecord = MemberData | MemberInsert | MemberUpdate;
