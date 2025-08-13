"use client";

import React, { useMemo } from "react";
import { DomainCard } from "./DomainCard";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { cn } from "~/utils/cn.util";
import { Skeleton } from "@etm/web-ui-components";
import { useSelectedFilterYear } from "../../context/selected-filter-year/useSelectedFilterYear";

type DomainCardType = "single" | "summary";

export interface AverageRatedDomain {
  id: string;
  name: string;
  domainId: string;
  averageRate: number;
}
export interface IDomainCardType extends AverageRatedDomain {
  type: DomainCardType;
  icon?: React.ReactNode;
}

export function DomainCardList() {
  const selectedYearCtx = useSelectedFilterYear();

  const { data: averageRatedDomains, ...averageRatedDomainsState } = useFindAll<
    AverageRatedDomain[],
    unknown,
    { year: number }
  >({
    path: "/dashboard/domains/average-rate",
    queries: {
      filters: { year: `${selectedYearCtx?.selectedFilterYear?.value}` },
    },
    isProtected: false,
    tqOptions: { queryKey: ["domains", selectedYearCtx?.selectedFilterYear] },
  });

  const isLoading =
    averageRatedDomainsState.isLoading || averageRatedDomainsState.isFetching;

  const domainCards = useMemo(() => {
    const averagedDomains =
      averageRatedDomains as unknown as AverageRatedDomain[];

    if (averagedDomains?.length) {
      return averagedDomains.map((averagedDomain) => ({
        ...averagedDomain,
        icon: null,
        type: "single" as DomainCardType,
      }));
    } else return [];
  }, [averageRatedDomains]);

  if (isLoading) {
    return <DomainCardListSkeleton />;
  }

  return (
    <div
      className={cn(
        "flex overflow-x-auto gap-4",
        domainCards.length > 2 && "justify-between"
      )}
    >
      {domainCards?.map((domainCard) => (
        <DomainCard key={domainCard.name} domain={domainCard} />
      ))}
    </div>
  );
}

function DomainCardListSkeleton() {
  return (
    <div className="flex overflow-x-auto justify-between gap-4 rounded-sm">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="flex flex-col p-2 justify-between h-28 w-72 rounded-sm border-[1px] border-dark-lighter/20"
        >
          <Skeleton className="rounded-sm h-3 w-36" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Skeleton className="rounded-sm h-3 w-36" />
              <Skeleton className="rounded-sm h-6 w-6" />
            </div>
            <Skeleton className="rounded-sm h-3 w-44" />
          </div>
        </div>
      ))}
    </div>
  );
}
