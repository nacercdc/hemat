import { Skeleton } from "@etm/web-ui-components";
import React from "react";

export default function InvitationListSkeleton() {
  return (
    <div className="flex items-start flex-wrap justify-between gap-4 animate-pulse">
      <div className="lg:w-3/5 w-full flex flex-col p-2 bg-dark-lighter/5 rounded-sm">
        <div className="bg-white w-full flex flex-col gap-4 p-2 rounded-sm">
          <div className=" border-2 rounded-lg px-4 pt-10 pb-4 bg-primary-50/20 border-primary-50">
            <div className="flex flex-col gap-6 w-full">
              <div className="flex gap-4 items-center w-full">
                <Skeleton className="w-10/12 h-8 rounded" />
                <Skeleton className="w-2/12 h-8 rounded-md" />
              </div>
              <div className="flex gap-4 items-center w-full">
                <Skeleton className="w-10/12 h-8 rounded" />
                <Skeleton className="w-2/12 h-8 rounded-md" />
              </div>
            </div>

            {[...Array(3)].map((__, i) => (
              <div key={i} className="flex flex-col m-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Skeleton className=" h-10  w-10 rounded-full" />
                    <div className="flex flex-col gap-1 justify-start ">
                      <Skeleton className="w-40 h-3" />
                      <Skeleton className="w-40 h-3" />
                      <Skeleton className="w-20 h-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
