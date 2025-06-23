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
  title: string;
  subtitle: string;
  domains: Domain[];
}

export function AssessmentRoadmap({ title, subtitle, domains }: Props) {
  const router = useRouter();
  const onDetailViewClickHandler = (id: string) => {
    //TODO: Implement navigation to the domain detail page
    router.push(`/roadmap/detail/domain/${id}`);
  };
  const onFillClickHandler = (id: string) => {
    //TODO: Implement filling the domain with domain id
    router.push(`/roadmap/domain/${id}/fill`);
  };

  return (
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
  );
}
