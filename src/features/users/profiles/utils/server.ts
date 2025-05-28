/**
 * Created At: 2025.05.16:07:51:26
 * @author - @FL03
 * @file - server.ts
 */
'use server';
// project
import { logger } from '@/lib/logger';
import { createServerClient, getUsername } from '@/lib/supabase';
// feature-specific
import { userBucketPath } from '../constants';

type NewUserBucketOptions = {
  allowedMimeTypes?: string[];
  public: boolean;
  fileSizeLimit?: number;
}
export const createNewUserBucket = async (username: string, options: NewUserBucketOptions = { public: false, fileSizeLimit: 1024 * 1024 * 10 }) => {
  const supabase = await createServerClient();
  logger.warn('User bucket does not exist; creating a new one...');
  const { data, error } = await supabase.storage.createBucket(userBucketPath({ params: { username } }), options);

  if (error) {
    logger.error('Error creating user bucket:', error.message);
    throw new Error(error.message);
  }
  logger.info('successfully created a new root bucket for the user:', data.name);
  return data;
}

export const fetchUserProfileAvatar = async (
  username: string
): Promise<File | null> => {
  const supabase = await createServerClient();
  // fetch the user
  const { data: profileData, error: dbError } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('username', username)
    .single();

  if (dbError) {
    logger.error(
      'Error fetching the users profile avatar:', dbError.message
    );
    throw new Error(dbError.message);
  }
  // destructure thje avatar_url from the profile data
  const { avatar_url } = profileData;
  if (!avatar_url) {
    logger.warn('No avatar url found for the user...');
    return null;
  }
  // fetch the avatar from the bucket
  const { data: downloadData, error: downloadError } = await supabase.storage
    .from('avatars')
    .download(avatar_url);

  if (downloadError) {
    logger.error(
      { error: downloadError.message },
      'Unable to fetch the users avatar from the bucket...'
    );
    throw new Error(downloadError.message);
  }
  // convert the blob to a file
  const blob = new Blob([downloadData], { type: downloadData.type });
  const file = new File(
    [blob],
    `${username}.${downloadData.type.split('/')[1]}`,
    {
      type: downloadData.type,
    }
  );
  return file;
};
/**
 * Upload the file to the corresponding bucket and update the user's profile
 * 
 * @param {File} file - The file to upload
 */
export const uploadAvatar = async (file?: File | null) => {
  const root = 'avatars';
  if (!file) return null;

  const supabase = await createServerClient();
  // fetch the user
  const username = await getUsername({ client: supabase, ssr: true });

  if (!username) {
    throw new Error('Error uploading avatar: user not found');
  }
  // name the bucket after the using the username
  const bucket = `${root}/${username}`;
  /// rename the file to username.extension
  const fname = `${username}.${file.name.split('.').pop()}`;
  // if the user doesn't have a bucket, create one
  if (!supabase.storage.from(root).exists(username)) {
    // create the object if one does not exist
    await createNewUserBucket(username, {
      public: true,
    });
  }
  // upload the file to the bucket
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fname, file, { upsert: true });
  // throw an error if the upload fails
  if (error) {
    logger.error(
      'Unable to upload the users avatar to the bucket...',
      error.message
    );
    throw new Error(error.message);
  }
  // get the public URL of the uploaded file
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(fname);
  // update the user's profile with the new avatar URL
  const { error: dbError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('username', username);
  // throw an error if the update fails
  if (dbError) {
    logger.error(
      'Error updating the user profile with the new avatar...',

      dbError.message,
    );
    throw new Error(dbError.message);
  }
  // return the URL
  return publicUrl;
};
