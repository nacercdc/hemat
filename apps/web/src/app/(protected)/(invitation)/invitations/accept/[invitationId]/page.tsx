"use client";

import { useParams, useSearchParams } from "next/navigation";
import InvitationAcceptance from "~/components/modules/invitations/InvitationAcceptance";

export default function InvitationAcceptancePage() {
  const { invitationId } = useParams();
  const searchParams = useSearchParams();

  const invitationEmail = searchParams.get("email") || "";
  const invitationAssessmentName = searchParams.get("assessmentName") || "";

  return (
    <InvitationAcceptance
      invitationId={invitationId as string}
      invitationEmail={invitationEmail}
      assessmentName={invitationAssessmentName}
    />
  );
}
