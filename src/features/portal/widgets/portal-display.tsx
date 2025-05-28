



export const PortalDisplay = () => {
  return (
    <div className="flex flex-col flex-1 min-h-full w-full gap-4">
      {/* Header */}
      <section className="flex flex-nowrap items-center w-full gap-2 lg:gap-4">
        <div className="inline-flex flex-col items-start w-full gap-2">
          <div className="text-xl font-bold">Portal</div>
          <span className="text-muted-foreground">
            A central hub for all your digital assets and subscriptions.
          </span>
        </div>
      </section>
      {/* Content */}
      <section className="flex flex-col flex-1 w-full gap-4 lg:gap-6">
        {/* Content goes here */}
      </section>
    </div>
  );
}
PortalDisplay.displayName = 'PortalDisplay';

export default PortalDisplay;