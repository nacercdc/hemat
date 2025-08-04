"use client";

import React, { useMemo } from "react";
import { DomainCard } from "./DomainCard";
// import { domainScores } from "../../constants";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { cn } from "~/utils/cn.util";

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
  const { data: averageRatedDomains, ...averageRatedDomainsState } = useFindAll<
    AverageRatedDomain[]
  >({ path: "/dashboard/domains/average-rate", isProtected: false });

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
    return <div>Loading ...</div>;
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
