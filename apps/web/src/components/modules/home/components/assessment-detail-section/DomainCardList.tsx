"use client";

import React from "react";
import { DomainCard } from "./DomainCard";
import { domainScores } from "../../constants";

export interface DomainScore {
  name: string;
  result: number;
  type: "single" | "summary";
  icon?: React.ReactNode;
}

export function DomainCardList() {
  return (
    <div className="flex overflow-x-auto gap-4">
      {domainScores.map(({ name, result, type, icon }) => (
        <DomainCard
          key={name}
          icon={icon}
          name={name}
          domainType={type}
          result={result}
        />
      ))}
    </div>
  );
}
