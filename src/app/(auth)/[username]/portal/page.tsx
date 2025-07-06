/**
 * Created At: 2025-04-09:22:27:42
 * @author - @FL03
 * @file - page.tsx
 */
'use server';
import { ResolvingMetadata } from 'next';
// project
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { TextEditor } from '@/components/common/text-editor';
import { logger } from '@/lib';

type PageProps = {
  params: Promise<{ username: string }>;
};

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  // logger
  logger.trace(`Rendering content manager page for user: ${username}`);
  // render the page
  return (
    <Card className="flex flex-col flex-1 min-h-full w-full gap-4">
      {/* Header */}
      <CardHeader className="flex flex-nowrap items-center w-full gap-2 lg:gap-4">
        <div className="inline-flex flex-col items-start w-full gap-2">
          <CardTitle className="text-xl tracking-tight">Content</CardTitle>
          <CardDescription className="text-muted-foreground">
            View and manage all your digital assets in one place.
          </CardDescription>
        </div>
      </CardHeader>
      {/* Content */}
      <CardContent className="flex flex-col flex-1 w-full gap-4 lg:gap-6">
        <TextEditor />
      </CardContent>
    </Card>
  );
}
Page.displayName = 'UserPortalPage';

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
) {
  const { username } = await params;
  const previousMetadata = await parent;

  return {
    ...previousMetadata,
    description: `The dynamic dashboard for ${username}'s digital universe.`,
    title: 'Portal',
  };
}
