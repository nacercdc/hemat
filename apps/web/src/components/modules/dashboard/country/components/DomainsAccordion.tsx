"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Accordion } from "@etm/web-ui-components";
import { cn } from "~/utils/cn.util";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import {
  DomainComponentCardSkeleton,
  SubComponentCard,
} from "../../components/SubComponentCard";

interface Props {
  countryCode: string;
}

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

export const DomainsAccordion = ({ countryCode }: Props) => {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null
  );

  const { data: countryDomainsRate, ..._countryDomainsRateState } =
    useFindAll<Domain>({
      path: `/dashboard/domains/average-rate/country/${countryCode}`,
      isProtected: false,
    });

  const { data: countryComponentsRate, ..._countryComponentsRateState } =
    useFindAll<Component>({
      path: `/dashboard/domains/${selectedDomain}/components/average-rate/country/${countryCode}`,
      isProtected: false,
      tqOptions: {
        enabled: !!selectedDomain,
      },
    });

  const { data: countrySubComponentsRate, ...countrySubComponentsRateState } =
    useFindAll<SubComponent>({
      path: `/dashboard/components/${selectedComponent}/subcomponents/average-rate/country/${countryCode}`,
      isProtected: false,
      tqOptions: {
        enabled: !!selectedComponent,
      },
    });

  // Child accordion with nested accordions
  const childAccordionItems = countryComponentsRate?.map((component) => ({
    value: component.id,
    trigger: (
      <div
        className="flex items-center gap-2 px-3 rounded-md"
        onClick={() => {
          setSelectedComponent(component.id);
        }}
      >
        <Icon icon="solar:map-linear" className="text-dark" />
        <span className="text-sm font-bold text-dark">{component.name}</span>
      </div>
    ),
    content: (
      <div
        className={cn(
          "overflow-hidden bg-white rounded-sm mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4 py-5 px-10"
        )}
      >
        {!countrySubComponentsRateState.isLoading &&
          (countrySubComponentsRate as unknown as SubComponent[])?.map(
            ({ description, averagePrimaryRate, name }, index) => (
              <SubComponentCard
                key={index}
                content={description}
                score={averagePrimaryRate}
                title={name}
              />
            )
          )}
        {countrySubComponentsRateState.isLoading && (
          <DomainComponentCardSkeleton />
        )}
      </div>
    ),
  }));

  // Parent accordion with nested accordions
  const parentAccordionItems = countryDomainsRate?.map((domain) => ({
    value: domain.id,
    trigger: (
      <div className="flex items-center gap-2 px-3 rounded-md">
        <Icon icon="solar:map-linear" className="text-dark" />
        <span className="text-sm font-bold text-dark">{domain.name}</span>
      </div>
    ),
    content: (
      <div className="flex flex-col gap-3 p-3 border">
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
  }));

  return (
    <div className="flex flex-col gap-3 mt-4 bg-layout-bg/15 p-4 rounded-md">
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
