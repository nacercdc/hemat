"use client";

import React, { useMemo } from "react";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { AverageRatedDomain } from "../../home/components/assessment-detail-section/DomainCardList";
import type { ITemplateDomain } from "../../home/components/assessment-tools-section/DomainToolsCollapsibleList";
import type { AssessmentMeasurementScale } from "~/libs/models/assessment-measurement-scale.model";
import DomainMetricsCard, {
  DomainMetricsCardSkeleton,
} from "./DomainMetricsCard";

interface Props {
  measurementScaleLoading: boolean;
  measurementScales: AssessmentMeasurementScale[];
}

export function OverallDomainMetricsSection({
  measurementScaleLoading,
  measurementScales,
}: Props) {
  const { data: averageRatedDomains, ...averageRatedDomainsState } = useFindAll<
    AverageRatedDomain[]
  >({
    path: "/dashboard/domains/average-rate",
    isProtected: false,
  });

  const { data: templateDomains, ...templateDomainsState } = useFindAll<
    ITemplateDomain[]
  >({
    path: "/dashboard/template/domains",
    isProtected: false,
  });

  const templateDomainsLoading =
    templateDomainsState.isLoading || templateDomainsState.isFetching;

  const averageRatedDomainsLoading =
    averageRatedDomainsState.isLoading || averageRatedDomainsState.isFetching;

  const domains = useMemo(() => {
    const tempDomains = templateDomains as unknown as ITemplateDomain[];
    const ratedDomains = averageRatedDomains as unknown as AverageRatedDomain[];

    const reshaped: {
      domain?: ITemplateDomain | AverageRatedDomain;
      scale?: AssessmentMeasurementScale;
    }[] = [];

    tempDomains?.forEach((tempDomain) => {
      const tempDomainObj: {
        domain?: ITemplateDomain | AverageRatedDomain;
        scale?: AssessmentMeasurementScale;
      } = {};

      const ratedDomain = ratedDomains?.find(
        (ratedDomain) => ratedDomain.name === tempDomain.name
      );

      tempDomainObj.domain = tempDomain;

      if (ratedDomain) {
        tempDomainObj.domain = ratedDomain;
        tempDomainObj.scale = measurementScales?.find(
          (mScale) => mScale.rate === ratedDomain.averageRate
        );
      }

      reshaped.push(tempDomainObj);
    });

    reshaped.sort((a, b) => {
      const nameA = (a.domain as ITemplateDomain)?.name ?? "";
      const nameB = (b.domain as ITemplateDomain)?.name ?? "";
      return nameA.localeCompare(nameB, undefined, { sensitivity: "base" });
    });

    return reshaped;
  }, [averageRatedDomains, measurementScales, templateDomains]);

  return (
    <>
      <div className="flex flex-row gap-3 w-full py-5 overflow-x-auto">
        {!measurementScaleLoading &&
          !templateDomainsLoading &&
          !averageRatedDomainsLoading &&
          domains.map(({ domain, scale }, index) => (
            <DomainMetricsCard key={index} scale={scale} domain={domain} />
          ))}
        {(measurementScaleLoading ||
          templateDomainsLoading ||
          averageRatedDomainsLoading) &&
          Array.from({ length: 4 }, (_, i) => (
            <DomainMetricsCardSkeleton key={i} />
          ))}
      </div>
    </>
  );
}
