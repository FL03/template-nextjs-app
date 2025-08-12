/**
 * Created At: 2025.05.12:23:20:32
 * @author - @FL03
 * @file - loading.tsx
 */
// imports
import { LoadingScaffold, Spinner } from "@/components/common/loaders";

/**
 * The `Loading` page for the platform.
 */
export default function Loading() {
  return (
    <LoadingScaffold>
      <Spinner showLabel className="m-auto" />
    </LoadingScaffold>
  );
}
Loading.displayName = "LoadingPage";

