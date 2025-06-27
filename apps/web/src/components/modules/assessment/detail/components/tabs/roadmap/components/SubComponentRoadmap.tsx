import { Badge } from "@etm/web-ui-components";
import React from "react";
export interface SubComponent {
  code: string;
  name: string;
  current_state: number;
  target: number;
  gap_address: string;
  strategic_invitation: string;
  who_responsible: string;
  resource_used: string;
  upload_document: string;
}

interface Props {
  sub_comp: SubComponent;
}

export default function SubComponentRoadmapList({ sub_comp }: Props) {
  return (
    <div
      className="flex flex-col gap-4 bg-basic-200/20 p-4 rounded-md"
      key={sub_comp.code}
    >
      <div className="flex flex-col gap-2 ">
        <div className="text-xs font-bold">
          {sub_comp.code} {sub_comp.name}
        </div>
        <div className="flex gap-6 text-xs">
          <div className="flex flex-col gap-2">
            <span>Current State</span>
            <Badge text={`${sub_comp.current_state}`} variant={"info"} />
          </div>
          <div className="flex flex-col gap-2">
            <span>Target</span>
            <Badge text={`${sub_comp.target}`} variant={"warning"} />
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex flex-col gap-2 ">
            <span className="font-semibold text-xs">Timeline</span>
            <p className="text-xs">{sub_comp.gap_address}</p>
          </div>

          <div className="flex flex-col gap-2 ">
            <span className="font-semibold text-xs">Gap Addressed</span>
            <p className="text-xs">{sub_comp.gap_address}</p>
          </div>
          <div className="flex flex-col gap-2 ">
            <span className="font-semibold text-xs">
              Strategic Initiatives / Activities
            </span>
            <p className="text-xs">{sub_comp.strategic_invitation}</p>
          </div>
          <div className="flex flex-col gap-2 ">
            <span className="font-semibold text-xs">Who is responsible?</span>
            <p className="text-xs">{sub_comp.who_responsible}</p>
          </div>
          <div className="flex flex-col gap-2 ">
            <span className="font-semibold text-xs">
              What resources are needed?
            </span>
            <p className="text-xs">{sub_comp.resource_used}</p>
          </div>
          <div className="flex flex-col gap-2 ">
            <span className="font-semibold text-xs">
              Documentation / Means of verification
            </span>
            <p className="text-xs">{sub_comp.upload_document}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
