import React, { useRef } from "react";
import { Icon } from "@iconify/react";
import {
  Button,
  DropdownMenu,
  Modal,
  ModalRef,
  SelectRHF,
  useToast,
} from "@etm/web-ui-components";
import {
  AssessmentGroup,
  MemberMoveTo,
} from "~/libs/models/assessment-member.model";
import { useParams } from "next/navigation";
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";
import { ASSESSMENT_GROUP_LIST_KEY } from "./AssessmentGroups";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { z } from "zod";

type OptionType = "Team leader" | "Make Primary" | "Remove" | "Move to";
interface Props {
  id: string;
  refetch?: (email?: string) => void;
  optionsList?: OptionType[];
}

const memberMoveToSchema = z.object({
  code: z
    .string()
    .min(2, { message: "Language name is too short" })
    .max(50, { message: "Language name is too long" }),
});
export type memberMoveToFormData = z.infer<typeof memberMoveToSchema>;

export default function MemberAction({
  id,
  refetch,
  optionsList = ["Team leader", "Make Primary", "Remove", "Move to"],
}: Props) {
  const toaster = useToast();
  const params = useParams();
  const assessmentId = params.id;
  const openMemberActionRef = useRef<ModalRef>(null);

  const openMemberActionModal = () => openMemberActionRef.current?.openModal();
  const onCancelMemberActionHandler = () =>
    openMemberActionRef.current?.closeModal();

  // const { data: assessmentGroup, ...assessmentGroupsState } =
  //   useFindAll<AssessmentGroup>({
  //     path: `/assessments/${assessmentId}/groups`,

  //     tqOptions: {
  //       queryKey: [ASSESSMENT_GROUP_LIST_KEY],
  //     },
  //   });

  const { mutate: memberMoveto, ...memberMovetoState } = useAddMutation<
    AssessmentGroup,
    MemberMoveTo
  >(`assessments/${assessmentId}/members/move`);

  const onGotoRemoveMemberHandler = () => {
    if (refetch) {
      refetch(id);
    }
  };

  const onGotoPrimaryLeaderHandler = () => {
    //TODO: this a function make the user a Time leader
    console.log(`Make ${id} a Primary`);
  };

  const onGotoTeamLeaderHandler = () => {
    //TODO: this a function make the user a Time leader
    console.log(`Make ${id} a Team Leader`);
  };

  const onMoveToHandler = () => {
    memberMoveto(
      {
        data: {
          userId: id,
          toGroupId: "b9f93891-6f30-48a1-b987-6c38196241bb",
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
          queryClient.invalidateQueries({
            queryKey: [ASSESSMENT_GROUP_LIST_KEY],
          });
        },
      }
    );
  };
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
        options={optionsList.map((key) => allOptions[key])}
      />
      <Modal ref={openMemberActionRef} title="Select The Group ">
        ddddddddddd
        {/* <SelectRHF<AssessmentGroup, memberMoveToFormData>
          control={control}
          name="code"
          labelKey="name"
          valueKey="members"
          displayLabel="Country"
          labelVariant="bold"
          size="xl"
          onOpenChange={() => assessmentGroupsState.refetch()}
          options={
            (assessmentGroup?.data as unknown as AssessmentGroup[]) ?? []
          }
        /> */}
        <div className="flex justify-between items-center w-full bg-layout-bg p-4 rounded-b-lg px-8 mt-auto">
          <Button
            variant="outline"
            type="button"
            color="card"
            onClick={onCancelMemberActionHandler}
          >
            Cancel
          </Button>
          <Button size="lg" type="submit">
            Move
          </Button>
        </div>
      </Modal>
    </div>
  );
}
