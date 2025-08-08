"use client";

import React from "react";
import { Icon } from "@iconify/react";
import InvitationList from "./InvitationList";
import type { AssessmentGroup } from "~/libs/models/assessment-member.model";
import InvitationListSkeleton from "./InvitationListSkeleton";

interface Props {
  assessmentGroups: AssessmentGroup[] | undefined;
  isLoading: boolean;
}

export default function InvitationSection({
  assessmentGroups,
  isLoading,
}: Props) {
  if (assessmentGroups?.length === 0) {
    return (
      <div className="flex flex-col gap-4 items-center align-middle p-8">
        <Icon icon="mdi:users-add" className="!w-8 !h-8" />
        <span className="text-xm font-semibold">No Invited Participants</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full mb-4 bg-card rounded-b-md p-3 border border-t-0 border-secondary-100/80">
      {isLoading && <InvitationListSkeleton />}
      <h1 className="font-semibold">Invited participants</h1>

      {assessmentGroups?.length && (
        <InvitationList assessmentGroups={assessmentGroups} />
      )}
    </div>
  );
}
