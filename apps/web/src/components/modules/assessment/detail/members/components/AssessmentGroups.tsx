import React from "react";
import MemberRoleCard from "../../components/MemberRoleCard";
import MemberInfo from "./MemberInfo";
import MemberAction from "./MemberAction";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { AssessmentGroup as IAssessmentGroup } from "~/libs/models/assessment-member.model";
import { useParams } from "next/navigation";

const assessmentGroups: IAssessmentGroup[] = [
  {
    name: "Health Surveillance Team",
    members: [
      {
        name: "Dr. Amina Yusuf",
        email: "amina.yusuf@cdc.africa",
        isLeader: true,
        role: "Team Lead - Epidemiologist",
      },
      {
        name: "James Moyo",
        email: "j.moyo@cdc.africa",
        role: "Data Analyst",
      },
      {
        name: "Linda Okeke",
        email: "linda.okeke@cdc.africa",
        role: "Field Officer",
      },
    ],
  },
  {
    name: "Outbreak Response Unit",
    members: [
      {
        name: "Samuel Tadesse",
        email: "samuel.tadesse@cdc.africa",
        isLeader: true,
        role: "Unit Head - Emergency Response",
      },
      {
        name: "Grace Wambui",
        email: "grace.wambui@cdc.africa",
        role: "Public Health Nurse",
      },
    ],
  },
  {
    name: "Data Integration Taskforce",
    members: [
      {
        name: "Kevin Mulenga",
        email: "kevin.mulenga@cdc.africa",
        role: "ETL Developer",
      },
      {
        name: "Sophia Zulu",
        email: "sophia.zulu@cdc.africa",
        isLeader: true,
        role: "Lead Data Engineer",
      },
    ],
  },
];

export default function AssessmentGroups() {
  const params = useParams();
  const assessmentId = params.id;
  const { data: assessmentGroup, ...assessmentGroupsState } =
    useFindAll<IAssessmentGroup>({
      path: `/assessments/${assessmentId}/groups`,
      tqOptions: {
        queryKey: ["assessments-groups"],
      },
    });

  return (
    <div className="flex items-start flex-wrap justify-between gap-4 bg-dark-lighter/5  ">
      <div className="lg:w-3/5 w-full flex flex-col gap-10 p-5 ">
        {assessmentGroup?.data.map((groups) => (
          <div className="relative  border-2 rounded-lg p-4  bg-primary-50/20 border-primary-50">
            <div className="absolute -top-3 left-4 bg-white px-4 text-sm font-bold  border-2 border-primary-50 rounded">
              {groups.name}
            </div>
            <div className="">
              {groups.members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2"
                >
                  <div className="flex items-center gap-3">
                    <MemberInfo name={member.name} email={member.email} />
                  </div>
                  {member.isLeader ? (
                    <div className="text-xs text-gray-500">Team Leader</div>
                  ) : (
                    <MemberAction id={member.email} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
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
    </div>
  );
}
