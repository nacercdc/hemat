import React from "react";
import GroupMemberCard from "./GroupMemberCard";
import { Member } from "~/libs/models/assessment-member.model";

interface Props {
  groupName: string;
  members: Member[];
}

export default function GroupCard({ groupName, members = [] }: Props) {
  return (
    <div className="p-2 bg-white rounded-sm flex flex-col gap-3">
      <h1 className="text-sm font-bold">{groupName}</h1>
      <div className="w-full flex flex-col gap-4">
        {members.map((member, index) => (
          <GroupMemberCard
            key={index}
            email={member.user?.email}
            name={member.user?.name}
            role={member.role}

            // isLeader={member.isLeader}
            // avatarUrl={member.avatarUrl}
          />
        ))}
      </div>
    </div>
  );
}
