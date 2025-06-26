import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { SubComponentDetailSkeleton } from "./SubComponentDetailSkeleton";
import type {
  SubComponent,
  SubComponentIncludable,
} from "~/libs/models/subComponent.model";

interface Props {
  id: string;
}
const SubComponentDetail = ({ id }: Props) => {
  const { data: subComponent, ...subComponentState } = useFindById<
    SubComponent,
    SubComponentIncludable
  >({
    path: `/sub-components/${id}`,
    queries: {
      include: ["measurementScales"],
    },
    tqOptions: {
      queryKey: ["sub-component-detail-drawer"],
    },
  });
  return (
    <div className="rounded-md flex flex-col gap-5">
      {subComponentState.isLoading && <SubComponentDetailSkeleton />}
      {subComponentState.isSuccess && subComponent && (
        <>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-info/10 text-info p-2 px-3 text-xs">
              Code: {subComponent.code}
            </div>
            <h3 className="text-sm font-bold">{subComponent.name}</h3>
          </div>
          <span className="text-xs text-dark">{subComponent.description}</span>
          <div className="flex flex-col gap-2">
            {subComponent.measurementScales.map((measurementScale) => (
              <div
                key={measurementScale.id}
                className="flex flex-col gap-2 border border-basic-300 rounded-md p-3"
              >
                <h6 className="text-xs text-dark">
                  {measurementScale.description}
                </h6>
              </div>
            ))}
          </div>
        </>
      )}

      {subComponentState.isSuccess && !subComponent && (
        <span>No subComponent found</span>
      )}
    </div>
  );
};
export default SubComponentDetail;
