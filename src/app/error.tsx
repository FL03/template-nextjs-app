/**
 * Created At: 2025.05.02:23:10:22
 * @author - @FL03
 * @file - error/page.tsx
 */
"use client";
// imports
import * as React from "react";
import type { Metadata } from "next";
// project
import { ErrorCard } from "@/components/common/error";
import { logger } from "@/lib/logger";
import { BackButton } from "@/components/common/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset(): void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    logger.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex flex-1 flex-col h-full w-full">
      <section className="order-first flex flex-nowrap items-center gap-2">
        <BackButton />
      </section>
      <section className="flex flex-1 flex-nowrap items-center justify-center">
        <ErrorCard
          showStatus
          status={error.digest || "500"}
          reset={reset}
        >
          {error.message}
        </ErrorCard>
      </section>
    </div>
  );
}

// page metadata
export const metadata: Metadata = {
  description: "Encountered an error while trying to load this page.",
  title: "Error",
};
