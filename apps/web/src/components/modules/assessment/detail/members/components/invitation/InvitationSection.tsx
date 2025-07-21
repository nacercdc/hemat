"use client";

import React from "react";
import { Icon } from "@iconify/react";
import InvitationList from "./InvitationList";
import type { AssessmentGroup } from "~/libs/models/assessment-member.model";
import InvitationListSkeleton from "./InvitationListSkeleton";

interface Props {
  assessmentGroups: AssessmentGroup[] | undefined;
  isLoading: boolean;
  emails: string[];
}

export default function InvitationSection({
  assessmentGroups,
  isLoading,
  emails,
}: Props) {
  const noInvitations =
    (assessmentGroups?.length ?? 0) === 0 && emails.length === 0;

  if (noInvitations) {
    return (
      <div className="flex flex-col gap-4 items-center align-middle">
        <Icon icon="mdi:users-add" className="!w-8 !h-8" />
        <span className="text-xm font-semibold">No Invited Participants</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {isLoading && <InvitationListSkeleton />}
      {assessmentGroups?.length && (
        <InvitationList assessmentGroups={assessmentGroups} />
      )}
    </div>
  );
}
