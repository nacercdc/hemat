import { Skeleton } from "@etm/web-ui-components";
import React from "react";

export default function AssessmentGroupsSkeleton() {
  return (
    <div className="flex items-start flex-wrap justify-between gap-4">
      {/* Left Section - Groups and Members */}
      <div className="lg:w-3/5 w-full flex flex-col p-2 bg-dark-lighter/5 rounded-sm">
        <div className="bg-white w-full flex flex-col gap-4 p-2 rounded-sm animate-pulse">
          <div className="flex justify-between p-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-5 w-32 rounded-full" />
          </div>

          {/* Skeleton for multiple groups */}
          {[1, 3].map((_, groupIdx) => (
            <div
              key={groupIdx}
              className="relative border-2 rounded-lg p-4 bg-primary/10 "
            >
              <div className="absolute -top-3 left-4 bg-white px-4 h-6 w-24 rounded border-2"></div>

              {[1, 3].map((_, memberIdx) => (
                <div
                  key={memberIdx}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-5 w-32 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-32 rounded-full" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Member Roles */}
      <div className="flex-1 bg-dark-lighter/5 p-2 rounded-sm gap-2 flex flex-col">
        <Skeleton className="w-full h-24" />
        <Skeleton className="w-full h-24" />
      </div>
    </div>
  );
}
