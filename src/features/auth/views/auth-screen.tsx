/**
 * Created At: 2025.07.26:13:57:45
 * @author - @FL03
 * @file - auth-gate.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
// local
import { AuthGate } from "../widgets/auth-gate";
import { AuthView } from "../types";

type ViewPropsT = {
  view?: string | AuthView;
  centered?: boolean;
};
/**
 * AuthGate component
 * @description - The AuthGate component is a wrapper for the authentication forms. It provides a layout for the forms and handles the logic for displaying the correct form based on the view prop.
 */
export const AuthScreen: React.FC<
  Omit<React.ComponentPropsWithRef<"div">, "children"> & ViewPropsT
> = ({
  ref,
  centered,
  view = "login",
  ...props
}) => {
  // get a reference to the isMobile hook
  const isMobile = useIsMobile();
  // returns true if the view is centered or on mobile
  const isCentered = centered ?? isMobile;
  // render the component
  return (
    <div
      ref={ref}
      className={cn(
        "relative z-auto flex flex-1 flex-nowrap h-full w-full items-center",
        isCentered ? "justify-center" : "justify-end",
      )}
    >
      <AuthGate {...props} withTurnstile view={view} />
    </div>
  );
};
AuthGate.displayName = "AuthGate";
