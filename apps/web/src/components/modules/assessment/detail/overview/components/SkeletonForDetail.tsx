import { Skeleton } from "@etm/web-ui-components";
import React from "react";
import { PageContainer } from "~/components/modules/components/PageContainer";

export default function SkeletonForDetail() {
  return (
    <PageContainer pageTitle="Loading Assessment..." includeBreadcrumb={false}>
      <div className="flex items-start flex-wrap justify-between gap-4">
        {/* Left Side */}
        <div className="lg:w-3/5 w-full flex flex-col gap-3">
          {/* Status Skeleton */}
          <div className="bg-dark-lighter/5 p-4 rounded-sm flex flex-col gap-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-20 h-6 rounded-full" />
          </div>

          {/* Info Grid Skeleton */}
          <div className="bg-dark-lighter/5 p-4 rounded-sm flex gap-10">
            <div className="flex flex-col gap-3 w-1/2">
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-full h-4" />
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-full h-4" />
            </div>
            <div className="flex flex-col gap-3 w-1/2">
              <Skeleton className="w-3/4 h-4" />
              <Skeleton className="w-full h-4" />
            </div>
          </div>

          {/* Description */}
          <div className="bg-dark-lighter/5 p-4 rounded-sm flex flex-col gap-3">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-full h-24 rounded-sm" />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 bg-dark-lighter/5 p-2 rounded-sm gap-2 flex flex-col">
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
        </div>
      </div>
    </PageContainer>
  );
}
