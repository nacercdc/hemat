import { Skeleton } from "@etm/web-ui-components";
import React from "react";

export default function InvitationListSkeleton() {
  return (
    <div className="flex items-start flex-wrap justify-between gap-4 animate-pulse">
      <div className="lg:w-3/5 w-full flex flex-col p-2 bg-dark-lighter/5 rounded-sm">
        <div className="bg-white w-full flex flex-col gap-4 p-2 rounded-sm">
          {/* <div className="flex justify-between p-2">
            <span className="font-semibold text-sm bg-gray-300 h-4 w-32 rounded"></span>
          </div> */}

          {[...Array(2)].map((_, idx) => (
            <div
              key={idx}
              className="relative border-2 rounded-lg px-4 pt-10 pb-4 bg-primary-50/20 border-primary-50"
            >
              <div className="absolute -top-3 left-4 bg-white py-2 px-4 text-sm font-bold border-2 border-primary-50 rounded w-3/4">
                <div className="flex gap-6 items-center">
                  <Skeleton className="w-24 h-4 rounded" />
                  <Skeleton className="w-24 h-8 rounded-md" />
                </div>
              </div>

              {[...Array(3)].map((__, i) => (
                <div key={i} className="flex flex-col m-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className=" h-10  w-10 rounded-full" />
                      <div className="flex flex-col">
                        <Skeleton className="w-16 h-4" />
                        <Skeleton className="w-16 h-3" />
                      </div>
                    </div>

                    <Skeleton className=" h-8 w-16" />
                  </div>
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
