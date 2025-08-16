"use client";

import { Button, useToast } from "@etm/web-ui-components";
import { INVITATION_LIST_KEY } from "./components/table";
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { useRouter } from "next/navigation";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import type {
  Invitation,
  InvitationIncludable,
} from "~/libs/models/invitaion.model";

interface Props {
  invitationId: string;
  invitationEmail: string;
  assessmentName?: string;
}
export default function InvitationAcceptance({
  invitationId,
  invitationEmail,
  assessmentName,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const { data: invitation, ...invitationState } = useFindById<
    Invitation,
    InvitationIncludable
  >({
    path: `/assessments/invitations/${invitationId}`,
    queries: {
      include: ["assessment"],
    },
    tqOptions: {
      enabled: !!invitationId,
    },
  });

  const { mutate: acceptInvitation, ...acceptInvitationState } = useAddMutation(
    `assessments/${invitation?.assessment.id}/invitations/accept`
  );

  const onInvitationAcceptHandler = () => {
    acceptInvitation(
      {
        data: {
          email: invitationEmail,
          invitationId: invitationId,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Invitation have been accepted successfully.",
            variant: "success",
          });
          router.push("/dashboard");
          queryClient.invalidateQueries({
            queryKey: [INVITATION_LIST_KEY],
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-col w-full p-6 items-center justify-center">
      {invitation?.status === "pending" && (
        <>
          <h2 className="text-2xl font-semibold text-center mb-4">
            You are Invited!
          </h2>
          <p className="mb-6 text-center">
            {assessmentName && (
              <>
                For the assessment <strong>{assessmentName}</strong>,{" "}
              </>
            )}
            join the assessment by accepting the invitation below.
          </p>
          <Button
            onClick={onInvitationAcceptHandler}
            loading={acceptInvitationState.isPending}
            disabled={
              acceptInvitationState.isPending || invitationState.isLoading
            }
          >
            {acceptInvitationState.isPending ? "Accepting..." : "Accept"}
          </Button>
        </>
      )}

      {invitation?.status === "accepted" && (
        <>
          <h2 className="text-2xl font-semibold text-center mb-4">
            Invitation Accepted
          </h2>
          <p className="mb-6 text-center">
            You’ve already accepted this invitation.
          </p>
        </>
      )}

      {invitation?.status === "rejected" && (
        <>
          <h2 className="text-2xl font-semibold text-center  mb-4">
            Invitation Declined
          </h2>
          <p className="mb-6 text-center">You have declined this invitation.</p>
        </>
      )}

      {!invitation?.status && (
        <>
          <h2 className="text-2xl font-semibold text-center  mb-4">
            Invitation Not Found
          </h2>
          <p className="mb-6 text-center">
            This invitation may be invalid or expired.
          </p>
        </>
      )}
    </div>
  );
}
