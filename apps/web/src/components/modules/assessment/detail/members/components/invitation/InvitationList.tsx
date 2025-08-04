"use client";

import React from "react";
import { formatDateToYYYYMMDD } from "@etm/utilities";
import { capitalizeFirstLetter } from "~/utils/string.util";
import type { AssessmentGroup } from "~/libs/models/assessment-member.model";
import MemberInfo from "../MemberInfo";

interface Props {
  assessmentGroups: AssessmentGroup[];
}
export default function InvitationList({ assessmentGroups }: Props) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-[40%_1fr_1fr] gap-6 w-full  items-center font-semibold text-sm p-2 ">
        <div>Invited participants</div>
        <div className="hidden md:block text-right">Date</div>
        <div className="hidden md:block text-right">Status</div>
      </div>

      {assessmentGroups.map((assessmentGroup, groupIdx) => (
        <div className="flex flex-col  px-2 w-full " key={groupIdx}>
          {Array.isArray(assessmentGroup.invitations) &&
            assessmentGroup.invitations.map((invitation, inviteIdx) => (
              <div
                key={`${groupIdx}-${inviteIdx}`}
                className="grid grid-cols-1 sm:grid-cols-[40%_1fr_1fr] gap-1 md:gap-6 w-full text-sm py-1"
              >
                <MemberInfo email={invitation.email} role={invitation.role} />
                <span className="text-sm hidden md:block text-right  ">
                  {formatDateToYYYYMMDD(
                    invitation.createdAt as unknown as Date
                  )}
                </span>
                <span
                  className={`text-sm font-semibold  hidden md:block text-right ${
                    invitation.status === "pending"
                      ? "text-dark"
                      : invitation.status === "accepted"
                        ? "text-primary-600"
                        : "text-destructive-500"
                  }`}
                >
                  {capitalizeFirstLetter(invitation.status ?? "Reject")}
                </span>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
