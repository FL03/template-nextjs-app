export const ROOT_USER_BUCKET = 'users';

export const baseUserEndpoint = (username: string, ...path: string[]) => {
  return [username, ...path].join('/');
}


type BucketPathOptions = {
  params: { username: string };
  path?: string | string[];
}

/** 
 * this method is used to help construct a path to some user's bucket.
 * 
 * @param {BucketPathOptions} options - the username of the user
 */
export const userBucketPath = ({ params, path }: BucketPathOptions): string => {
  // deconstruct the necessary params for the path
  const { username } = params;
  // construct the base path: /users/{username}
  const baseBucket = [ROOT_USER_BUCKET, username].join('/');
  // return the basepath if no other path(s) are provided
  if (!path) {
    return baseBucket;
  }
  // ensure the path is an array
  if (typeof path === 'string') {
    path = [path];
  }
  return [baseBucket, ...path].join('/');
}