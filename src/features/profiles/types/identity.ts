/**
 * Created At: 2025.07.17:07:49:10
 * @author - @FL03
 * @file - props.ts
 */

export type WithUsername = { username: string };

export type WithUserId = { userId: string };

/** this type defines the standard `params` and `searchParams` for a page or route */
export type UserProfileLinkParams = {
  params: Promise<WithUsername>;
  searchParams: Promise<{ view?: string } & Partial<WithUserId>>;
};

export type UserIdVariants = "userId" | "uid" | "user_id";

export type ProfileIdentifiers =
  & {
    email?: string | null;
    username?: string | null;
  }
  & {
    [key in UserIdVariants]?: string | null;
  };
