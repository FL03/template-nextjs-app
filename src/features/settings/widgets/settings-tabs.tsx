/**
 * Created At: 2025.07.27:10:52:29
 * @author - @FL03
 * @file - settings-tabs.tsx
 */
"use client";
// imports
import * as React from "react";
// project
import { cn } from "@/lib/utils";
// hooks
import { useUserProfile } from "@/hooks/use-profile";
// components
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// features
import { ProfileSettings } from "@/features/profiles";
// local
import { SystemSettingsForm } from "./settings-form";

type SettingsTabs = "system" | "profile";

/** The `SettingsTabs` is a pre-built component used to manage various settings for the platform, profiles, etc. */
export const SettingsTabs: React.FC<
  Omit<React.ComponentPropsWithRef<typeof Tabs>, "children"> & {
    tab?: string;
    defaultTab?: string;
    onTabChange?: (value: string) => void;
  }
> = ({ ref, className, defaultTab, tab: tabProp, onTabChange, ...props }) => {
  // memoize the external tab value
  const activeTab = React.useMemo(() => tabProp, [tabProp]);
  // use the hook to get a reference to the current user profile
  const { profile } = useUserProfile();
  // setup the state for tracking the current tab
  const [tab, setTab] = React.useState(defaultTab || activeTab || "system");
  // a callback for handling tab changes
  const handleTabChange = React.useCallback((value: string): void => {
    // set the local state
    setTab(value);
    // invoke the external callback if provided
    if (onTabChange) onTabChange(value);
    // return
    return;
  }, [onTabChange]);
  // ensure thelocal tab state reflects the provided value
  React.useEffect(() => {
    // handle the case where the active tab exists and is different from the current tab
    if (activeTab && activeTab !== tab) {
      handleTabChange(activeTab);
    }
  }, [activeTab, tab]);

  // render the tabs
  return (
    <Tabs
      ref={ref}
      className={cn(
        "relative flex flex-1 flex-col h-full w-full z-10",
        className,
      )}
      orientation="horizontal"
      onValueChange={handleTabChange}
      value={tab}
      {...props}
    >
      <div className="flex flex-1 flex-col h-full w-full gap-2 lg:gap-4">
        <TabsList className="flex-shrink-0 w-full h-fit items-center justify-center pb-2 border-b-muted">
          <div className="flex flex-nowrap items-center w-full gap-2">
            <TabsTrigger
              value="system"
              className={cn(
                "hover:underline hover:bg-primary/20",
                "data-[state=active]:underline data-[state=active]:bg-primary/10 data-[state=active]:hover:bg-primary/20",
              )}
            >
              System
            </TabsTrigger>
            <TabsTrigger
              asChild
              value="profile"
              className={cn(
                "hover:underline hover:bg-primary/20",
                "data-[state=active]:underline data-[state=active]:bg-primary/10 data-[state=active]:hover:bg-primary/20",
              )}
            >
              <Button className="flex-1" variant="ghost">Profile</Button>
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent value="system" className="h-full w-full ">
          <SystemSettingsForm />
        </TabsContent>
        <TabsContent value="profile" className="h-full w-full">
          <ProfileSettings profile={profile} />
        </TabsContent>
      </div>
    </Tabs>
  );
};
SettingsTabs.displayName = "SettingsTabs";
