

/** this type defines the standard `params` and `searchParams` for a page or route */
export type UserProfileLinkParams = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ view?: string, userId?: string }>;
};


