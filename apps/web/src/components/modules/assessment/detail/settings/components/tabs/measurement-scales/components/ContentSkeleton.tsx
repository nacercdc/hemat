import { Skeleton } from "@etm/web-ui-components";

export function ContentSkeleton() {
  return (
    <div className="flex flex-col w-full lg:w-3/4 gap-6 h-fit bg-card border border-secondary-300 rounded-r-sm p-6">
      <div className="flex gap-4 w-full">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-12 w-1/2" />
      </div>
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />

      <Skeleton className="h-12 w-full" />
      <div className="flex h-16 gap-4 w-full items-center justify-end">
        <Skeleton className="h-10 w-1/12 rounded-md" />
        <Skeleton className="h-10 w-1/12 rounded-md" />
      </div>
    </div>
  );
}
