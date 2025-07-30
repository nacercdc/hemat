import React from "react";
import { PageContainer } from "~/components/modules/components/PageContainer";
import clsx from "clsx";

const SkeletonBox = ({ className }: { className?: string }) => (
  <div className={clsx("bg-primary-50 animate-pulse rounded", className)} />
);

export const DomainDetailSkeleton: React.FC = () => {
  return (
    <PageContainer
      pageTitle={
        <div className="flex gap-4 items-center">
          <SkeletonBox className="h-6 w-64" />
        </div>
      }
      includeBreadcrumb={false}
      onBack={() => {}}
    >
      <div className="flex flex-col gap-6 rounded-sm p-4">
        {Array.from({ length: 3 }).map((_, componentIndex) => (
          <div key={componentIndex} className="flex flex-col gap-4">
            <SkeletonBox className="h-5 w-96" />

            {Array.from({ length: 2 }).map((_, subIndex) => (
              <div
                key={subIndex}
                className="ml-4 border-l-2 pl-4 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  <SkeletonBox className="h-4 w-80" />
                  <SkeletonBox className="h-6 w-20" />
                </div>

                <SkeletonBox className="h-4 w-full" />

                <div className="flex flex-col gap-1 mt-2">
                  <SkeletonBox className="h-4 w-24" />
                  <SkeletonBox className="h-3 w-full" />
                  <SkeletonBox className="h-3 w-2/3" />
                </div>

                <div className="flex flex-col gap-1 mt-2">
                  <SkeletonBox className="h-4 w-24" />
                  <SkeletonBox className="h-3 w-full" />
                  <SkeletonBox className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </PageContainer>
  );
};
