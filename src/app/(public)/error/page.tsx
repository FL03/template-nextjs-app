/**
 * Created At: 2025.05.02:23:10:22
 * @author - @FL03
 * @file - error/page.tsx
 */
"use server";
// imports
import { ErrorCard } from "@/features/platform";

type RoutePropsT = {
  searchParams: Promise<{ message?: string; status?: string | number }>;
};

export default async function Page({ searchParams }: RoutePropsT) {
  // await for the search parameters before destructuring
  let { message, status = 500 } = await searchParams;
  // ensure message is a string
  message ??= "An unexpected error occurred";
  // set the default status if not provided
  status ??= 500;
  // render the error page
  return (
    <div className="flex flex-1 h-full w-full items-center justify-center">
      <ErrorCard
        message={message ?? "Something went wrong..."}
        status={status}
      />
    </div>
  );
}
Page.displayName = "ErrorPage";

// page metadata
export async function generateMetadata(
  { searchParams }: RoutePropsT,
  parent: import("next").ResolvingMetadata,
) {
  let { message, status } = await searchParams;
  // ensure message is a string
  message ??= "An unexpected error occurred";
  // set the default status if not provided
  status ??= 500;
  const parentMetadata = await parent;

  return {
    ...parentMetadata,
    description: `An error (${status}) occurred while processing your request`,
    title: "Error",
  };
}
