import React from "react";
import { Skeleton } from "@etm/web-ui-components";

export function GroupSkeleton() {
  return (
    <div className="flex gap-7 my-2">
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
  );
}
