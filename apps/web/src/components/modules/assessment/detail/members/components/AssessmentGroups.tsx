"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import MemberRoleCard from "../../components/MemberRoleCard";
import MemberInfo from "./MemberInfo";
import MemberAction from "./MemberAction";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type {
  AssessmentGroupIncludeAble,
  AssessmentGroup as IAssessmentGroup,
} from "~/libs/models/assessment-member.model";
import { useParams } from "next/navigation";
import type { ModalRef } from "@etm/web-ui-components";
import { Button, Modal, useToast } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import AssessmentGroupsSkeleton from "./form/AssessmentGroupsSkeleton";
import type { Domain } from "~/libs/models/domain.model";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import type {
  AssignDomainToAssessmentGroup,
  GroupDomainDelete,
} from "~/libs/models/assessment-group.model";
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";
import GroupsList from "../../components/GroupsList";
import { useDeleteMutation } from "~/libs/tanstack-api-query/hooks/useDeleteMutation";

export const ASSESSMENT_GROUPS_KEY = "assessments-groups-list";

export default function AssessmentGroups() {
  const params = useParams();
  const assessmentId = params.id as string | undefined;
  const [groups, setGroups] = useState<IAssessmentGroup[]>([]);
  const assignDomainModalRef = useRef<ModalRef>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [selectedDomainIds, setSelectedDomainIds] = useState<string[]>([]);
  const domainMap = new Map<string, Domain>();
  const { toast } = useToast();

  const removeMemberHandler = (email: string) => {
    const updatedGroups = groups.map((group) => ({
      ...group,
      members: Array.isArray(group.members)
        ? group.members.filter((member) => member.user?.email !== email)
        : [],
    }));
    setGroups(updatedGroups);
  };

  const closeAssignDomainModalHandler = () =>
    assignDomainModalRef.current?.closeModal();

  const openAssignDomainModalHandler = (groupId: string) => {
    setSelectedGroupId(groupId);
    assignDomainModalRef.current?.openModal();
  };

  const {
    data: assessmentDomainsRes = { data: [] },
    ...assessmentDomainsState
  } = useFindAll<Domain>({
    path: `/assessments/${assessmentId}/domains`,
    tqOptions: {
      queryKey: ["domains"],
    },
  });
  const assessmentDomains: Domain[] = assessmentDomainsRes?.data || [];
  const pathP =
    assessmentId && selectedGroupId
      ? `assessments/${assessmentId}/groups/${selectedGroupId}/domains`
      : "";
  const { data: assessmentGroupDomainsRes, ...assessmentGroupDomainsState } =
    useFindAll<Domain>({
      path: pathP,
    });
  const assessmentGroupDomains = useMemo(() => {
    return assessmentGroupDomainsState.isSuccess &&
      Array.isArray(assessmentGroupDomainsRes)
      ? assessmentGroupDomainsRes
      : [];
  }, [assessmentGroupDomainsState.isSuccess, assessmentGroupDomainsRes]);
  if (
    assessmentGroupDomainsState.isSuccess &&
    Array.isArray(assessmentGroupDomains)
  ) {
    assessmentGroupDomains.forEach((domain) => {
      domainMap.set(domain.id, domain);
    });
  }

  if (assessmentDomainsState.isSuccess && Array.isArray(assessmentDomains)) {
    assessmentDomains.forEach((domain) => {
      domainMap.set(domain.id, domain);
    });
  }

  const mergedDomains: Domain[] = Array.from(domainMap.values());
  useEffect(() => {
    if (
      selectedGroupId &&
      assessmentGroupDomainsState.isSuccess &&
      Array.isArray(assessmentGroupDomains)
    ) {
      const assignedIds = assessmentGroupDomains.map((domain) => domain.id);
      setSelectedDomainIds(assignedIds);
    }
  }, [
    selectedGroupId,
    assessmentGroupDomainsState.isSuccess,
    assessmentGroupDomains,
  ]);

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

  const {
    mutate: assessmentGroupDomainsAssign,
    ...assessmentGroupDomainsAssignState
  } = useAddMutation<AssignDomainToAssessmentGroup>(
    `assessments/${assessmentId}/groups/${selectedGroupId}/domains`
  );

  const {
    mutate: assessmentGroupDomainsDelete,
    ...assessmentGroupDomainsDeleteState
  } = useDeleteMutation<GroupDomainDelete>(
    `assessments/${assessmentId}/groups/${selectedGroupId}/domain`
  );
  const onAssignDomainToGroupDeleteHandler = (id: string) => {
    assessmentGroupDomainsDelete(
      { id },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message:
              "Domains have been detached from the this group successfully.",
            variant: "success",
          });
          setSelectedDomainIds((prev) => prev.filter((d) => d !== id));
          queryClient.invalidateQueries({
            queryKey: ["groupDomains", assessmentId, selectedGroupId],
          });
        },
      }
    );
  };

  useEffect(() => {
    if (assessmentGroup?.data && Array.isArray(assessmentGroup.data)) {
      setGroups(assessmentGroup.data);
    }
  }, [assessmentGroup?.data]);

  const onAssignDomainToGroupSubmitHandler = (id: string) => {
    assessmentGroupDomainsAssign(
      {
        data: {
          domainIds: [id],
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Domains have been assigned successfully.",
            variant: "success",
          });
          setSelectedDomainIds((prev) => [...prev, id]);
          queryClient.invalidateQueries({
            queryKey: ["groupDomains", assessmentId, selectedGroupId],
          });
        },
      }
    );
  };

  if (assessmentGroupsState.isLoading) {
    return <AssessmentGroupsSkeleton />;
  }
  return (
    <div className="flex items-start flex-wrap justify-between gap-4">
      <div className="lg:w-3/5 w-full flex flex-col p-2 bg-dark-lighter/5 rounded-sm">
        <div className="bg-white w-full flex flex-col gap-4 p-2 rounded-sm">
          <div className="flex justify-between p-2">
            <span className="font-semibold text-sm">Team & Participants</span>
          </div>

          {Array.isArray(groups) &&
            groups.map((group) => (
              <div
                className="relative border-2 rounded-lg px-4 pt-10 pb-4 bg-primary-50/20 border-primary-50"
                key={group.id}
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
                      onClick={() => {
                        setSelectedGroupId(group.id);
                        openAssignDomainModalHandler(group.id);
                      }}
                    >
                      Domain
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
                            isLeader={member.isAdmin}
                            role={member.role}
                          />
                        </div>

                        <MemberAction
                          userRole={member?.role}
                          userId={member?.userId}
                          refetch={() =>
                            member.user?.email &&
                            removeMemberHandler(member.user.email)
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

      <div className="flex-1 bg-dark-lighter/5 p-2 rounded-sm gap-2 flex flex-col">
        {assessmentGroup?.data.length != 0 ? (
          <GroupsList groups={assessmentGroup?.data} />
        ) : (
          <div className="flex flex-col gap-2 w-full">
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
        )}
      </div>

      <Modal ref={assignDomainModalRef} title="Modify Group Domains">
        <div className="px-8 py-4">
          {assessmentGroupDomainsState.isSuccess &&
          assessmentDomainsState.isSuccess ? (
            mergedDomains.length != 0 ? (
              <ul className="space-y-2 text-sm">
                {mergedDomains.map((domain) => (
                  <li key={domain.id} className="flex items-center gap-2">
                    <div className="flex items-center justify-between w-full">
                      <span>{domain.name}</span>

                      {selectedDomainIds.includes(domain.id) ? (
                        <Icon
                          icon="material-symbols:close"
                          className="!w-8 !h-8  rounded-full p-1 cursor-pointer text-destructive bg-basic/10"
                          onClick={() =>
                            onAssignDomainToGroupDeleteHandler(domain.id)
                          }
                        />
                      ) : (
                        <Icon
                          icon={"material-symbols:add-2-rounded"}
                          className="!w-8 !h-8 cursor-pointer text-success  bg-basic/10 rounded-full p-1"
                          onClick={() => {
                            onAssignDomainToGroupSubmitHandler(domain?.id);
                          }}
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted text-sm">No domains available.</p>
            )
          ) : (
            <p className="text-muted text-sm">Loading domains...</p>
          )}
        </div>

        <div className="flex justify-between items-center w-full bg-layout-bg p-4 rounded-b-lg  mt-auto">
          <Button
            size="lg"
            type="button"
            variant="outline"
            color="card"
            onClick={closeAssignDomainModalHandler}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
