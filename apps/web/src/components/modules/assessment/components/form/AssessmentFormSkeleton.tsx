export function AssessmentFormSkeleton() {
  return (
    <div className="flex flex-col gap-4 md:w-[744px] mx-auto p-8 bg-dark-lighter/5 rounded-md">
      <div className="h-10 bg-dark-lighter/5 animate-pulse rounded-md" />
      <div className="flex gap-2">
        <div className="h-10 flex-1 bg-dark-lighter/5  animate-pulse rounded-md" />
        <div className="h-10 flex-1 bg-dark-lighter/5  animate-pulse rounded-md" />
      </div>
      <div className="h-10 bg-dark-lighter/5  animate-pulse rounded-md" />
      <div className="h-10 bg-dark-lighter/5  animate-pulse rounded-md" />
      <div className="h-24 bg-dark-lighter/5  animate-pulse rounded-md" />
      <div className="h-24 bg-dark-lighter/5  animate-pulse rounded-md" />
      <div className="flex justify-between pt-2">
        <div className="h-10 w-32 bg-dark-lighter/5  animate-pulse rounded-md" />
        <div className="h-10 w-32 bg-dark-lighter/5  animate-pulse rounded-md" />
      </div>
    </div>
  );
}
