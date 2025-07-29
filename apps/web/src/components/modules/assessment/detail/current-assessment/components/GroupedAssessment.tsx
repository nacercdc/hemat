"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AssessmentDomainCard from "../../components/AssessmentDomainCard";
import type {
  Domain,
  GroupTagType,
} from "../../components/AssessmentDomainCard";
import type { Access } from "~/libs/models/assessment.model";

interface Props {
  assessmentId: string;
  title: string;
  subtitle: string;
  domains: Domain[];
  groupTag: GroupTagType;
  groupId?: string;
  access?: Access;
}

export function GroupedAssessment({
  groupTag,
  groupId,
  title,
  subtitle,
  domains,
  access,
}: Props) {
  const router = useRouter();
  const onDetailViewClickHandler = (domainId: string, groupId?: string) => {
    router.push(
      `current-assessments/${domainId}/${groupId ? `&groupId=${groupId}` : ""}`
    );
  };
  const onFillClickHandler = (id: string, groupId?: string) => {
    router.push(
      `current-assessments/${id}/fill${groupTag === "primary" ? "?as=primary" : "?as=member"}${groupId ? `&groupId=${groupId}` : ""}`
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
            groupTag={groupTag}
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
