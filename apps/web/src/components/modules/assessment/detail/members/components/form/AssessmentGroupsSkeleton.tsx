import React from "react";

export default function AssessmentGroupsSkeleton() {
  return (
    <div className="flex items-start flex-wrap justify-between gap-4">
      {/* Left Section - Groups and Members */}
      <div className="lg:w-3/5 w-full flex flex-col p-2 bg-dark-lighter/5 rounded-sm">
        <div className="bg-white w-full flex flex-col gap-4 p-2 rounded-sm animate-pulse">
          <div className="flex justify-between p-2">
            <div className="h-5 w-32 bg-gray-300 rounded"></div>
            <div className="h-8 w-32 bg-gray-300 rounded"></div>
          </div>

          {/* Skeleton for multiple groups */}
          {[1, 2].map((_, groupIdx) => (
            <div
              key={groupIdx}
              className="relative border-2 rounded-lg p-4 bg-gray-100 border-gray-300"
            >
              <div className="absolute -top-3 left-4 bg-white px-4 h-6 w-24 rounded border-2 border-gray-300"></div>

              {[1, 2].map((_, memberIdx) => (
                <div
                  key={memberIdx}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-8 w-24 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Right Section - Member Roles */}
      <div className="flex-1 rounded-sm gap-2 flex flex-col p-2 bg-dark-lighter/5 animate-pulse">
        {[1, 2].map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-2 p-4 border rounded bg-white"
          >
            <div className="h-5 w-32 bg-gray-300 rounded"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
