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
    <>
      <div className="grid grid-cols-3 font-semibold text-sm p-2">
        <div>Invited participants</div>
        <div>Date</div>
        <div>Status</div>
      </div>

      {assessmentGroups.map((assessmentGroup, groupIdx) => (
        <div className="flex flex-col gap-2 px-2" key={groupIdx}>
          {Array.isArray(assessmentGroup.invitations) &&
            assessmentGroup.invitations.map((invitation, inviteIdx) => (
              <div
                key={`${groupIdx}-${inviteIdx}`}
                className="grid grid-cols-3 text-sm px-2"
              >
                <div className="flex items-center gap-3">
                  <MemberInfo email={invitation.email} role={invitation.role} />
                </div>

                <span className="text-sm">
                  {formatDateToYYYYMMDD(
                    invitation.createdAt as unknown as Date
                  )}
                </span>

                <span
                  className={`text-sm font-semibold ${
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
    </>
  );
}
