"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Accordion } from "@etm/web-ui-components";
import { cn } from "~/utils/cn.util";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import {
  DomainComponentCardSkeleton,
  SubComponentCard,
} from "./SubComponentCard";
import { DomainIconMap } from "~/components/modules/home/constants";
import type { AssessmentMeasurementScale } from "~/libs/models/assessment-measurement-scale.model";
import { isLightColor } from "../utils/luminacity.util";

export interface Domain {
  id: string;
  name: string;
  averageRate: number;
}

export interface Component {
  id: string;
  name: string;
  averageRate: number;
}

interface SubComponent {
  id: string;
  name: string;
  description: string;
  averagePrimaryRate: number;
  averageRoadmapRate: number;
  africaAveragePrimaryRate: number;
}

interface Props {
  countryCode: string;
  selectedFilterYear?: { label: number; value: number };
}

export const DomainsAccordion = ({
  countryCode,
  selectedFilterYear,
}: Props) => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  const { data: countryDomainsRate, ..._countryDomainsRateState } =
    useFindAll<Domain>({
      path: `/dashboard/domains/average-rate/country/${countryCode}`,
      queries: {
        filters: { year: `${selectedFilterYear?.value}` },
      },
      tqOptions: {
        queryKey: ["country-domains-rate-accordion", selectedFilterYear],
      },
    });

  const { data: countryComponentsRate, ...countryComponentsRateState } =
    useFindAll<Component>({
      path: `/dashboard/domains/${selectedDomain}/components/average-rate/country/${countryCode}`,
      queries: {
        filters: { year: `${selectedFilterYear?.value}` },
      },
      tqOptions: {
        enabled: !!selectedDomain,
        queryKey: [
          "country-components-rate-accordion",
          selectedDomain,
          selectedFilterYear,
        ],
      },
    });

  const { data: countrySubComponentsRate, ...countrySubComponentsRateState } =
    useFindAll<SubComponent>({
      path: `/dashboard/components/${selectedComponent}/subcomponents/average-rate/country/${countryCode}`,
      queries: {
        filters: { year: `${selectedFilterYear?.value}` },
      },
      tqOptions: {
        enabled: !!selectedComponent,
        queryKey: [
          "country-sub-components-rate-accordion",
          selectedComponent,
          selectedFilterYear,
        ],
      },
    });

  const { data: measurementScales } = useFindAll<AssessmentMeasurementScale>({
    path: "/dashboard/measurement-scales",
    queries: { sorts: { ascending: "rate" } },
  });

  const childAccordionItems = countryComponentsRateState.isLoading
    ? [
        {
          value: "skeleton",
          trigger: (
            <div className="flex items-center gap-2 px-3 rounded-md">
              <div className="h-5 w-40 bg-gray-200 animate-pulse rounded" />
            </div>
          ),
          content: (
            <div
              className={cn(
                "overflow-hidden bg-white rounded-sm grid grid-cols-1 lg:grid-cols-2 gap-4 py-5 px-10 border"
              )}
            >
              <DomainComponentCardSkeleton />
              <DomainComponentCardSkeleton />
            </div>
          ),
        },
      ]
    : countryComponentsRate?.data?.map((component) => ({
        value: component.id,
        trigger: (
          <div className="flex items-center gap-2 px-3 rounded-md">
            <span className="text-sm font-bold text-dark">
              {component.name}
            </span>
          </div>
        ),
        content: (
          <div
            className={cn(
              " overflow-hidden bg-white rounded-sm  grid grid-cols-1 lg:grid-cols-2 gap-14  min-[600px]:gap-4 py-5 px-10 border"
            )}
          >
            {!countrySubComponentsRateState.isLoading &&
              countrySubComponentsRate?.data?.map(
                (
                  {
                    description,
                    averagePrimaryRate,
                    averageRoadmapRate,
                    africaAveragePrimaryRate,
                    name,
                  },
                  index
                ) => (
                  <SubComponentCard
                    key={index}
                    content={description}
                    primaryRate={averagePrimaryRate}
                    roadmapRate={averageRoadmapRate}
                    benchmarkRate={africaAveragePrimaryRate}
                    title={name}
                  />
                )
              )}
            {countrySubComponentsRateState.isLoading && (
              <>
                <DomainComponentCardSkeleton />
                <DomainComponentCardSkeleton />
              </>
            )}
          </div>
        ),
      }));

  const parentAccordionItems = countryDomainsRate?.map((domain) => {
    const scaleColor = measurementScales?.data.find(
      (scale) => scale.rate === domain.averageRate
    )?.color;
    return {
      value: domain.id,
      trigger: (
        <div className="flex items-center gap-4 px-3 py-0 rounded-md">
          <>
            {isIncluded(domain.name, "fluent-mdl2:party-leader") && (
              <div
                className="rounded-full p-2"
                style={{
                  backgroundColor: scaleColor ? `${scaleColor}4A` : undefined,
                  color: isLightColor(scaleColor ?? "") ? "black" : "white",
                }}
              >
                <Icon icon="fluent-mdl2:party-leader" className="w-5 h-5 " />
              </div>
            )}
            {isIncluded(domain.name, "game-icons:satellite-communication") && (
              <div
                className="rounded-full p-2"
                style={{
                  backgroundColor: scaleColor ? `${scaleColor}4A` : undefined,
                  color: isLightColor(scaleColor ?? "") ? "black" : "white",
                }}
              >
                <Icon
                  icon="game-icons:satellite-communication"
                  className="w-5 h-5 "
                />
              </div>
            )}
            {isIncluded(
              domain.name,
              "carbon:ibm-knowledge-catalog-standard"
            ) && (
              <div
                className="rounded-full p-2"
                style={{
                  backgroundColor: scaleColor ? `${scaleColor}4A` : undefined,
                  color: isLightColor(scaleColor ?? "") ? "black" : "white",
                }}
              >
                <Icon
                  icon="carbon:ibm-knowledge-catalog-standard"
                  className="w-5 h-5 "
                />
              </div>
            )}
            {isIncluded(domain.name, "fluent-mdl2:workforce-management") && (
              <div
                className="rounded-full p-2"
                style={{
                  backgroundColor: scaleColor ? `${scaleColor}4A` : undefined,
                  color: isLightColor(scaleColor ?? "") ? "black" : "white",
                }}
              >
                <Icon
                  icon="fluent-mdl2:workforce-management"
                  className="w-5 h-5 "
                />
              </div>
            )}
          </>
          <span className="text-sm font-bold text-dark">{domain.name}</span>
        </div>
      ),
      content: (
        <div className="flex flex-col gap-6 p-3 border">
          <div key={domain.id} className="mb-1">
            <Accordion
              items={childAccordionItems?.length ? childAccordionItems : []}
              type="single"
              collapsible={true}
              onValueChange={setSelectedComponent}
            />
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="flex flex-col gap-3 mt-4 bg-card rounded-md">
      <Accordion
        items={parentAccordionItems?.length ? parentAccordionItems : []}
        type="single"
        collapsible={true}
        onValueChange={(value) => {
          setSelectedDomain(value);
          setSelectedComponent(null);
        }}
      />
    </div>
  );
};

export function isIncluded(domainName: string, iconName: string) {
  let included = false;
  DomainIconMap[iconName]?.forEach((key) => {
    if (domainName.toLowerCase().includes(key.toLowerCase())) {
      included = true;
      return;
    }
  });
  return included;
}
