import { Skeleton } from "@etm/web-ui-components";

export function CreateGroupFormSkeleton() {
  return (
    <div className="flex flex-col w-full min-h-20 bg-card rounded-xl relative">
      <div className="text-xl font-bold px-8 pt-8 mb-6">
        <Skeleton className="h-6 w-40" />
      </div>

      <div className="flex flex-col gap-6 px-8 flex-1 py-8 w-full bg-dark-lighter/5">
        {/* Group name input */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Members list */}
        <div className="flex flex-col gap-4 w-full">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
              <Skeleton className="h-6 w-6" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between items-center w-full bg-dark-lighter/5 p-4 rounded-b-lg px-8 mt-auto">
        <Skeleton className="h-10 w-32" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  );
}
