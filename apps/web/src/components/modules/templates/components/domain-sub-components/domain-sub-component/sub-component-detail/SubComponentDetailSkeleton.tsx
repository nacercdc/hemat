import { Skeleton } from "@etm/web-ui-components";

export const SubComponentDetailSkeleton = () => {
  return (
    <div className="rounded-md flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-5 w-48" />
      </div>
      <Skeleton className="h-4 w-full" />
      <div className="flex flex-col gap-2 border border-basic-300 rounded-md p-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-40" />
      </div>
    </div>
  );
};
