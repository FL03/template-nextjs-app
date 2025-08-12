/**
 * Created At: 2025.05.12:23:20:32
 * @author - @FL03
 * @file - loading.tsx
 */
"use server";
// imports
import { LoadingScaffold, Spinner } from "@/components/common/loaders";

/**
 * The `Loading` page for the platform.
 */
async function Loading() {
  return (
    <LoadingScaffold>
      <Spinner showLabel className="m-auto" />
    </LoadingScaffold>
  );
}
Loading.displayName = "LoadingPage";

export default Loading;
