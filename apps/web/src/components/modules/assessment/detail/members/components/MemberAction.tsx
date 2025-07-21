"use client";
import React, { useRef, useState } from "react";
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
  MemberUpdateRole,
} from "~/libs/models/assessment-member.model";
import { useParams } from "next/navigation";
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { z } from "zod";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
export const ASSESSMENT_GROUP_LIST_KEY = "assessments-groups";

type OptionType = "team-leader" | "primary" | "member" | "Move to" | "Remove";
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
  optionsList = ["team-leader", "primary", "member", "Remove", "Move to"],
}: Props) {
  const toaster = useToast();
  const params = useParams();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const assessmentId = params.id as string | undefined;
  const openMemberActionRef = useRef<ModalRef>(null);

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
  const openMemberActionModalHandler = () =>
    openMemberActionRef.current?.openModal();
  const onCancelMemberActionHandler = () =>
    openMemberActionRef.current?.closeModal();

  const allOptions: Record<
    OptionType,
    {
      value: OptionType;
      label: string;
      onClick: () => void;
      destructive?: boolean;
    }
  > = {
    "team-leader": {
      value: "team-leader",
      label: "Team leader",
      onClick: () => handleMemberAction(id, "team-leader"),
    },
    member: {
      value: "member",
      label: "Member",
      onClick: () => handleMemberAction(id, "member"),
    },
    primary: {
      value: "primary",
      label: "Make Primary",
      onClick: () => handleMemberAction(id, "primary"),
    },
    Remove: {
      value: "Remove",
      label: "Remove",
      destructive: true,
      onClick: () => handleMemberAction(id, "Remove"),
    },
    "Move to": {
      value: "Move to",
      label: "Move to",
      onClick: openMemberActionModalHandler,
    },
  };

  const { data: assessmentGroups, ...assessmentGroupsState } =
    useFindAll<AssessmentGroup>({
      path: assessmentId ? `/assessments/${assessmentId}/groups` : "",
      tqOptions: {
        queryKey: [ASSESSMENT_GROUP_LIST_KEY, assessmentId],
        enabled: !!assessmentId,
      },
    });
  const { mutate: memberMoveto, ...memberMovetoState } =
    useAddMutation<MemberMoveTo>(`assessments/${assessmentId}/members/move`);

  const { mutate: updateRole } = usePutMutation<MemberUpdateRole>(
    selectedUserId
      ? `assessments/${assessmentId}/members/${selectedUserId}`
      : ""
  );

  const handleMemberAction = (
    userId: string | undefined,
    action: OptionType
  ) => {
    if (!userId) return;

    if (action === "Remove") {
      refetch?.(userId);
      return;
    }

    if (action === "Move to") {
      openMemberActionRef.current?.openModal();
      return;
    }

    setSelectedUserId(userId);
    updateRole(
      {
        data: {
          promoteUserId: action,
          userId: selectedUserId,
        },
        isProtected: true,
      },
      {
        onSuccess: () => {
          toaster.toast({
            title: "Success",
            message: `Member set as ${action}`,
            variant: "success",
          });
          queryClient.invalidateQueries({
            queryKey: [ASSESSMENT_GROUP_LIST_KEY],
          });
        },
        onError: (error) => {
          toaster.toast({
            title: "Error",
            message: error?.message || "Failed to update role.",
            variant: "destructive",
          });
        },
      }
    );
  };

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
        onError: (error) => {
          toaster.toast({
            title: "Error",
            message: error?.message || "Failed to move member.",
            variant: "destructive",
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
        options={(optionsList ?? [])
          .filter((key): key is keyof typeof allOptions => key in allOptions)
          .map((key) => allOptions[key])}
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
              disabled={memberMovetoState.isPending || !!errors.group}
            >
              Move
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
