"use client";

import React from "react";
import { GroupedAssessment } from "./components/GroupedAssessment";
import AssessmentFillHeader from "../components/AssessmentFillHeader";

export interface Domain {
  id: string;
  name: string;
  componentsCount: number;
  subComponentsCount: number;
  progress: number;
}

const dummyGroups = [
  {
    title: "Primary",
    subtitle: "Group leader assessment",
    groupId: "1",
    domains: [
      {
        id: "1",
        name: "Domain 1",
        componentsCount: 10,
        subComponentsCount: 20,
        progress: 50,
      },
      {
        id: "2",
        name: "Domain 2",
        componentsCount: 15,
        subComponentsCount: 25,
        progress: 75,
      },
      {
        id: "3",
        name: "Domain 3",
        componentsCount: 20,
        subComponentsCount: 30,
        progress: 90,
      },
    ],
  },
  {
    title: "Team one",
    subtitle: "Team leader assessment",
    id: "2",
    domains: [
      {
        id: "1",
        name: "Domain A",
        componentsCount: 12,
        subComponentsCount: 18,
        progress: 60,
      },
      {
        id: "2",
        name: "Domain B",
        componentsCount: 17,
        subComponentsCount: 27,
        progress: 80,
      },
      {
        id: "3",
        name: "Domain C",
        componentsCount: 22,
        subComponentsCount: 33,
        progress: 95,
      },
    ],
  },
];

export function CurrentAssessment() {
  return (
    <div className="flex flex-col  bg-layout-bg/15 rounded-md">
      <AssessmentFillHeader
        title="All Assessments"
        subTitle="Team and team leader's assessments"
      />
      <div className="flex flex-col w-full  rounded-md gap-3 p-3">
        {dummyGroups.map((group) => (
          <GroupedAssessment
            key={group.title}
            groupId={group.id || ""}
            title={group.title}
            subtitle={group.subtitle}
            domains={group.domains}
          />
        ))}
      </div>
    </div>
  );
}
