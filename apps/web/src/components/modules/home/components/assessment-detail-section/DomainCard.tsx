"use client";

import { Progress } from "@etm/web-ui-components";
import React from "react";
import { cn } from "~/utils/cn.util";
import { useSelectedDomain } from "../../context/selected-domain/useSelectedDomain";
import { Domains } from "../../constants";

type Scales = "Initial" | "Developing" | "Defined" | "Managed" | "Optimized";

const ScalesMap: Record<number, { label: Scales; color: string }> = {
  1: { label: "Initial", color: "#FF0101" },
  2: { label: "Developing", color: "#FFC000" },
  3: { label: "Defined", color: "#FFFD02" },
  4: { label: "Managed", color: "#00B0F0" },
  5: { label: "Optimized", color: "#11B050" },
};

interface Props {
  domainType: "summary" | "single";
  icon: React.ReactNode;
  name: string;
  result: number;
}

export function DomainCard({ domainType, icon, name, result }: Props) {
  const selectedDomainCtx = useSelectedDomain();

  return (
    <div
      onClick={() => {
        if (selectedDomainCtx?.selectedDomain?.name === name) {
          selectedDomainCtx?.setSelectedDomain(undefined);
          return;
        }
        selectedDomainCtx?.setSelectedDomain(
          Domains.find((domain) => domain.name === name)
        );
      }}
      className={cn(
        "flex gap-2 rounded-md bg-white min-w-80 max-w-min h-28 p-4 cursor-pointer",
        domainType === "summary" && "border-t-2",
        domainType === "single" && "border-l-2"
      )}
      style={{
        borderColor: `${ScalesMap[result]?.color}`,
        backgroundColor: `${selectedDomainCtx?.selectedDomain?.name === name ? `${ScalesMap[result]?.color}30` : "#fff"}`,
      }}
    >
      {domainType !== "summary" && icon}
      <div className="flex flex-col justify-between gap-2 w-full">
        <span
          className={cn(
            "text-xs font-medium",
            domainType === "summary" && "font-bold text-2xl"
          )}
        >
          {name}
        </span>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <span className="text-xs">{ScalesMap[result]?.label}</span>
            <div
              className={cn(
                "flex items-center justify-center rounded-sm text-white w-5 h-5 text-xs font-medium",
                result === 3 && "text-black"
              )}
              style={{ backgroundColor: `${ScalesMap[result]?.color}` }}
            >
              {result}
            </div>
          </div>
          <Progress color={`${ScalesMap[result]?.color}`} value={result * 20} />
        </div>
      </div>
    </div>
  );
}
