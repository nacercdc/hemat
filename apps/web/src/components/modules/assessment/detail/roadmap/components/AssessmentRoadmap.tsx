"use client";
import { useRouter } from "next/navigation";
import React from "react";
import AssessmentDomainCard from "../../components/AssessmentDomainCard";
export interface Domain {
  id: string;
  name: string;
  componentsCount: number;
  subComponentsCount: number;
  progress: number;
}
interface Props {
  domains: Domain[];
}

export function AssessmentRoadmap({ domains }: Props) {
  const router = useRouter();
  const onDetailViewClickHandler = (id: string) => {
    router.push(`roadmap/${id}`);
  };
  const onFillClickHandler = (id: string) => {
    router.push(`roadmap/${id}/fill`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-6 ">
      {domains.map((domain) => (
        <AssessmentDomainCard
          key={domain.id}
          domain={domain}
          onDetailViewClickHandler={onDetailViewClickHandler}
          onFillClickHandler={onFillClickHandler}
        />
      ))}
    </div>
  );
}
