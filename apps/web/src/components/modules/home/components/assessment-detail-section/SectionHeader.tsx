"use client";

import { DropdownMenu } from "@etm/web-ui-components";
import React from "react";

export function SectionHeader() {
  return (
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <span className="font-bold text-sm">Select Year</span>
        <span className="font-medium text-xs text-dark-light">
          Choose a year to see data for that specific period.
        </span>
      </div>
      <div>
        <DropdownMenu
          label="Select Year"
          placeholder="Filter By Year"
          align="end"
          options={[
            { label: 2024, value: "2024" },
            { label: 2025, value: "2025" },
          ]}
          size="lg"
        />
      </div>
    </div>
  );
}
