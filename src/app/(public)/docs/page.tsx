/**
 * Created At: 2025.10.06:17:38:30
 * @author - @FL03
 * @directory - src/app/(public)/docs
 * @file - page.tsx
 */

import { Item, ItemContent, ItemTitle } from "@/components/ui/item";

export const metadata = {
  title: "Documentation",
  description: "The documentation for the puzzled platform.",
};

export default function Page() {
  return (
    <div className="flex-1 h-full w-full">
      <Item>
        <ItemContent>
          <ItemTitle className="text-xl">Documentation</ItemTitle>
        </ItemContent>
      </Item>
    </div>
  );
}
