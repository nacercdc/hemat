import React from "react";

export default function InvitationListSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 font-semibold text-sm p-2">
        <div className="h-4 bg-primary-50 w-3/4 animate-pulse" />
        <div className="h-4 bg-primary-50 w-1/2 animate-pulse" />
        <div className="h-4 bg-primary-50 rounded w-1/3 animate-pulse" />
      </div>
      {[...Array(3)].map((_, idx) => (
        <div
          key={idx}
          className="grid grid-cols-3 text-sm p-2 gap-2 items-center animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-primary-50 rounded-full" />
            <div className="h-4 w-24 bg-primary-50 rounded" />
          </div>
          <div className="h-4 w-16 bg-primary-50 rounded" />
          <div className="h-4 w-20 bg-primary-50 rounded" />
        </div>
      ))}
    </>
  );
}
