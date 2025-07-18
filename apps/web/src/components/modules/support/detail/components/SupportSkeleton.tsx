import { Skeleton } from "@etm/web-ui-components";
import React from "react";

export function SupportSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <div className="rounded-sm p-3 flex flex-col gap-3 w-full row-start-2 lg:row-start-1 col-span-full lg:col-span-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-10 w-24 rounded-sm" />
        {/* {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-sm" />
        ))} */}
      </div>
      <div className="flex flex-col gap-3 row-start-1 col-span-full lg:col-span-1">
        <div className="flex justify-between items-center rounded-sm p-2 px-4">
          <Skeleton className="h-14 w-14 rounded-sm" />
          <Skeleton className="h-14 w-14 rounded-sm" />
          <Skeleton className="h-14 w-14 rounded-sm" />
        </div>
        <Skeleton className="h-36 w-full rounded-sm" />
      </div>
    </div>
  );
}
