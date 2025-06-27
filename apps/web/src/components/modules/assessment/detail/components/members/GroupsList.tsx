import React from "react";
import GroupCard from "./GroupCard";

interface GroupMember {
  name: string;
  email: string;
  isLeader?: boolean;
  avatarUrl?: string;
}

interface Group {
  groupName: string;
  members: GroupMember[];
}
interface Props {
  groups?: Group[];
}

export default function GroupsList({ groups = [] }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {groups.map((group, index) => (
        <GroupCard
          key={group.groupName}
          groupName={group.groupName}
          members={group.members}
        />
      ))}
    </div>
  );
}
