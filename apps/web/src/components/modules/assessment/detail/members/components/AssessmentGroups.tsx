"use client";

import React, { useEffect, useRef, useState } from "react";
import MemberRoleCard from "../../components/MemberRoleCard";
import MemberInfo from "./MemberInfo";
import MemberAction from "./MemberAction";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type {
  AssessmentGroupIncludeAble,
  AssessmentGroup as IAssessmentGroup,
} from "~/libs/models/assessment-member.model";
import { useParams } from "next/navigation";
import { Button } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import AssessmentGroupsSkeleton from "./form/AssessmentGroupsSkeleton";
export const ASSESSMENT_GROUPS_KEY = "assessments-groups-list";

export default function AssessmentGroups() {
  const params = useParams();
  const assessmentId = params.id as string | undefined;
  const [groups, setGroups] = useState<IAssessmentGroup[]>([]);
  const removeMember = (email: string) => {
    const updatedGroups = groups.map((group) => ({
      ...group,
      members: Array.isArray(group.members)
        ? group.members.filter((member) => member.user?.email !== email)
        : [],
    }));
    setGroups(updatedGroups);
  };

  const { data: assessmentGroup, ...assessmentGroupsState } = useFindAll<
    IAssessmentGroup,
    AssessmentGroupIncludeAble
  >({
    path: `/assessments/${assessmentId}/groups`,
    queries: {
      include: ["members", "members.user", "invitations"],
    },
    tqOptions: {
      queryKey: [ASSESSMENT_GROUPS_KEY],
    },
  });

  useEffect(() => {
    if (assessmentGroup?.data && Array.isArray(assessmentGroup.data)) {
      setGroups(assessmentGroup.data);
    }
  }, [assessmentGroup?.data]);

  if (assessmentGroupsState.isLoading) {
    return <AssessmentGroupsSkeleton />;
  }
  return (
    <div className="flex items-start flex-wrap justify-between gap-4">
      <div className="lg:w-3/5 w-full flex flex-col p-2 bg-dark-lighter/5 rounded-sm">
        <div className="bg-white w-full flex flex-col gap-4 p-2 rounded-sm">
          <div className="flex justify-between p-2">
            <span className="font-semibold text-sm">Team & Members</span>
          </div>

          {Array.isArray(groups) &&
            groups.map((group) => (
              <div
                className="relative border-2 rounded-lg px-4 pt-10 pb-4 bg-primary-50/20 border-primary-50"
                key={group.name}
              >
                <div className="absolute -top-3 left-4 bg-white py-2 px-4 text-sm font-bold border-2 border-primary-50 rounded">
                  <div className="flex gap-6 items-center">
                    {group.name}
                    <Button
                      size="sm"
                      color="primaryLight"
                      variant="outline"
                      leftNode={
                        <Icon
                          icon={"material-symbols-light:domain-rounded"}
                          className="!w-5 !h-5"
                        />
                      }
                    >
                      Edit Domain
                    </Button>
                  </div>
                </div>

                {Array.isArray(group.members) &&
                  group.members.map((member, index) => (
                    <div className="flex flex-col m-4" key={index}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <MemberInfo
                            name={member.user?.name}
                            email={member.user?.email}
                            userId={member.userId}
                            isLeader={member.isLeader}
                            role={member.role}
                          />
                        </div>

                        <MemberAction
                          id={member?.userId}
                          refetch={() =>
                            member.user?.email &&
                            removeMember(member.user.email)
                          }
                          optionsList={[
                            "member",
                            "team-leader",
                            "primary",
                            "Move to",
                            "Remove",
                          ]}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ))}
        </div>
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
    </div>
  );
}
