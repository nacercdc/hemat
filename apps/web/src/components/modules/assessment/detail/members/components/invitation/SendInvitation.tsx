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
import MemberAction from "../MemberAction";
import MemberInfo from "../MemberInfo";
import InvitationSection from "./InvitationSection";
import InvitationListSkeleton from "./InvitationListSkeleton";

const addAssessmentInvitationSchema = z
  .object({
    newGroup: z.string().optional(),
    email: z.string().email({ message: "Enter a valid email" }).optional(),
    group: z.object({
      id: z.string().optional(),
    }),
  })
  .superRefine((data, ctx) => {
    if (!data.group?.id && !data.newGroup?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select an existing team or create a new one",
        path: ["group"],
      });
    }

    if (!data.group?.id && !data.newGroup?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select an existing team or create a new one",
        path: ["newGroup"],
      });
    }
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

  const {
    control,
    setError,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<AddAssessmentInvitationFormData>({
    defaultValues: {
      email: "",
      newGroup: "",
      group: {
        id: "",
      },
    },
    resolver: zodResolver(addAssessmentInvitationSchema),
    mode: "all",
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
  const openTextFiledHandler = () => {
    setAddNewGroupName((prev) => !prev);
    if (addNewGroupName) {
      setValue("newGroup", "");
    } else {
      setValue("group.id", "");
    }
  };

  const addEmailHandler = async (): Promise<void> => {
    const emailValue = control._formValues.email;
    if (!emailValue?.trim()) return;

    const isValid = await trigger("email");
    if (!isValid) return;

    const newEmail = emailValue.trim().toLowerCase();
    if (emails.includes(newEmail)) {
      setError("email", { type: "manual", message: "Duplicated email." });
      return;
    }
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setValue("email", "");
    }
  };

  const removeEmailHandler = (email: string) => {
    setEmails((prev = []) => prev.filter((e) => e !== email));
  };

  const onInvitationSubmitHandler = async () => {
    if (emails.length === 0) return;

    const isValidGroup = await trigger("group");
    const isValidNewGroup = await trigger("newGroup");
    if (!isValidGroup && !isValidNewGroup) return;

    const values = control._formValues;
    const groupId = values.group?.id?.trim();
    const newGroupName = values.newGroup?.trim();

    const formatted: MemberInvitationGroup[] = [
      {
        group: groupId || newGroupName,
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
          setValue("newGroup", "");
          setValue("group.id", "");
          setAddNewGroupName(false);
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
      <div className="w-full flex flex-col p-3 bg-dark-lighter/5 rounded-sm">
        <div className="flex flex-col justify-between mt-2">
          <div className="flex flex-col gap-4 bg-card rounded-t-md p-3 border border-secondary-100/80">
            <div className="flex gap-3 ">
              <div className="flex-1">
                <InputRHF
                  name="email"
                  control={control}
                  placeholder="Enter the email addresses of the participants you want to invite "
                  error={errors.email?.message}
                />
              </div>
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
            {emails.length !== 0 && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="lg"
                  color="primaryLight"
                  variant="outline"
                  onClick={openInvitationModal}
                >
                  Send Invitation
                </Button>
              </div>
            )}
          </div>
        </div>
        <InvitationSection
          assessmentGroups={assessmentGroups?.data}
          isLoading={assessmentGroupsState.isLoading}
        />
      </div>
      <Modal ref={sendInvitationModalRef} title="Create Team">
        <div className="flex flex-col py-3 px-8">
          <div className="flex gap-3 items-end mb-4">
            {assessmentGroups?.data?.length != 0 && !addNewGroupName && (
              <SelectRHF<AssessmentGroup, AddAssessmentInvitationFormData>
                control={control}
                displayLabel="Team name"
                name="group"
                labelKey="name"
                placeholder="Select team"
                valueKey="id"
                inModal={true}
                options={assessmentGroups?.data ?? []}
                error={errors.group?.message}
              />
            )}
            {addNewGroupName && (
              <InputRHF
                label="Team name"
                name="newGroup"
                control={control}
                placeholder="Write name of the team"
                error={errors.newGroup?.message}
              />
            )}
            <div className="mb-2">
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
                {addNewGroupName ? "Existing team" : "Create new"}
              </Button>
            </div>
          </div>

          <div className="flex flex-col bg-card rounded-sm ">
            {emails.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No emails added yet.
              </p>
            ) : (
              emails.map((email) => (
                <div key={email} className="flex justify-between">
                  <MemberInfo email={email} />
                  <MemberAction
                    userId={email}
                    refetch={() => removeEmailHandler(email)}
                    optionsList={["Cancel Invitation"]}
                  />
                </div>
              ))
            )}

            <div className="flex justify-end mt-2">
              <Button
                type="button"
                size="lg"
                onClick={onInvitationSubmitHandler}
                disabled={emails.length === 0 || sendInvitationState.isPending}
              >
                Send Invitation
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
