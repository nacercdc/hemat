"use client";

import React from "react";
import { Select } from "@etm/web-ui-components";
import { useSelectedFilterYear } from "../../context/selected-filter-year/useSelectedFilterYear";

//TODO: just sample will be replaced by real data
export interface YearOption {
  label: number;
  value: number;
}

const yearOptions: YearOption[] = [
  {
    label: 2025,
    value: 2025,
  },
];

export function SectionHeader() {
  const selectedYearCtx = useSelectedFilterYear();

  const handleSelect = (value?: number) => {
    const selected = yearOptions.find((c) => c.label === value);

    if (selected) {
      selectedYearCtx?.setSelectedFilterYear(selected);
    } else {
      selectedYearCtx?.setSelectedFilterYear(undefined);
    }
  };
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <span className="font-bold text-sm">Select Year</span>
        <span className="font-medium text-xs text-dark-light">
          Choose a year to see data for that specific period.
        </span>
      </div>
      <div>
        <Select<YearOption>
          options={yearOptions}
          onSelect={(c) => handleSelect(c?.value)}
          labelKey="label"
          valueKey="value"
          value={selectedYearCtx?.selectedFilterYear}
          placeholder="Filter by Year"
        />
      </div>
    </div>
  );
}
