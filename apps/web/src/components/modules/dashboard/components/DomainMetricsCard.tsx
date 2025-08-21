import { Progress, Skeleton } from "@etm/web-ui-components";
import { isLightColor } from "../utils/luminacity.util";
import { cn } from "~/utils/cn.util";
import type { ITemplateDomain } from "../../home/components/assessment-tools-section/DomainToolsCollapsibleList";
import type { AverageRatedDomain } from "../../home/components/assessment-detail-section/DomainCardList";
import { TruncatedText } from "~/components/ui/TruncatedText";

interface Props {
  domain?: ITemplateDomain | AverageRatedDomain;
  scale?: {
    name: string;
    rate: number;
    color: string;
  };
}

export default function DomainMetricsCard({ domain, scale }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 items-start h-24 min-w-72 bg-layout-bg/30 border-l-2 rounded-sm py-2 px-4 justify-between overflow-x-auto"
      )}
      style={{ borderColor: scale?.color }}
    >
      <span className="text-sm font-medium ">
        {<TruncatedText text={domain?.name || ""} maxLength={40} />}
      </span>
      {scale && (
        <div className="flex gap-1">
          <span className="text-xs font-normal">{scale.name}</span>
          <div
            className={cn(
              `flex items-center justify-center min-w-5 min-h-4 rounded-[3px] text-xs font-medium`,
              isLightColor(scale?.color) ? "text-dark" : "text-card"
            )}
            style={{ background: scale.color }}
          >
            {scale.rate}
          </div>
        </div>
      )}
      {scale && (
        <div className="flex items-center justify-center w-9/12 zh-2 rounded-[3px]">
          <Progress value={30} shape="circular" color={scale.color} size="md" />
        </div>
      )}
      {!scale && (
        <span className="font-bold text-sm bg-dark-lighter/20 rounded-sm p-0.5">
          NA
        </span>
      )}
    </div>
  );
}

export function DomainMetricsCardSkeleton() {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 items-start h-24 min-w-72 bg-card border-[1px] border-dark-lighter/20 rounded-sm py-2 px-4 justify-between overflow-x-auto"
      )}
    >
      <Skeleton className="h-4 w-48 rounded-sm" />
      <Skeleton className="h-4 w-28 rounded-sm" />
      <Skeleton className="h-3 w-full rounded-sm" />
    </div>
  );
}
