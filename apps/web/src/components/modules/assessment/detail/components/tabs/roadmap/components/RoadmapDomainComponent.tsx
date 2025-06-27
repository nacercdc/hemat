import React from "react";
import SubComponentRoadmapList, { SubComponent } from "./SubComponentRoadmap";
import { Badge } from "@etm/web-ui-components";

interface ComponentProps {
  component: {
    component_name: string;
    component_code: string;
    current_state: number;
    target_state: number;
    sub_component: SubComponent[];
  };
}

export default function RoadmapDomainComponent({ component }: ComponentProps) {
  return (
    <div
      className="flex flex-col gap-4 bg-basic-300/10 rounded-sm p-4"
      key={component.component_code}
    >
      <div className="flex gap-2 items-center  ">
        <h1 className="font-bold text-sm">
          {component.component_code} {component.component_name}
        </h1>
      </div>
      <span className=" py-1    font-normal text-xs rounded-sm">
        <div className="flex gap-6">
          <div className="flex flex-col gap-2">
            <span>Current State</span>
            <Badge text={`${component.current_state}`} variant={"info"} />
          </div>
          <div className="flex flex-col gap-2">
            <span>Target</span>
            <Badge text={`${component.target_state}`} variant={"warning"} />
          </div>
        </div>
      </span>
      <div className="flex flex-col gap-4 ">
        {component.sub_component?.map((sub_comp) => (
          <SubComponentRoadmapList sub_comp={sub_comp} key={sub_comp.code} />
        ))}
      </div>
    </div>
  );
}
