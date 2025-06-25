import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { DomainDetailSkeleton } from "./DomainDetailSkeleton";
import type { Domain } from "~/libs/models/domain.model";

interface Props {
  id: string;
}
const DomainDetail = ({ id }: Props) => {
  const { data: domain, ...domainState } = useFindById<Domain>({
    path: `/domains/${id}`,
    tqOptions: {
      queryKey: ["domain-detail-drawer"],
    },
  });
  return (
    <div className="rounded-md flex flex-col gap-5">
      {domainState.isLoading && <DomainDetailSkeleton />}
      {domainState.isSuccess && domain && (
        <>
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-info/10 text-info p-2 px-3 text-xs">
              Code: {domain.code}
            </div>
            <h3 className="text-sm font-bold">{domain.name}</h3>
          </div>
          <span className="text-xs text-dark">{domain.description}</span>
          {(domain?.componentsCount || domain?.subComponentsCount) && (
            <div className="flex flex-col gap-2 border border-basic-300 rounded-md p-3">
              {domain?.componentsCount !== undefined && (
                <h6 className="text-xs font-medium">
                  Components: {domain?.componentsCount}
                </h6>
              )}
              {domain?.subComponentsCount !== undefined && (
                <h6 className="text-xs font-medium">
                  Sub-Components: {domain?.subComponentsCount}
                </h6>
              )}
            </div>
          )}
        </>
      )}

      {domainState.isSuccess && !domain && <span>No domain found</span>}
    </div>
  );
};
export default DomainDetail;
