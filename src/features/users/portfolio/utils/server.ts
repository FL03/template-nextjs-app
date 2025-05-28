/**
 * Created At: 2025.05.16:07:40:33
 * @author - @FL03
 * @file - server.ts
 */
'use server';
// project
import { userBucketPath } from "@/features/users/profiles";
import { logger } from "@/lib/logger";
import { createServerClient } from "@/lib/supabase";



/** Creates a new vault bin for storing related records with object storage */
export const createVaultForUser = async (username: string) => {
  const supabase = await createServerClient();
  logger.warn('User bucket does not exist; creating a new one...');
  const { data, error } = await supabase.storage.createBucket(userBucketPath({ params: { username }, path: 'vault' }), {
    public: false,
    fileSizeLimit: 1024 * 1024 * 10,
  });

  if (error) {
    logger.error('Error creating user bucket:', error.message);
    throw new Error(error.message);
  }
  logger.info('successfully created a new root bucket for the user:', data.name);
  return data;
}