
'use client'
// imports
import * as React from "react";
// components
import { Scaffold, ScaffoldContent } from "@/components/common/scaffold";
import PlatformAppBar from "./platform-appbar";

/** The base scaffold for the application. */
export const PlatformScaffold: React.FC<React.PropsWithChildren<React.ComponentPropsWithRef<typeof Scaffold>>> = ({ ref, children, ...props }) => {
  return (
    <Scaffold {...props} ref={ref}>
      <PlatformAppBar />
      <ScaffoldContent className="container mx-auto px-4 py-2 flex flex-col flex-1 gap-4 w-full">
        {children}
      </ScaffoldContent>
    </Scaffold>

  )
};
PlatformScaffold.displayName = 'PlatformScaffold';

export default PlatformScaffold;