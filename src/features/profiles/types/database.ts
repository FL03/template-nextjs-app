/**
 * Created At: 2025.07.17:07:49:16
 * @author - @FL03
 * @file - types/database.ts
 */
import { Database, PublicTables } from '@/types/database.types';

export const profileTable = {
  name: 'profiles',
  schema: 'public',
};
/** A database-compatible object for the profiles table */
export type ProfileData = PublicTables<'profiles'>;
/** A database-compatible object for inserting into the profiles table */
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
/** A database-compatible object for updating entries within the profiles table */
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
/** A generic type alias for database-compatible entries for the profiles table */
export type Profile = ProfileData | ProfileInsert | ProfileUpdate;



