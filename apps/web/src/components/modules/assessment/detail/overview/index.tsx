"use client";

import React from "react";
import { useParams } from "next/navigation";
import type {
  Assessment,
  AssessmentsIncludeAble,
  StatusType,
} from "~/libs/models/assessment.model";
import type { BadgeVariants } from "@etm/web-ui-components";
import { Badge } from "@etm/web-ui-components";
import SkeletonForDetail from "./components/SkeletonForDetail";
import LabeledValue from "./components/LabeledValue";
import GroupsList from "../components/GroupsList";
import MemberRoleCard from "../components/MemberRoleCard";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { formatDateToYYYYMMDD } from "@etm/utilities";

export function AssessmentOverview() {
  const StatusVariantClasses: Record<StatusType, BadgeVariants["variant"]> = {
    Draft: "dark",
    Pending: "warning",
    Closed: "destructive",
    Ready: "info",
    Completed: "success",
    "In-Progress": "progress",
  };
  const params = useParams();
  const assessmentId = params.id;
  const { data: assessment, ...assessmentState } = useFindById<
    Assessment,
    AssessmentsIncludeAble
  >({
    path: `assessments/${assessmentId as string}`,
    queries: {
      include: ["user", "members", "groups"],
    },
  });

  if (assessmentState.isLoading) {
    return <SkeletonForDetail />;
  }
  return (
    <div className="flex items-start flex-wrap justify-between  gap-4">
      <div className="lg:w-3/5 w-full flex flex-col gap-3">
        <div className="bg-dark-lighter/5 p-4 rounded-sm">
          <h1 className="text-sm font-bold">Status</h1>
          <Badge
            text={`${assessment?.status}`}
            shape="circular"
            variant={
              assessment?.status
                ? StatusVariantClasses[assessment.status]
                : StatusVariantClasses.Pending
            }
          />
        </div>
        <div className="bg-dark-lighter/5 p-4 rounded-sm  flex flex-wrap gap-10">
          <div className="flex flex-col gap-3">
            <LabeledValue label="Name :" value={assessment?.name} />
            <LabeledValue
              label="Created By :"
              value={`${assessment?.user?.name} `}
            />
            <LabeledValue label="Country :" value={assessment?.country.name} />
            <LabeledValue
              label="Organization :"
              value={assessment?.organization ?? "----"}
            />

            <LabeledValue
              label="Languages :"
              value={
                assessment?.languages ? (
                  <div className="flex flex-wrap gap-1 ">
                    {assessment?.languages?.map((lang) => (
                      <Badge
                        key={lang.code}
                        text={`${lang?.name}`}
                        shape={"circular"}
                        variant={"success"}
                      />
                    ))}
                  </div>
                ) : (
                  "---"
                )
              }
            />
          </div>
          <div className="flex flex-col gap-3">
            <LabeledValue
              label="Start Date :"
              value={
                assessment?.startDate
                  ? formatDateToYYYYMMDD(
                      assessment.startDate as unknown as Date
                    )
                  : undefined
              }
            />
            <LabeledValue
              label="End Date :"
              value={
                assessment?.endDate
                  ? formatDateToYYYYMMDD(assessment.endDate as unknown as Date)
                  : undefined
              }
            />
          </div>
        </div>
        <div className="bg-dark-lighter/5 p-4 rounded-sm flex flex-col gap-3">
          <h1 className="text-sm font-bold">Description</h1>
          <div className="text-sm bg-white rounded-sm p-4">
            {assessment?.description ? (
              <p>{assessment.description}</p>
            ) : (
              <p>No Description</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 bg-dark-lighter/5 p-2 rounded-sm gap-2 flex flex-col">
        {assessment?.groups?.length != 0 ? (
          <GroupsList groups={assessment?.groups} />
        ) : (
          <div className="flex flex-col gap-2 w-full">
            <MemberRoleCard
              title="Groups Leader"
              icon="meteor-icons:user"
              placeholderText="Group leader here"
            />
            <MemberRoleCard
              title="Team Leader"
              icon="mdi:group-add-outline"
              placeholderText="Team leader here"
            />
          </div>
        )}
      </div>
    </div>
  );
}
