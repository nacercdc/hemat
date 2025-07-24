"use client";

import React, { useRef, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { z } from "zod";
import type { ModalRef } from "@etm/web-ui-components";
import { Button, InputRHF, SelectRHF, useToast } from "@etm/web-ui-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { Modal } from "@etm/web-ui-components";
import type {
  AssessmentGroup,
  AssessmentGroupIncludeAble,
  MemberInvitationGroup,
} from "~/libs/models/assessment-member.model";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";
import MemberRoleCard from "../../../components/MemberRoleCard";
import MemberAction from "../MemberAction";
import MemberInfo from "../MemberInfo";
import InvitationSection from "./InvitationSection";
import InvitationListSkeleton from "./InvitationListSkeleton";

export const groupSchema = z.object({
  id: z
    .string()
    .min(1, { message: "Select the group that you want to invite" })
    .max(50, { message: "Group name is too long" }),
});

const addAssessmentInvitationSchema = z.object({
  newGroup: z.string().optional(),
  email: z
    .string()
    .email({ message: "Enter a valid email" })
    .min(1, { message: "Email is required" }),
  group: z.object({
    id: z.string().min(1, { message: "Select the group that you invite" }),
  }),
});

export type AddAssessmentInvitationFormData = z.infer<
  typeof addAssessmentInvitationSchema
>;

export function SendInvitation() {
  const [addNewGroupName, setAddNewGroupName] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const params = useParams();
  const assessmentId = params.id as string | undefined;
  const { toast } = useToast();
  const sendInvitationModalRef = useRef<ModalRef>(null);

  const { control, getValues, setValue, trigger } =
    useForm<AddAssessmentInvitationFormData>({
      defaultValues: {
        email: "",
        newGroup: "",
        group: {
          id: "",
        },
      },
      resolver: zodResolver(addAssessmentInvitationSchema),
    });
  const { mutate: sendInvitation, ...sendInvitationState } = useAddMutation<
    MemberInvitationGroup[]
  >(`assessments/${assessmentId}/invitations`);
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

  const openInvitationModal = () => sendInvitationModalRef.current?.openModal();
  const openTextFiledHandler = () => setAddNewGroupName((prev) => !prev);
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
    setEmails((prev = []) => prev.filter((e) => e !== email));
  };
  const onInvitationSubmitHandler = () => {
    if (emails.length === 0) return;
    const values = getValues();
    const formatted: MemberInvitationGroup[] = [
      {
        group: values.group?.id?.trim() || values.newGroup?.trim(),
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
  if (assessmentGroupsState.isLoading) {
    return <InvitationListSkeleton />;
  }
  return (
    <div className="flex items-start flex-wrap justify-between gap-4">
      <div className="lg:w-3/5 w-full flex flex-col gap-3 p-2 bg-dark-lighter/5 rounded-sm">
        <div className="flex gap-3">
          {assessmentGroups?.data?.length != 0 && !addNewGroupName && (
            <SelectRHF<AssessmentGroup, AddAssessmentInvitationFormData>
              control={control}
              name="group"
              labelKey="name"
              placeholder="Select team"
              valueKey="id"
              options={assessmentGroups?.data ?? []}
            />
          )}
          {addNewGroupName && (
            <InputRHF
              name="newGroup"
              control={control}
              placeholder="Write name of the team"
            />
          )}

          <Button
            type="button"
            leftNode={
              <Icon icon={"ic:baseline-groups"} className="!w-5 !h-5" />
            }
            size="lg"
            color="primaryLight"
            variant="outline"
            onClick={openTextFiledHandler}
          >
            {addNewGroupName ? "Exist team" : "Create new"}
          </Button>
        </div>
        <div className="flex gap-3">
          <InputRHF
            name="email"
            control={control}
            placeholder="Enter the email addresses of the participants you want to invite "
          />
          <Button
            leftNode={<Icon icon={"mdi:user-add"} className="!w-5 !h-5" />}
            size="lg"
            color="primaryLight"
            variant="outline"
            onClick={addEmailHandler}
          >
            Add
          </Button>
        </div>

        {emails.length > 0 && (
          <div className="flex flex-col bg-card rounded-sm p-2">
            {emails.map((email) => (
              <div key={email} className="flex justify-between">
                <MemberInfo email={email} />
                <MemberAction
                  userId={email}
                  refetch={() => removeEmailHandler(email)}
                  optionsList={["Cancel Invitation"]}
                />
              </div>
            ))}

            <div className="flex justify-end">
              <Button type="button" size="lg" onClick={openInvitationModal}>
                Send Invitation
              </Button>
            </div>
          </div>
        )}
        <InvitationSection
          assessmentGroups={assessmentGroups?.data}
          isLoading={assessmentGroupsState.isLoading}
          emails={emails}
        />
      </div>

      <div className="flex-1 rounded-sm gap-2 flex flex-col p-2 bg-dark-lighter/5">
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
