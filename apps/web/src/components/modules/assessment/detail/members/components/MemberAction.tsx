"use client";
import React, { useRef } from "react";
import { Icon } from "@iconify/react";
import type { ModalRef } from "@etm/web-ui-components";
import {
  Button,
  DropdownMenu,
  Modal,
  SelectRHF,
  useToast,
} from "@etm/web-ui-components";
import type {
  AssessmentGroup,
  MemberMoveTo,
} from "~/libs/models/assessment-member.model";
import { useParams } from "next/navigation";
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { z } from "zod";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
export const ASSESSMENT_GROUP_LIST_KEY = "assessments-groups";

type OptionType = "Team leader" | "Make Primary" | "Remove" | "Move to";
interface Props {
  id: string | undefined;
  refetch?: (email?: string) => void;
  optionsList?: OptionType[];
}

export const groupSchema = z.object({
  id: z
    .string()
    .min(1, { message: "Select the group that you want move" })
    .max(50, { message: "Group name is too long" }),
});
export const memberMoveToSchema = z.object({
  group: z.object({
    id: z.string().min(1, { message: "Select the group that you want move" }),
  }),
});

export type MemberMoveToFormData = z.infer<typeof memberMoveToSchema>;

export default function MemberAction({
  id,
  refetch,
  optionsList = ["Team leader", "Make Primary", "Remove", "Move to"],
}: Props) {
  const toaster = useToast();
  const params = useParams();
  const assessmentId = params.id as string | undefined;
  const openMemberActionRef = useRef<ModalRef>(null);
  const onGotoRemoveMemberHandler = () => {
    if (refetch) {
      refetch(id);
    }
  };

  const onGotoPrimaryLeaderHandler = () => {
    //TODO: this a function make the user a Time leader
  };

  const onGotoTeamLeaderHandler = () => {
    //TODO: this a function make the user a Time leader
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberMoveToFormData>({
    defaultValues: {
      group: {
        id: "",
      },
    },
    resolver: zodResolver(memberMoveToSchema),
    mode: "all",
  });
  const openMemberActionModal = () => openMemberActionRef.current?.openModal();
  const onCancelMemberActionHandler = () =>
    openMemberActionRef.current?.closeModal();
  const allOptions = {
    "Team leader": {
      value: "Team leader",
      label: "Team leader",
      onClick: onGotoTeamLeaderHandler,
    },
    "Make Primary": {
      value: "Make Primary",
      label: "Make Primary",
      onClick: onGotoPrimaryLeaderHandler,
    },
    Remove: {
      value: "Remove",
      label: "Remove",
      destructive: true,
      onClick: onGotoRemoveMemberHandler,
    },

    "Move to": {
      value: "Move to",
      label: "Move to",
      onClick: openMemberActionModal,
    },
  };

  const { data: assessmentGroups, ...assessmentGroupsState } =
    useFindAll<AssessmentGroup>({
      path: `/assessments/${assessmentId}/groups`,
      tqOptions: {
        queryKey: [ASSESSMENT_GROUP_LIST_KEY],
      },
    });

  console.log(assessmentGroups, "Groups");

  const { mutate: memberMoveto, ...memberMovetoState } =
    useAddMutation<MemberMoveTo>(`assessments/${assessmentId}/members/move`);

  const onMoveToHandler = (data: MemberMoveToFormData) => {
    memberMoveto(
      {
        data: {
          userId: id,
          toGroupId: data.group.id,
        },
        isProtected: true,
      },
      {
        onSuccess: () => {
          toaster.toast({
            title: "Success",
            message: "Member has been moved successfully",
            variant: "success",
          });
          onCancelMemberActionHandler();
          queryClient.invalidateQueries({
            queryKey: [ASSESSMENT_GROUP_LIST_KEY],
          });
        },
      }
    );
  };

  return (
    <div>
      <DropdownMenu
        triggerTextAlign="end"
        align="end"
        trigger={
          <Icon
            icon="mi:options-horizontal"
            className="text-xl text-right text-dark"
          />
        }
        options={optionsList
          .map((key) => allOptions[key])
          .filter((option) => option !== undefined)}
      />

      <Modal ref={openMemberActionRef} title="Select The Group">
        <form onSubmit={handleSubmit(onMoveToHandler)} className="space-y-4">
          <div className="flex flex-col px-8">
            <SelectRHF<AssessmentGroup, MemberMoveToFormData>
              control={control}
              displayLabel="Name"
              name="group"
              labelKey="name"
              valueKey="id"
              labelVariant="bold"
              size="lg"
              onOpenChange={() => assessmentGroupsState.refetch()}
              options={assessmentGroups?.data ?? []}
              error={errors.group?.message}
            />
          </div>

          <div className="flex justify-between items-center w-full bg-layout-bg p-4 rounded-b-lg px-8 mt-auto">
            <Button
              variant="outline"
              type="button"
              color="card"
              onClick={onCancelMemberActionHandler}
            >
              Cancel
            </Button>
            <Button
              size="lg"
              type="submit"
              loading={memberMovetoState.isPending}
            >
              Move
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
