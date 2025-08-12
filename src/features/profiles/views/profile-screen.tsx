/**
 * Created At: 2025.07.22:11:13:37
 * @author - @FL03
 * @file - profile-screen.tsx
 */
"use client";
// imports
import * as React from "react";
import dynamic from "next/dynamic";

type ScreenProps = {
  view?: string;
  asChild?: boolean;
};

/** The `UserProfileScreen` component is a dynamic display capable of rendering the profile dashboard or the details view, depending upon the passed parameters. */
export const UserProfileScreen: React.FC<ScreenProps> = ({
  view = "dashboard",
}) => {
  // a functional render method that resolves the view to be displayed
  // based on the view prop passed to the component
  const renderView = () => {
    switch (view) {
      case "details":
        return dynamic(async () => await import("../widgets/profile-details"), {
          ssr: false,
        });
      default:
        return dynamic(
          async () =>
            await import("../widgets/dashboard").then((mod) =>
              mod.ProfileDashboard
            ),
          {
            ssr: false,
          },
        );
    }
  };
  // resolve the component to be rendered based on the `view` prop
  const Comp = renderView();
  // render the view
  return <Comp />;
};
UserProfileScreen.displayName = "ProfileScreen";

export default UserProfileScreen;
