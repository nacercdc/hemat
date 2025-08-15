"use client";

import { Button, useToast } from "@etm/web-ui-components";
import { INVITATION_LIST_KEY } from "./components/table";
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { useRouter } from "next/navigation";

interface Props {
  invitationId: string;
  email: string;
  assessmentName?: string;
}
export default function InvitationAcceptance({
  invitationId,
  email,
  assessmentName,
}: Props) {
  const router = useRouter();
  const { toast } = useToast();

  //TODO: replace name by id
  const { mutate: acceptInvitation, ...acceptInvitationState } = useAddMutation(
    `assessments/${assessmentName}/invitations/accept`
  );

  const onInvitationAcceptHandler = () => {
    acceptInvitation(
      {
        data: {
          email: email,
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
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        You are Invited!
      </h2>
      <p className="text-gray-600 mb-6 text-center">
        {assessmentName && (
          <>
            For the assessment <strong>{assessmentName}</strong>,
          </>
        )}{" "}
        join the assessment by accepting the invitation below.
      </p>
      <Button
        onClick={onInvitationAcceptHandler}
        loading={acceptInvitationState.isPending}
        disabled={acceptInvitationState.isPending}
      >
        {acceptInvitationState.isPending ? "Accepting..." : "Accept"}
      </Button>
    </div>
  );
}
