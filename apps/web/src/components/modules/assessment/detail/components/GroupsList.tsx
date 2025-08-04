import React from "react";
import GroupCard from "../members/components/GroupCard";
import type { AssessmentGroup } from "~/libs/models/assessment-member.model";

interface Props {
  groups?: AssessmentGroup[];
}

export default function GroupsList({ groups = [] }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {groups.map((group, index) => (
        <GroupCard
          key={index}
          groupName={group?.name}
          members={group.members}
        />
      ))}
    </div>
  );
}
