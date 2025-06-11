"use client";

import { Button, Progress, Select } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import React from "react";

export interface Domain {
  id: string;
  name: string;
  componentsCount: number;
  subComponentsCount: number;
  progress: number;
}

export interface FilterOption {
  year: number;
}

interface Props {
  title: string;
  subtitle: string;
  domains: Domain[];
  filterOptions?: FilterOption[];
  groupId: string;
}

export function GroupedAssessment({
  title,
  subtitle,
  domains,
  filterOptions,
}: Props) {
  const router = useRouter();

  const handleSelect = (_value?: FilterOption) => {
    //TODO: Implement filtering the domains based on the selected year for the group
  };
  const handleDomainClick = (id: string) => {
    //TODO: Implement navigation to the domain detail page
    router.push(`/assessment/detail/domain/${id}`);
  };
  const handleFill = (id: string) => {
    //TODO: Implement filling the domain with domain id
    router.push(`/assessment/domain/${id}/fill`);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between w-full h-16 rounded-lg bg-basic-200 px-4 py-3">
        <div className="flex flex-col items-start gap-1">
          <span className="text-sm font-bold">{title}</span>
          <span className="text-xs font-normal">{subtitle}</span>
        </div>
        {filterOptions && (
          <div className="flex w-24 h-5 items-center justify-center">
            <Select<FilterOption>
              placeholder="Year"
              options={filterOptions}
              valueKey="year"
              labelKey="year"
              onSelect={handleSelect}
              size="lg"
            />
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        {domains.map((domain) => (
          <div
            key={domain.name}
            className="flex flex-col w-60 min-h-56 border border-dark-lighter bg-card rounded-xl p-4 justify-between"
          >
            <div
              className="flex flex-col gap-3 items-start text-wrap"
              onClick={() => handleDomainClick(domain.id)}
            >
              <h3 className="text-sm font-bold">{domain.name}</h3>
              <div className="flex items-center">
                <span className="text-xs font-normal">Components :</span>
                <span className="text-sm font-bold">
                  {domain.componentsCount}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-xs font-normal">Sub-Components :</span>
                <span className="text-sm font-bold">
                  {domain.subComponentsCount}
                </span>
              </div>
            </div>
            <div className="flex flex-col w-full justify-between items-center gap-4">
              <div className="flex w-full flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">
                    Progress
                  </span>
                  <span className="text-xs font-semibold text-dark-light">
                    {domain.progress}%
                  </span>
                </div>
                <Progress
                  value={domain.progress}
                  color="#00B156"
                  size="md"
                  shape="circular"
                />
                <div className="flex w-full items-center mt-4">
                  <Button
                    size="fullSm"
                    variant="outline"
                    onClick={() => handleFill(domain.id)}
                  >
                    <div className="flex items-center justify-center gap-4">
                      Fill
                      <Icon icon={"lucide:chevron-right"} />
                    </div>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}{" "}
      </div>
    </div>
  );
}
