"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AssessmentDomainCard from "../../components/AssessmentDomainCard";
import type {
  Domain,
  GroupTagType,
} from "../../components/AssessmentDomainCard";
import type { Access, StatusType } from "~/libs/models/assessment.model";
import { Button } from "@etm/web-ui-components";
import { cn } from "~/utils/cn.util";

interface Props {
  assessmentId: string;
  title: string;
  subtitle: string;
  domains: Domain[];
  groupTag: GroupTagType;
  groupId?: string;
  access?: Access;
  status?: StatusType;
  actionLoading?: boolean;
  onAction?: () => void;
}

export function GroupedAssessment({
  groupTag,
  groupId,
  title,
  subtitle,
  domains,
  access,
  status,
  actionLoading = false,
  onAction,
}: Props) {
  const router = useRouter();
  const onDetailViewClickHandler = (domainId: string, groupId?: string) => {
    router.push(
      `current-assessments/${domainId}?${groupId ? `groupId=${groupId}` : ""}`
    );
  };
  const onFillClickHandler = (id: string, groupId?: string) => {
    router.push(
      `current-assessments/${id}/fill${groupTag === "primary" ? "?as=primary" : "?as=member"}${groupId ? `&groupId=${groupId}` : ""}`
    );
  };

  return (
    <div className="flex flex-col gap-3 cursor-pointer">
      <div
        className={cn(
          "flex items-center justify-between w-full h-16 rounded-lg py-3",
          { "bg-card px-2": groupTag === "primary" }
        )}
      >
        <div className="flex flex-col items-start gap-1">
          <span className="text-sm font-bold">{title}</span>
          <span className="text-xs font-normal">{subtitle}</span>
        </div>
        {status === "completed" && access?.role === "primary" && (
          <div className="bg-card p-2 flex justify-end">
            <Button
              disabled={!onAction}
              onClick={onAction}
              loading={actionLoading}
            >
              Submit
            </Button>
          </div>
        )}
        {status === "submitted" &&
          access?.role === "primary" &&
          groupTag === "primary" && (
            <div className="bg-card">
              <Button disabled>Submitted</Button>
            </div>
          )}
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
            status={status}
          />
        ))}
      </div>
    </div>
  );
}
