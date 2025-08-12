import React from "react";
import GroupMemberCard from "./GroupMemberCard";
import type { Member } from "~/libs/models/assessment-member.model";
import MemberRoleCard from "../../components/MemberRoleCard";

interface Props {
  groupName: string;
  members: Member[];
}

export default function GroupCard({ groupName, members = [] }: Props) {
  return (
    <div className="p-2 bg-white rounded-sm flex flex-col gap-3">
      <h1 className="text-sm font-bold">{groupName}</h1>
      <div className="w-full flex flex-col gap-4">
        {members.length !== 0 ? (
          members.map((member, index) => (
            <GroupMemberCard
              key={index}
              email={member.user?.email}
              name={member.user?.name}
              role={member.role}
            />
          ))
        ) : (
          <MemberRoleCard
            icon="meteor-icons:user"
            placeholderText="There are no members to show."
          />
        )}
      </div>
    </div>
  );
}
