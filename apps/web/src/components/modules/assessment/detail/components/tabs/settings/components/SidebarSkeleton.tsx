import { Skeleton } from "@etm/web-ui-components";

interface SidebarSkeletonProps {
  itemCount?: number;
  showGroupSeparators?: boolean;
}

export function SidebarSkeleton({
  itemCount = 5,
  showGroupSeparators = false,
}: SidebarSkeletonProps) {
  return (
    <div className="flex flex-col gap-3 w-full md:w-1/4 overflow-y-auto bg-basic-200/30 p-3 rounded-l-sm">
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index}>
          <div className="flex items-center gap-2 w-full">
            <div className="flex flex-1 items-center justify-between p-4 rounded-lg min-h-14 border border-basic-300 bg-basic-100">
              <div className="flex gap-2 items-center">
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="w-4 h-4 rounded-full" />
            </div>
          </div>
          {showGroupSeparators && index < itemCount - 1 && (
            <div className="my-2 mr-8">
              <Skeleton className="h-px w-full" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
