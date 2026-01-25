/**
 * Created At: 2025.07.17:07:49:10
 * @author - @FL03
 * @file - props.ts
 */

export type WithUsername<T = {}> = T & { username: string };

export type WithUserId<T = {}> = T & { userId: string };

/** this type defines the standard `params` and `searchParams` for a page or route */
export type UserProfileLinkParams = {
  params: Promise<WithUsername>;
  searchParams: Promise<Partial<WithUserId<{ view: string }>>>;
};

export type UserIdVariants = "userId" | "uid" | "user_id";

export type WithUserIds<T = {}> =
  & T
  & {
    [key in UserIdVariants]?: string;
  };

export type ProfileIdentifiers = WithUserIds<
  { email?: string; username?: string }
>;
