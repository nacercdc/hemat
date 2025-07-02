"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AssessmentDomainCard from "../../components/AssessmentDomainCard";

export interface Domain {
  id: string;
  name: string;
  componentsCount: number;
  subComponentsCount: number;
  progress: number;
}

interface Props {
  title: string;
  subtitle: string;
  domains: Domain[];
  groupId: string;
}

export function GroupedAssessment({ title, subtitle, domains }: Props) {
  const router = useRouter();
  const onDetailViewClickHandler = (id: string) => {
    router.push(`current-assessments/${id}`);
  };
  const onFillClickHandler = (id: string) => {
    router.push(`current-assessments/${id}/fill`);
  };

  return (
    <div className="flex flex-col gap-3 cursor-pointer">
      <div className="flex items-center justify-between w-full h-16 rounded-lg py-3">
        <div className="flex flex-col items-start gap-1">
          <span className="text-sm font-bold">{title}</span>
          <span className="text-xs font-normal">{subtitle}</span>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-6">
        {domains.map((domain) => (
          <AssessmentDomainCard
            key={domain.id}
            domain={domain}
            onDetailViewClickHandler={onDetailViewClickHandler}
            onFillClickHandler={onFillClickHandler}
          />
        ))}
      </div>
    </div>
  );
}
