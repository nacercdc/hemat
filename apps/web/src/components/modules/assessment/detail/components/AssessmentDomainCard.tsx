import React from "react";
import { Button, Progress } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { Access, StatusType } from "~/libs/models/assessment.model";

export type AssessmentRoleType = "primary" | "team-leader";
export type GroupTagType = "primary" | "my" | "rest" | "roadmaps";

export interface Domain {
  id: string;
  name: string;
  componentscount: number;
  subcomponentscount: number;
  progress: number;
  fillAccess: AssessmentRoleType;
}

interface Props {
  domain: Domain;
  access?: Access;
  status?: StatusType;
  groupTag: GroupTagType;
  groupId?: string;
  onDetailViewClickHandler: (domainId: string, groupId?: string) => void;
  onFillClickHandler: (id: string, groupId?: string) => void;
}

export default function AssessmentDomainCard({
  domain,
  access,
  status,
  groupTag,
  groupId,
  onDetailViewClickHandler,
  onFillClickHandler,
}: Props) {
  return (
    <div
      key={domain.name}
      className="flex flex-col w-60 min-h-56 border border-dark-lighter/20 bg-card rounded-xl p-4 justify-between"
    >
      <div
        className="flex flex-col gap-3 items-start text-wrap cursor-pointer"
        onClick={() => onDetailViewClickHandler(domain.id, groupId)}
      >
        <h3 className="text-sm font-bold">{domain.name}</h3>
        <div className="flex items-center">
          <span className="text-xs font-normal flex-wrap">Components :</span>
          <span className="text-sm font-bold">{domain.componentscount}</span>
        </div>
        <div className="flex items-center flex-wrap">
          <span className="text-xs font-normal">Sub-Components :</span>
          <span className="text-sm font-bold">{domain.subcomponentscount}</span>
        </div>
      </div>

      <div className="flex flex-col w-full justify-between items-center gap-4">
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-primary">Progress</span>
            <span className="text-xs font-semibold text-dark-light">
              {domain.progress}%
            </span>
          </div>

          <Progress
            value={domain.progress}
            color="#00B156"
            size="md"
            shape="circular"
          />
          <div className="flex w-full items-center mt-4">
            {((groupTag === "my" && access?.role === "primary") ||
              domain.fillAccess === access?.role) &&
              status !== "submitted" && (
                <Button
                  full
                  variant="outline"
                  rightNode={<Icon icon="lucide:chevron-right" />}
                  onClick={() => onFillClickHandler(domain.id, groupId)}
                >
                  Fill
                </Button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
