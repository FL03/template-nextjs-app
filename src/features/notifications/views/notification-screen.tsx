/**
 * Created At: 2025-04-09:13:21:52
 * @author - @FL03
 * @file - notification-screen.tsx
 */
"use client";
// imports
import * as React from "react";
import dynamic from "next/dynamic";
// local
import { NotificationProvider } from "../provider";

type ScreenViewProps = {
  className?: string;
  username?: string;
};
// The notification screen component with dynamic import to avoid server-side rendering issues
export const NotificationScreen: React.FC<ScreenViewProps> = (
  { className, username },
) => {
  // dynamically import the component to avoid server-side rendering issues
  const Comp = dynamic(() => import("../widgets/notification-center"), {
    ssr: false,
  });
  // render the component
  return (
    <NotificationProvider username={username}>
      <Comp
        className={className}
      />
    </NotificationProvider>
  );
};
NotificationScreen.displayName = "NotificationScreen";

export default NotificationScreen;
