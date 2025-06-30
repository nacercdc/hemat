import { Skeleton } from "@etm/web-ui-components";
import React from "react";

export function AssessmentFormSkeleton() {
  return (
    <div className="w-full transition-all duration-1000 ease-in-out">
      <div className="flex flex-col w-full h-full p-7 gap-6 border border-basic-300 rounded-lg">
        <Skeleton className="h-5 w-32 rounded-md" />

        <Skeleton className="h-4 w-28 rounded-md" />

        <div className="flex gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-1">
              <Skeleton className="w-4 h-4 rounded-full" />{" "}
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="w-4 h-4 rounded-full" />{" "}
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex gap-1">
              <Skeleton className="w-4 h-4 rounded-full" />{" "}
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
            <div className="flex gap-1">
              <Skeleton className="w-4 h-4 rounded-full" />{" "}
              <Skeleton className="h-4 w-28 rounded-md" />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
}
