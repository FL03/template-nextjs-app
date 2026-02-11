/**
 * Created At: 2025.07.18:12:27:05
 * @author - @FL03
 * @file - clocks.tsx
 */
'use client';
import * as React from 'react';
import dynamic from 'next/dynamic';
// local
import { ClockContextMenu } from './clock-context-menu';
import { ClockProvider } from './clock-provider';
import { ClockProps } from './types';

type Clocks = 'digital' | 'analog';

type WidgetPropsT = {
  className?: string;
  flavor?: Clocks;
} & ClockProps;

/** A dynamic component rendering the current time using the given _kind_ of clock / representation. */
export const Clock: React.FC<WidgetPropsT> = ({
  flavor = 'digital',
  ...props
}) => {
  if (flavor !== 'digital') {
    throw new Error(`Unsupported clock kind: ${flavor}`);
  }
  // a simple callback to handle the dynamic import based on the kind of clock desired.
  const importComponent = () => {
    switch (flavor) {
      default:
        return dynamic(async () => await import('./digital-clock'), {
          ssr: false,
        });
    }
  };
  // initialize the clock component dynamically
  const Comp = importComponent();
  // render the component
  return (
    <ClockProvider>
      <ClockContextMenu>
        <Comp {...props} />
      </ClockContextMenu>
    </ClockProvider>
  );
};

export default Clock;
