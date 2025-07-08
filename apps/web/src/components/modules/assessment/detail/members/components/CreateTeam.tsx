"use client";
import React, { useState } from "react";

type Member = {
  email: string;
  name: string;
};

interface SelectedMember extends Member {
  isLeader?: boolean;
}

const allMembers: Member[] = [
  { name: "NT", email: "mnhsdddih@gmail.com" },
  { name: "EH", email: "elsanahom62@gmail.com" },
  { name: "AD", email: "alexgda643@gmail.com" },
];

export default function CreateTeam() {
  const [teamName, setTeamName] = useState("Team A");
  const [selectedMembers, setSelectedMembers] = useState<SelectedMember[]>([]);
  const [availableMembers, setAvailableMembers] =
    useState<Member[]>(allMembers);

  const handleAdd = (member: Member) => {
    setSelectedMembers([...selectedMembers, member]);
    setAvailableMembers(
      availableMembers.filter((m) => m.email !== member.email)
    );
  };

  const handleRemove = (member: Member) => {
    setAvailableMembers([...availableMembers, member]);
    setSelectedMembers(selectedMembers.filter((m) => m.email !== member.email));
  };

  const setLeader = (email: string) => {
    setSelectedMembers(
      selectedMembers.map((member) => ({
        ...member,
        isLeader: member.email === email,
      }))
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Team</h2>

      <input
        className="w-full mb-4 border p-2 rounded"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Team Name"
      />

      <div className="mb-4">
        {selectedMembers.map((member) => (
          <div
            key={member.email}
            className="flex justify-between items-center border p-2 rounded mb-2"
          >
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                {member.name}
              </div>
              <div>{member.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={member.isLeader ? "Team Leader" : ""}
                onChange={() => setLeader(member.email)}
                className="border px-2 py-1 rounded"
              >
                <option value="">Select</option>
                <option value="Team Leader">Team Leader</option>
              </select>
              <button
                onClick={() => handleRemove(member)}
                className="text-red-500 font-bold text-xl"
              >
                −
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        {availableMembers.map((member) => (
          <div
            key={member.email + Math.random()}
            className="flex justify-between items-center border p-2 rounded mb-2"
          >
            <div className="flex items-center gap-2">
              <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                {member.name}
              </div>
              <div>{member.email}</div>
            </div>
            <button
              onClick={() => handleAdd(member)}
              className="text-green-500 font-bold text-xl"
            >
              +
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button className="border px-4 py-2 rounded text-gray-600">
          Reset
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Create Team
        </button>
      </div>
    </div>
  );
}
