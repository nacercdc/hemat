import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { SubComponentDetailSkeleton } from "./SubComponentDetailSkeleton";
import type {
  SubComponent,
  SubComponentIncludable,
} from "~/libs/models/subComponent.model";

interface Props {
  subComponent: SubComponent;
}
const SubComponentDetail = ({ subComponent }: Props) => {
  const { data: subComponentDetail, ...subComponentDetailState } = useFindById<
    SubComponent,
    SubComponentIncludable
  >({
    path: `/sub-components/${subComponent.id}`,
    queries: {
      include: ["measurementScales"],
    },
    tqOptions: {
      queryKey: ["sub-component-detail-drawer"],
    },
  });
  return (
    <div className="rounded-md flex flex-col gap-5">
      {subComponentDetailState.isLoading && <SubComponentDetailSkeleton />}
      {subComponentDetailState.isSuccess && subComponentDetail && (
        <>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-info/10 text-info p-2 px-3 text-xs">
              Code: {subComponentDetail.code}
            </div>
            <h3 className="text-sm font-bold">{subComponentDetail.name}</h3>
          </div>
          <span className="text-xs text-dark">
            {subComponentDetail.description}
          </span>
          <div className="flex flex-col gap-2">
            {subComponentDetail.measurementScales.map((measurementScale) => (
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

      {subComponentDetailState.isSuccess && !subComponentDetail && (
        <span>No subComponent found</span>
      )}
    </div>
  );
};
export default SubComponentDetail;
