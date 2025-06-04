"use client";

import React, { useEffect, useState } from "react";
import { PageContainer } from "../../components/PageContainer";
import { useParams } from "next/navigation";
import { Assessment, StatusType } from "~/libs/models/assessment.model";
import { Badge, BadgeVariants, Skeleton } from "@etm/web-ui-components";
import GroupsLeaderDefault from "./members/components/GroupsLeaderDefault";
import TeamLeaderDefault from "./members/components/TeamLeaderDefault";
import SkeletonForDetail from "./componets/SkeletonForDetail";

export default function AssessmentDetailPage() {
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
    <PageContainer pageTitle={`Assessment ${id}`} includeBreadcrumb={false}>
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
              <div className="flex gap-4">
                <span className="text-sm font-bold">Name :</span>
                <span className="text-sm font-thin">
                  {assessmentData?.name}
                </span>
              </div>

              <div className="flex gap-4">
                <span className="text-sm font-bold">Created By :</span>
                <span className="text-sm font-thin">{`${assessmentData?.createdBy.firstName} ${assessmentData?.createdBy.lastName}`}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-sm font-bold">Country </span>
                <span className="text-sm font-thin">
                  {assessmentData?.country.name}
                </span>
              </div>

              <div className="flex gap-4">
                <span className="text-sm font-bold">Organization </span>
                <span className="text-sm font-thin">HCI</span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-4">
                <span className="text-sm font-bold">Start Date :</span>
                <span className="text-sm font-thin">
                  {assessmentData?.startDate}
                </span>
              </div>

              <div className="flex gap-4">
                <span className="text-sm font-bold">End Date :</span>
                <span className="text-sm font-thin">
                  {assessmentData?.endDate}
                </span>
              </div>
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
          <GroupsLeaderDefault />
          <TeamLeaderDefault />
        </div>
      </div>
    </PageContainer>
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
