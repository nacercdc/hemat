import { Progress } from "@etm/web-ui-components";
import React from "react";

interface Domain {
  name: string;
  componentsCount: number;
  subComponentsCount: number;
  progress: number;
}

const dummyDomains: Domain[] = [
  {
    name: "Domain 1",
    componentsCount: 10,
    subComponentsCount: 20,
    progress: 50,
  },
  {
    name: "Domain 2",
    componentsCount: 15,
    subComponentsCount: 25,
    progress: 75,
  },
  {
    name: "Domain 3",
    componentsCount: 20,
    subComponentsCount: 30,
    progress: 90,
  },
];
export function CurrentAssessment() {
  return (
    <div className="flex flex-col w-full bg-layout-bg/15 rounded-md gap-4 p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {dummyDomains.map((domain) => (
          <div
            key={domain.name}
            className="flex flex-col w-60 h-56 border border-dark-light sm:w-1/3 bg-card rounded-xl p-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">{domain.name}</h3>
              <div className="flex items-center">
                <span className="text-sm font-bold">
                  {domain.componentsCount}
                </span>
                <span className="text-sm font-bold">
                  {domain.subComponentsCount}
                </span>
              </div>
            </div>
            <Progress
              value={domain.progress}
              color="#00FF0080"
              size="md"
              shape="circular"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
