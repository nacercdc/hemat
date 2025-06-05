"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Assessment, StatusType } from "~/libs/models/assessment.model";
import { Badge, BadgeVariants } from "@etm/web-ui-components";
import SkeletonForDetail from "./components/SkeletonForDetail";
import GroupsList from "../../components/members/GroupsList";
import LabeledValue from "./components/LabeledValue";
import MemberRoleCard from "../../components/members/MemberRoleCard";

export default function AssessmentOverview() {
  const StatusVariantClasses: Record<StatusType, BadgeVariants["variant"]> = {
    Draft: "dark",
    Pending: "warning",
    Closed: "destructive",
    Ready: "info",
    "In-Progress": "progress",
    Completed: "success",
  };
  const [assessmentData, setAssessmentData] = useState<Assessment>();
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const id = params.id;
  useEffect(() => {
    setIsLoading(true);
    if (typeof id === "string") {
      mockAssessmentsFetch(id).then((data) => {
        setAssessmentData(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) {
    return <SkeletonForDetail />;
  }
  return (
    <div className="flex items-start flex-wrap justify-between  gap-4">
      <div className="lg:w-3/5 w-full flex flex-col gap-3">
        <div className="bg-dark-lighter/5 p-4 rounded-sm">
          <h1 className="text-sm font-bold">Status</h1>
          <Badge
            text={`${assessmentData?.status}`}
            shape="circular"
            variant={
              assessmentData?.status
                ? StatusVariantClasses[assessmentData.status]
                : StatusVariantClasses["Pending"]
            }
          />
        </div>
        <div className="bg-dark-lighter/5 p-4 rounded-sm  flex gap-10">
          <div className="flex flex-col gap-3">
            <LabeledValue label="Name :" value={assessmentData?.name} />
            <LabeledValue
              label="Created By :"
              value={`${assessmentData?.createdBy.firstName} ${assessmentData?.createdBy.lastName}`}
            />
            <LabeledValue
              label="Country :"
              value={assessmentData?.country.name}
            />
            <LabeledValue label="Organization :" value="HCI" />
          </div>
          <div className="flex flex-col gap-3">
            <LabeledValue
              label="Start Date :"
              value={assessmentData?.startDate}
            />
            <LabeledValue label="End Date :" value={assessmentData?.endDate} />
          </div>
        </div>
        <div className="bg-dark-lighter/5 p-4 rounded-sm flex flex-col gap-3">
          <h1 className="text-sm font-bold">Description</h1>
          <div className="text-sm bg-white rounded-sm p-4">
            {assessmentData?.description ? (
              <p>{assessmentData.description}</p>
            ) : (
              <p>No Description</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex-1 bg-dark-lighter/5 p-2 rounded-sm gap-2 flex flex-col">
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
        <GroupsList />
      </div>
    </div>
  );
}
//TODO the is dummy data
async function mockAssessmentsFetch(id: string): Promise<Assessment> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const mockAssessment: Assessment = {
    id: parseInt(id),
    name: "Mock Assessment",
    createdBy: {
      firstName: "John",
      lastName: "Doe",
    },
    startDate: "2025-01-01",
    endDate: "2025-01-31",
    country: {
      name: "Ethiopia",
    },
    status: "Pending",
    createdAt: new Date().toISOString(),
  };
  return mockAssessment;
}
