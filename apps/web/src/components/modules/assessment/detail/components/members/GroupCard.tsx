import React from "react";
import GroupMemberCard from "./GroupMemberCard";

interface GroupMember {
  name: string;
  email: string;
  isLeader?: boolean;
  avatarUrl?: string;
}

interface Props {
  groupName: string;
  members: GroupMember[];
}

export default function GroupCard({ groupName, members }: Props) {
  return (
    <div className="p-2 bg-white rounded-sm flex flex-col gap-3">
      <h1 className="text-sm font-bold">{groupName}</h1>
      <div className="w-full flex flex-col gap-4">
        {members.map((member, index) => (
          <GroupMemberCard
            key={index}
            name={member.name}
            email={member.email}
            isLeader={member.isLeader}
            avatarUrl={member.avatarUrl}
          />
        ))}
      </div>
    </div>
  );
}
