"use client";

import React from "react";
import AssessmentFillHeader from "../components/AssessmentFillHeader";
import { AssessmentRoadmap } from "./components/AssessmentRoadmap";
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
];

export function Roadmap() {
  return (
    <div className="flex flex-col  bg-layout-bg/15 rounded-md">
      <AssessmentFillHeader
        title="Current Roadmap"
        subTitle="This fill by the team leader"
      />
      <div className="flex flex-col w-full  rounded-md gap-3 p-3">
        {dummyGroups.map((group) => (
          <AssessmentRoadmap domains={group.domains} />
        ))}
      </div>
    </div>
  );
}
