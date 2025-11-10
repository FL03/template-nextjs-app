/**
 * Created At: 2025.08.05:08:44:44
 * @author - @FL03
 * @file - sample-screen.tsx
 */
"use client";
// imports
import * as React from "react";
// components
import { ContentCard } from "@/components/common/cards";
import { Item, ItemContent, ItemDescription } from "@/components/ui/item";

export const HelpPage: React.FC<
  Omit<
    React.ComponentPropsWithoutRef<typeof ContentCard>,
    "author" | "description" | "title" | "children"
  >
> = ({ ...props }) => (
  <ContentCard
    {...props}
    showDescription
    title="Frequently Asked Questions (FAQ)"
    description="Find answers to common questions about using the Puzzled app."
  >
    <Item>
      <ItemContent>
        <ItemDescription>
          Welcome to the platform FAQ! Here you'll find answers to some of the
          most common questions about our platform. If you don't see your
          question here, feel free to reach out to our support team for further
          assistance.
        </ItemDescription>
      </ItemContent>
    </Item>
  </ContentCard>
);
HelpPage.displayName = "HelpPage";

export default HelpPage;
