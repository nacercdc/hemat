"use client";

import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { isLightColor } from "../utils/luminacity.util";
import { Accordion } from "@etm/web-ui-components";
import { cn } from "~/utils/cn.util";

interface Metric {
  name: string;
  rate: number;
  color: string;
}

interface Props {
  countryStatuses: Record<string, Metric>;
}

export const CountriesAccordion = ({ countryStatuses }: Props) => {
  const accordionItems = [
    {
      value: "countries",
      trigger: (
        <div className="flex items-center gap-2">
          <Icon icon="solar:map-linear" />
          <span className="text-sm font-bold">Countries</span>
        </div>
      ),
      content: (
        <div className="space-y-2">
          {Object.entries(countryStatuses).map(([country, status]) => (
            <div
              key={country}
              className="flex items-center justify-between py-1 gap-4 border-b border-basic-200"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-4 rounded-sm"
                  style={{ backgroundColor: status.color }}
                />
                <span>{country}</span>
              </div>
              <div
                className="flex w-full border border-dashed px-6"
                style={{ borderColor: status.color }}
              />
              <div
                style={{ background: status.color }}
                className={cn(
                  "flex items-center justify-center w-9 h-6 rounded-sm font-bold text-sm",
                  isLightColor(status.color) ? "text-dark" : "text-card"
                )}
              >
                {status.rate}
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return <Accordion items={accordionItems} type="single" collapsible={true} />;
};
