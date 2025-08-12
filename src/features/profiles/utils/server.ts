/**
 * Created At: 2025.05.16:07:51:26
 * @author - @FL03
 * @file - server.ts
 */
"use server";
// project
import { logger } from "@/lib/logger";
import { createServerClient, getUsername } from "@/lib/supabase";
import { Database } from "@/types/database.types";

type NewUserBucketOptions = {
  allowedMimeTypes?: string[];
  basePath?: string;
  public: boolean;
  fileSizeLimit?: number;
};

/**
 * A callback for creating a new bucket for a user
 */
export const createUserBucket = async (
  username: string,
  { basePath, ...options }: NewUserBucketOptions = {
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif"],
    basePath: "users",
    public: false,
    fileSizeLimit: 1024 * 1024 * 10,
  },
) => {
  // create the path to the user's bucket
  const path = [basePath, username].filter(Boolean).join("/");
  // initialize the supabase client
  const supabase = await createServerClient();
  // construct the base path for the bucket
  const { data, error } = await supabase.storage.createBucket(
    path,
    options,
  );
  // handle any errors creating the bucket
  if (error) {
    // throw an error with the message
    throw new Error(error.message);
  }
  // return the data
  return data;
};
/**
 * Load the user's profile avatar from the database and storage bucket
 * @param {string} username - The username of the user whose avatar is being fetched
 * @returns {File} - The user's avatar as a File object, or null if no avatar is found
 */
export const loadProfileAvatar = async (
  username: string,
): Promise<File> => {
  const supabase = await createServerClient();
  // fetch the user
  const { data: profileData, error: dbError } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("username", username)
    .single();
  // handle any errors fetching the profile data
  if (dbError) {
    throw new Error(`Error fetching user profile: ${dbError.message}`);
  }
  // destructure thje avatar_url from the profile data
  const { avatar_url } = profileData;
  if (!avatar_url) {
    throw new Error(`No avatar found for user: ${username}`);
  }
  // fetch the avatar from the bucket
  const { data: downloadData, error: downloadError } = await supabase.storage
    .from("avatars")
    .download(avatar_url);
  // handle any errors downloading the avatar
  if (downloadError) {
    throw new Error(`Error downloading avatar: ${downloadError.message}`);
  }
  // convert the blob to a file
  const blob = new Blob([downloadData], { type: downloadData.type });
  // create a new File object with the blob and the username as the file name
  const file = new File(
    [blob],
    `${username}.${downloadData.type.split("/")[1]}`,
    {
      type: downloadData.type,
    },
  );
  // return the file
  return file;
};

/**
 * Upload the file to the corresponding bucket and update the user's profile
 *
 * @param {File} file - The file to upload
 */
export const uploadAvatar = async (file?: File | null) => {
  const root = "avatars";
  if (!file) return null;

  const supabase = await createServerClient();
  // fetch the user
  const username = await getUsername({ client: supabase });

  if (!username) {
    throw new Error("Error uploading avatar: user not found");
  }
  // name the bucket after the using the username
  const bucket = `${root}/${username}`;
  /// rename the file to username.extension
  const fname = `${username}.${file.name.split(".").pop()}`;
  // if the user doesn't have a bucket, create one
  if (!supabase.storage.from(root).exists(username)) {
    // create the object if one does not exist
    await createUserBucket(username, {
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
      error,
      "Unable to upload the users avatar to the bucket...",
    );
    throw new Error(error.message);
  }
  // get the public URL of the uploaded file
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(fname);
  // update the user's profile with the new avatar URL
  const { error: dbError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("username", username);
  // throw an error if the update fails
  if (dbError) {
    logger.error(
      dbError,
      "Error updating the user profile with the new avatar...",
    );
    throw new Error(dbError.message);
  }
  // return the URL
  return publicUrl;
};

export const updateUsername = async (
  username: string,
): Promise<string> => {
  // initialize the supabase client
  const supabase = await createServerClient<Database, "public">();
  // update the username in the database
  const { data, error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("username", username)
    .select("username")
    .single();
  // handle any errors updating the username
  if (error) {
    logger.error(error, "Error updating the username in the database...");
    return Promise.reject(error.message);
  }
  
  // return the updated username
  return data.username;
};
