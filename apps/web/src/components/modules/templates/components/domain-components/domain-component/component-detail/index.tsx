import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { ComponentDetailSkeleton } from "./ComponentDetailSkeleton";
import type { Component } from "~/libs/models/component.model";

interface Props {
  id: string;
}
const ComponentDetail = ({ id }: Props) => {
  const { data: component, ...componentState } = useFindById<Component>({
    path: `/components/${id}`,
    tqOptions: {
      queryKey: ["component-detail-drawer"],
    },
  });
  return (
    <div className="rounded-md flex flex-col gap-5">
      {componentState.isLoading && <ComponentDetailSkeleton />}
      {componentState.isSuccess && component && (
        <>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-info/10 text-info p-2 px-3 text-xs">
              Code: {component.code}
            </div>
            <h3 className="text-sm font-bold">{component.name}</h3>
          </div>
          <span className="text-xs text-dark">{component.description}</span>
          {(component?.subComponentsCount || component?.subComponentsCount) && (
            <div className="flex flex-col gap-2 border border-basic-300 rounded-md p-3">
              {component?.subComponentsCount !== undefined && (
                <h6 className="text-xs font-medium">
                  Sub-Components: {component?.subComponentsCount}
                </h6>
              )}
            </div>
          )}
        </>
      )}

      {componentState.isSuccess && !component && (
        <span>No component found</span>
      )}
    </div>
  );
};
export default ComponentDetail;
