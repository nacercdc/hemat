import { Skeleton } from "@etm/web-ui-components";
import React from "react";

interface Props {
  single?: boolean;
}

export function RepliesSkeleton({ single = false }: Props) {
  return (
    <div className="flex flex-col gap-3">
      {!single &&
        Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-sm bg-white/50" />
        ))}
      {single && (
        <Skeleton
          key={new Date().toLocaleDateString()}
          className="h-40 w-full rounded-sm bg-white/50"
        />
      )}
    </div>
  );
}
