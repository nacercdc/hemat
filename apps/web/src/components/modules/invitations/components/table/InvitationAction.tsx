import type { ModalRef } from "@etm/web-ui-components";
import { Button, DropdownMenu, Modal, useToast } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRef } from "react";
import type { Invitation } from "~/libs/models/invitaion.model";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";
import { INVITATION_LIST_KEY } from ".";

interface Props {
  invitation: Invitation;
}
export default function InvitationAction({ invitation }: Props) {
  const invitationModalRef = useRef<ModalRef>(null);
  const { toast } = useToast();

  const { mutate: acceptInvitation, ...acceptInvitationState } = useAddMutation(
    `assessments/${invitation.assessmentId}/invitations`
  );

  const onInvitationAcceptHandler = () => {
    acceptInvitation(
      {
        data: {
          email: invitation.email,
          invitationId: invitation.id,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Invitation have been accepted successfully.",
            variant: "success",
          });
          invitationModalRef.current?.closeModal();
          queryClient.invalidateQueries({
            queryKey: [INVITATION_LIST_KEY],
          });
        },
      }
    );
  };

  return (
    <>
      <DropdownMenu
        triggerTextAlign="end"
        align="end"
        trigger={
          <Icon
            icon="mi:options-horizontal"
            className="text-xl text-right text-dark"
          />
        }
        options={[
          {
            value: "accept",
            label: "Accept",
            leftNode: (
              <Icon
                icon="healthicons:i-documents-accepted-outline"
                className="text-lg text-dark"
              />
            ),
            onClick: invitationModalRef.current?.openModal,
          },
        ]}
      />
      <Modal ref={invitationModalRef}>
        <div className="flex flex-col w-full p-6 items-center justify-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            You're Invited!
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Join the assessment by accepting the invitation below.
          </p>
          <Button
            onClick={onInvitationAcceptHandler}
            loading={acceptInvitationState.isPending}
            disabled={acceptInvitationState.isPending}
          >
            {acceptInvitationState.isPending ? "Accepting..." : "Accept"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
