"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { z } from "zod";
import type { ModalRef } from "@etm/web-ui-components";
import { Button, InputRHF, useToast } from "@etm/web-ui-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MemberRoleCard from "../../components/MemberRoleCard";
import MemberInfo from "./MemberInfo";
import MemberAction from "./MemberAction";
import { useParams } from "next/navigation";
import { Modal } from "@etm/web-ui-components";
import type {
  AssessmentGroup,
  AssessmentGroupIncludeAble,
  MemberInvitationGroup,
} from "~/libs/models/assessment-member.model";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { formatDateToYYYYMMDD } from "@etm/utilities";
import { capitalizeFirstLetter } from "~/utils/string.util";
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";

const addAssessmentInvitationSchema = z.object({
  email: z
    .string()
    .email({ message: "Enter a valid email" })
    .min(1, { message: "Email is required" }),
});

export type AddAssessmentInvitationFormData = z.infer<
  typeof addAssessmentInvitationSchema
>;

export function SendInvitation() {
  const [emails, setEmails] = useState<string[]>([]);
  const params = useParams();
  const assessmentId = params.id;
  const { toast } = useToast();
  const sendInvitationModalRef = useRef<ModalRef>(null);
  const openInvitationModal = () => sendInvitationModalRef.current?.openModal();

  const {
    control,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<AddAssessmentInvitationFormData>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(addAssessmentInvitationSchema),
  });

  const addEmailHandler = async (): Promise<void> => {
    const isValid = await trigger("email");
    if (!isValid) return;
    const newEmail = getValues("email").trim().toLowerCase();
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setValue("email", "");
    }
  };

  const removeEmailHandler = (email: string) => {
    setEmails((prev) => prev.filter((e) => e !== email));
  };

  const { mutate: sendInvitation, ...sendInvitationState } = useAddMutation<
    MemberInvitationGroup[]
  >(`assessments/${assessmentId as string}/invitations`);

  const { data: assessmentGroups, ...assessmentGroupsState } = useFindAll<
    AssessmentGroup,
    AssessmentGroupIncludeAble
  >({
    path: `/assessments/${assessmentId}/groups`,
    queries: {
      include: ["members", "members.user", "invitations"],
    },
    tqOptions: {
      queryKey: ["ASSESSMENT_GROUPS_KEY"],
    },
  });

  const onInvitationSubmitHandler = () => {
    if (emails.length === 0) return;
    const formatted: MemberInvitationGroup[] = [
      {
        group: null,
        invitations: emails.map((email) => ({
          email,
          role: "member",
        })),
      },
    ];

    sendInvitation(
      {
        data: formatted,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Invitations have been sent successfully.",
            variant: "success",
          });
          sendInvitationModalRef.current?.closeModal();
          setEmails([]);
          queryClient.invalidateQueries({
            queryKey: ["ASSESSMENT_GROUPS_KEY"],
          });
        },
      }
    );
  };
  return (
    <div className="flex items-start flex-wrap justify-between gap-4 bg-dark-lighter/5 ">
      <div className="lg:w-3/5 w-full flex flex-col gap-3 p-2">
        <div className="flex gap-3">
          <InputRHF
            name="email"
            control={control}
            placeholder="Write email of the participant's"
          />
          <Button
            leftNode={<Icon icon={"mdi:users-add"} className="!w-5 !h-5" />}
            size="lg"
            color="primaryLight"
            variant="outline"
            onClick={addEmailHandler}
          >
            Add
          </Button>
        </div>
        {emails.length != 0 && (
          <div className="flex flex-col bg-card rounded-sm p-2">
            <div>
              {emails.map((email) => (
                <div key={email} className="flex justify-between">
                  <MemberInfo email={email} />
                  <MemberAction
                    id={email}
                    refetch={() => removeEmailHandler(email)}
                    optionsList={["Remove", "Make Primary"]}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="lg" onClick={openInvitationModal}>
                Send Invitation
              </Button>
            </div>
          </div>
        )}
        {assessmentGroups?.data.length == 0 && emails.length == 0 ? (
          <div className="flex flex-col gap-4 items-center align-middle">
            <Icon icon={"mdi:users-add"} className="!w-8 !h-8" />
            <span className="text-xm font-semibold">
              No Invited Participants
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-4 w-full">
            {assessmentGroups?.data.length != 0 && (
              <div className="grid grid-cols-3 font-semibold text-sm p-">
                <div>Invited participants</div>
                <div>Date</div>
                <div>Status</div>
              </div>
            )}
            {assessmentGroups?.data.map((assessmentGroup, index) => (
              <div className="flex flex-col gap-2" key={index}>
                {assessmentGroup.invitations &&
                  assessmentGroup.invitations.map((invitation, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-3  text-sm p-2  "
                    >
                      <div className="flex items-center gap-3">
                        <MemberInfo
                          email={invitation.email}
                          role={invitation.role}
                        />
                      </div>
                      <span className="text-sm ">
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
                              : invitation.status === "rejected"
                                ? "text-"
                                : "text-destructive-500"
                        }`}
                      >
                        {capitalizeFirstLetter(invitation.status as string)}
                      </span>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex-1 rounded-sm gap-2 flex flex-col p-2">
        <MemberRoleCard
          title="Groups Leader"
          icon="meteor-icons:user"
          placeholderText="Group leader here"
        />
        <MemberRoleCard
          title="Team Leader"
          icon="mdi:group-add-outline"
          placeholderText="Team leader here"
        />
      </div>
      <Modal ref={sendInvitationModalRef}>
        <div className="flex flex-col gap-4 items-center p-4">
          <div className="w-fit bg-primary-50 flex items-center p-4 rounded-full">
            <Icon
              icon={"material-symbols:forward-to-inbox-outline-rounded"}
              className="!w-8 !h-8 text-primary-300"
            />
          </div>
          <div>
            Are you sure you want to send invitations to this list of users?
          </div>

          <div>
            <Button
              type="submit"
              size="lg"
              onClick={onInvitationSubmitHandler}
              loading={sendInvitationState.isPending}
            >
              Yes send invitation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
