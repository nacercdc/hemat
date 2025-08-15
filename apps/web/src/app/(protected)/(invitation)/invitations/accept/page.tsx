"use client";

import { useParams } from "next/navigation";
import InvitationAcceptance from "~/components/modules/invitations/InvitationAcceptance";

export default function InvitationAcceptancePage() {
  const { id, email, assessmentName } = useParams();
  return (
    <InvitationAcceptance
      invitationId={id as string}
      email={email as string}
      assessmentName={assessmentName as string}
    />
  );
}
