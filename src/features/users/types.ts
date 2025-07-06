

/** this type defines the standard `params` and `searchParams` for a page or route */
export type UserProfileLinkParams = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ view?: string, userId?: string }>;
};


export type UserIdVariants = "userId" | "uid" | "user_id";

export type ProfileIdentifiers = {
  email?: string | null;
  username?: string | null;
} & {
  [key in UserIdVariants]?: string | null;
};