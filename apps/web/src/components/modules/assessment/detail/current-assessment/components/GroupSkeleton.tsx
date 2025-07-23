import { Skeleton } from "@etm/web-ui-components";
import React from "react";

export function GroupSkeleton() {
  return (
    <div className="flex flex-col gap-4 my-4">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-3 w-24 rounded-sm" />
        <Skeleton className="h-3 w-28 rounded-sm" />
      </div>
      <div className="flex gap-7">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="flex flex-col gap-2.5 p-3 rounded-md min-w-60 border-[1px]"
          >
            <Skeleton className="h-3 w-full rounded-sm" />
            <Skeleton className="h-3 w-24 rounded-sm" />
            <Skeleton className="h-3 w-24 rounded-sm" />
            <Skeleton className="h-3 w-full rounded-sm" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
