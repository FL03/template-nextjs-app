/**
 * Created At: 2025.07.27:09:59:00
 * @author - @FL03
 * @file - settings-screen.tsx
 */
"use client";
//imports
import * as React from "react";
// feature-specific
import { ConfigurationPanel, SettingsTabs } from "../widgets";

/**
 * The `SettingScreen` component renders the view for the settings screen;
 */
export const SettingScreen: React.FC<
  Omit<React.ComponentPropsWithRef<typeof ConfigurationPanel>, "children"> & {
    defaultTab?: string;
  }
> = ({ defaultTab = "system", ...props }) => {
  // render the configuration panel
  return (
    <ConfigurationPanel {...props}>
      <SettingsTabs defaultTab={defaultTab} />
    </ConfigurationPanel>
  );
};
SettingScreen.displayName = "SettingsScreen";

export default SettingScreen;
