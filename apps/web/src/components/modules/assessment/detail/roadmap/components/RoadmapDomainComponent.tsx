import React from "react";

import SubComponentRoadmapList from "./SubComponentRoadmapList";
import { Badge } from "@etm/web-ui-components";
import type { RoadmapComponent } from "~/libs/models/roadmap.model";
import {
  calculateAverageCurrent,
  calculateAverageTarget,
} from "../utils/averages.utils";

interface Props {
  component: RoadmapComponent;
}

export default function RoadmapDomainComponent({ component }: Props) {
  return (
    <div
      className="flex flex-col gap-4 bg-basic-300/10 rounded-sm p-4"
      key={component.code}
    >
      <div className="flex gap-2 items-center  ">
        <h1 className="font-bold text-sm">
          {component.code} {component.name}
        </h1>
      </div>
      <span className=" py-1    font-normal text-xs rounded-sm">
        <div className="flex gap-6">
          <div className="flex flex-col gap-2">
            <span>Current State</span>
            <Badge
              text={`${
                calculateAverageCurrent(component.subComponents) ?? "-"
              }`}
              variant={"info"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span>Target</span>
            <Badge
              text={`${calculateAverageTarget(component.subComponents)}`}
              variant={"warning"}
            />
          </div>
        </div>
      </span>
      <div className="flex flex-col gap-4 ">
        {component.subComponents?.map((sub_comp) => (
          <SubComponentRoadmapList
            subComponent={sub_comp}
            key={sub_comp.code}
          />
        ))}
      </div>
    </div>
  );
}
