"use client";

import React from "react";
import { Progress } from "@etm/web-ui-components";
import { cn } from "~/utils/cn.util";
import { useSelectedDomain } from "../../context/selected-domain/useSelectedDomain";
import type { IDomainCardType } from "./DomainCardList";

type Scales =
  | "No Assessment"
  | "Initial"
  | "Developing"
  | "Defined"
  | "Managed"
  | "Optimized";

// TODO: will be removed as soon as we fetch measurement scales from API
export const ScalesMap: Record<number, { label: Scales; color: string }> = {
  0: { label: "No Assessment", color: "#FF0101" },
  1: { label: "Initial", color: "#FF0101" },
  2: { label: "Developing", color: "#FFC000" },
  3: { label: "Defined", color: "#FFFD02" },
  4: { label: "Managed", color: "#00B0F0" },
  5: { label: "Optimized", color: "#11B050" },
};

interface Props {
  domain: IDomainCardType;
}

export function DomainCard({ domain }: Props) {
  const selectedDomainCtx = useSelectedDomain();

  return (
    <div
      onClick={() => {
        if (selectedDomainCtx?.selectedDomain?.name === name) {
          selectedDomainCtx?.setSelectedDomain(undefined);
          return;
        }
        selectedDomainCtx?.setSelectedDomain(domain);
      }}
      className={cn(
        "flex gap-2 rounded-md bg-white min-w-72 max-w-min h-28 p-4 cursor-pointer",
        domain.type === "summary" && "border-t-2",
        domain.type === "single" && "border-l-2"
      )}
      style={{
        borderColor: `${ScalesMap[domain.averageRate]?.color}`,
        backgroundColor: `${selectedDomainCtx?.selectedDomain?.name === domain.name ? `${ScalesMap[domain.averageRate]?.color}30` : "#fff"}`,
      }}
    >
      {/* {domain.type !== "summary" && icon} */}
      <div className="flex flex-col justify-between gap-2 w-full">
        <span
          className={cn(
            "text-xs font-medium",
            domain.type === "summary" && "font-bold text-2xl"
          )}
        >
          {domain.name}
        </span>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs">
              {ScalesMap[domain.averageRate]?.label}
            </span>
            <div
              className={cn(
                "flex items-center justify-center rounded-sm text-white w-5 h-5 text-xs font-medium",
                domain.averageRate === 3 && "text-black"
              )}
              style={{
                backgroundColor: `${ScalesMap[domain.averageRate]?.color}`,
              }}
            >
              {domain.averageRate ? domain.averageRate : "?"}
            </div>
          </div>
          <Progress
            color={`${ScalesMap[domain.averageRate]?.color}`}
            value={domain.averageRate * 20}
          />
        </div>
      </div>
    </div>
  );
}
