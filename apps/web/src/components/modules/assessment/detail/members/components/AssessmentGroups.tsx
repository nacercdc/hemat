"use client";
import React, { useRef, useState } from "react";
import MemberRoleCard from "../../components/MemberRoleCard";
import MemberInfo from "./MemberInfo";
import MemberAction from "./MemberAction";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import {
  AssessmentGroupIncludeAble,
  AssessmentGroup as IAssessmentGroup,
} from "~/libs/models/assessment-member.model";
import { useParams } from "next/navigation";
import { Button, Modal, ModalRef } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CreateGroupForm } from "./form/CreateGroupForm";
export const ASSESSMENT_GROUPS_KEY = "assessments-groups-list";

export default function AssessmentGroups() {
  const params = useParams();
  const assessmentId = params.id;
  const [groups, setGroups] = useState<IAssessmentGroup[]>([]);
  const addTeamGroupModalRef = useRef<ModalRef>(null);

  const openCreateTeamsModal = () => addTeamGroupModalRef.current?.openModal();
  const onCancelTeamsCreateFormHandler = () =>
    addTeamGroupModalRef.current?.closeModal();

  const onSubmitTeamGroupFormHandler = () => {
    //TODO: Add submit logic here
  };
  const removeMember = (email: string) => {
    //TODO:
    const updatedGroups = groups.map((group) => ({
      ...group,
      members: group.members.filter((member) => member.email !== email),
    }));
    setGroups(updatedGroups);
  };

  const { data: assessmentGroup, ...assessmentGroupsState } = useFindAll<
    IAssessmentGroup,
    AssessmentGroupIncludeAble
  >({
    path: `/assessments/${assessmentId}/groups`,
    queries: {
      include: ["members", "members.user"],
    },
    tqOptions: {
      queryKey: [ASSESSMENT_GROUPS_KEY],
    },
  });

  return (
    <div className="flex items-start flex-wrap justify-between gap-4  ">
      <div className="lg:w-3/5 w-full flex flex-col  p-2 bg-dark-lighter/5 rounded-sm">
        <div className="bg-white w-full flex flex-col gap-4 p-2 rounded-sm">
          <div className="flex justify-between p-2">
            <span className="font-semibold text-sm"> Team & Members</span>
            <Button
              leftNode={<Icon icon={"mdi:users-add"} className="!w-5 !h-5" />}
              size="lg"
              color="primaryLight"
              variant="outline"
              onClick={openCreateTeamsModal}
            >
              Create Team
            </Button>
          </div>
          {assessmentGroup?.data.map((group) => (
            <div
              className="relative  border-2 rounded-lg p-4  bg-primary-50/20 border-primary-50"
              key={group.name}
            >
              <div className="absolute -top-3 left-4 bg-white px-4 text-sm font-bold  border-2 border-primary-50 rounded">
                {group.name}
              </div>

              {group?.members &&
                group?.members.map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between "
                  >
                    <div className="flex items-center gap-3">
                      <MemberInfo
                        name={member.user?.name}
                        email={member.user?.email}
                        userId={member.userId}
                        isLeader={member.isLeader}
                      />
                    </div>

                    <MemberAction
                      id={member.userId as string}
                      refetch={() => removeMember(member.email)}
                      optionsList={[
                        "Remove",
                        "Make Primary",
                        "Team leader",
                        "Move to",
                      ]}
                    />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 rounded-sm gap-2 flex flex-col p-2  bg-dark-lighter/5 ">
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

      <Modal ref={addTeamGroupModalRef}>
        <div className="flex flex-col gap-4">
          <CreateGroupForm
            onCancelTeamGroupForm={onCancelTeamsCreateFormHandler}
            onSubmitTeamGroupForm={onSubmitTeamGroupFormHandler}
          />
        </div>
        {/* {assessmentGroupsState.refetch()} */}
      </Modal>
    </div>
  );
}
