"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AssessmentDomainCard from "../../components/AssessmentDomainCard";
import type { Domain } from "../../components/AssessmentDomainCard";
import type { Access } from "~/libs/models/assessment.model";
import type { GroupIDType } from "..";

interface Props {
  title: string;
  subtitle: string;
  domains: Domain[];
  groupId: GroupIDType;
  access?: Access;
}

export function GroupedAssessment({
  groupId,
  title,
  subtitle,
  domains,
  access,
}: Props) {
  const router = useRouter();
  const onDetailViewClickHandler = (id: string) => {
    router.push(`current-assessments/${id}`);
  };
  const onFillClickHandler = (id: string) => {
    router.push(
      `current-assessments/${id}/fill${groupId !== "primary" ? "?as=member" : ""}`
    );
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
        {domains?.map((domain) => (
          <AssessmentDomainCard
            key={domain.id}
            domain={domain}
            groupId={groupId}
            onDetailViewClickHandler={onDetailViewClickHandler}
            onFillClickHandler={onFillClickHandler}
            access={access}
          />
        ))}
      </div>
    </div>
  );
}
