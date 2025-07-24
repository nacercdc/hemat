"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AssessmentDomainCard from "../../components/AssessmentDomainCard";
import type { Domain } from "../../components/AssessmentDomainCard";
import type { Access } from "~/libs/models/assessment.model";
interface Props {
  domains: Domain[];
  access?: Access;
}

export function AssessmentRoadmap({ domains, access }: Props) {
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
          groupTag="roadmaps"
          access={access}
          onDetailViewClickHandler={onDetailViewClickHandler}
          onFillClickHandler={onFillClickHandler}
        />
      ))}
    </div>
  );
}
