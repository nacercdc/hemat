import React from "react";
import { Skeleton } from "@etm/web-ui-components";

export function ComponentsListSkeleton() {
  return (
    <div className="flex flex-row lg:flex-col gap-1 lg:gap-3 w-full overflow-auto lg:max-h-[746px] lg:overflow-y-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <div
          key={num}
          className="flex items-center justify-between p-4 rounded-xl h-14 border border-basic-300 w-full"
        >
          <Skeleton className="w-32 h-6 text-nowrap rounded-md" />
          <Skeleton className="w-4 h-4 rounded-full" />
        </div>
      ))}
    </div>
  );
}
