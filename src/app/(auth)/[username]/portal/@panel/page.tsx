/**
 * Created At: 2025-04-09:22:27:42
 * @author - @FL03
 * @file - page.tsx
 */
'use server';
// imports


type PageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ view?: string; }>;
}

export default async function Page({ params }: PageProps) {
  const { username } = await params;
  // const { view } = await searchParams;
  // render the page
  return (
    <div className="flex flex-col flex-1 min-h-full w-full gap-4">
      {/* Header */}
      <section className="flex flex-nowrap items-center w-full gap-2 lg:gap-4">
        <div className="inline-flex flex-col items-start w-full gap-2">
          <div className="text-xl font-bold">Feed</div>
          <span className="text-muted-foreground">
            A cental feed for all your assets, subscriptions, and other digital content.
          </span>
        </div>
      </section>
      {/* Content */}
      <section className="flex flex-col flex-1 w-full gap-4 lg:gap-6">
        {username}
      </section>
    </div>
  );
}
Page.displayName = 'ContentDashboardFeed';
