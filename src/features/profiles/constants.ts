/**
 * Created At: 2025.07.15:11:40:29
 * @author - @FL03
 * @file - profiles/constants.ts
 */

/** The root bucket for users to manage */
export const ROOT_USER_BUCKET = "users";

type BucketPathOptions = {
  path?: string;
  params: { userId: string };
};

/**
 * this method is used to help construct a path to some user's bucket.
 *
 * @param {BucketPathOptions} options - the username of the user
 */
export const userBucketPath = ({ params, path }: BucketPathOptions): string => {
  // deconstruct the necessary params for the path
  const { userId } = params;
  // construct the base path: /users/{userId}
  const baseBucket = `/${ROOT_USER_BUCKET}/${userId}`;
  // return the basepath if no other path(s) are provided
  if (!path) return baseBucket;
  else return [baseBucket, path].join("/");
};
