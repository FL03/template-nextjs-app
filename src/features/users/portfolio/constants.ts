import { ROOT_USER_BUCKET } from "@/features/users/profiles";

export const VAULT_BUCKET_BASEPATH = 'vault';

type BucketPathParams = {
  username: string;
}

type Options = {
  params: BucketPathParams;
  path?: string | string[]
}

export const vaultBucketPath = ({ path, params }: Options) => {
  // deconstruct the necessary params for the path
  const { username } = params;
  // construct the base path: /users/{username}/vault
  const basepath = [ROOT_USER_BUCKET, username, VAULT_BUCKET_BASEPATH].join('/');
  // return the basepath if no other path(s) are provided
  if (!path) {
    return basepath;
  }
  // ensure the path is an array
  if (typeof path === 'string') {
    path = [path];
  }
  // construct the path: /users/{username}/vault/{path}
  return [basepath, ...path].join('/');
}