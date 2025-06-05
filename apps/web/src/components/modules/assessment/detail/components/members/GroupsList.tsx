import React from "react";
import GroupCard from "./GroupCard";

export default function GroupsList() {
  //TODO this is dummy data
  const groups = [
    {
      groupName: "Group A",
      members: [
        {
          name: "Dr.Kebede Alemu",
          email: "kebede@gmail.com",
          isLeader: true,
          avatarUrl: "http://path-that-goes-no-where.com",
        },
        {
          name: "Sara Mengistu",
          email: "sara@gmail.com",
          isLeader: false,
          avatarUrl: "http://path-that-goes-no-where.com",
        },
      ],
    },
    {
      groupName: "Group B",
      members: [
        {
          name: "Tadesse Worku",
          email: "tadesse@gmail.com",
          isLeader: true,
          avatarUrl: "http://path-that-goes-no-where.com",
        },
        {
          name: "Hanna Bekele",
          email: "hanna@gmail.com",
          isLeader: false,
          avatarUrl: "http://path-that-goes-no-where.com",
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {groups.map((group, index) => (
        <GroupCard
          key={index}
          groupName={group.groupName}
          members={group.members}
        />
      ))}
    </div>
  );
}
