import { formatDateToYYYYMMDD } from "@etm/utilities";
import { Badge } from "@etm/web-ui-components";
import React from "react";
import type { RoadmapSubComponent } from "~/libs/models/roadmap.model";

interface Props {
  subComponent: RoadmapSubComponent;
}

export default function SubComponentRoadmapList({ subComponent }: Props) {
  return (
    <div
      className="flex flex-col gap-4 bg-basic-200/20 p-4 rounded-md"
      key={subComponent.code}
    >
      <div className="flex flex-col gap-2 ">
        <div className="text-xs font-bold">
          {subComponent.code} {subComponent.name}
        </div>
        <div className="flex gap-6 text-xs">
          <div className="flex flex-col gap-2">
            <span>Current State</span>
            <Badge
              text={`${subComponent.roadmap?.currentState}`}
              variant={"info"}
            />
          </div>
          <div className="flex flex-col gap-2">
            <span>Target</span>
            <Badge
              text={`${subComponent.roadmap?.target}`}
              variant={"warning"}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex flex-col gap-2 ">
            <span className="font-semibold text-xs ">Timeline</span>
            <div className="flex flex-wrap w-full gap-4 text-xs">
              <p>
                {subComponent.roadmap?.startTime
                  ? formatDateToYYYYMMDD(subComponent.roadmap?.startTime ?? "")
                  : "-"}
              </p>
              <p>-</p>
              <p>
                {subComponent.roadmap?.endTime
                  ? formatDateToYYYYMMDD(subComponent.roadmap?.endTime ?? "")
                  : "-"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 ">
            <span className="font-semibold text-xs">Gap Addressed</span>
            <p>
              <span
                className="text-xs"
                dangerouslySetInnerHTML={{
                  __html: subComponent.roadmap?.gapAddressed ?? "-",
                }}
              />
            </p>
          </div>
          <div className="flex flex-col gap-2 ">
            <span className="font-semibold text-xs">
              Strategic Initiatives / Activities
            </span>
            <p>
              <span
                className="text-xs"
                dangerouslySetInnerHTML={{
                  __html: subComponent.roadmap?.activities ?? "-",
                }}
              />
            </p>
          </div>
          <div className="flex flex-col gap-2 ">
            <span className="font-semibold text-xs">Who is responsible?</span>
            <p>
              <span
                className="text-xs"
                dangerouslySetInnerHTML={{
                  __html: subComponent.roadmap?.responsible ?? "-",
                }}
              />
            </p>
          </div>
          <div className="flex flex-col gap-2 ">
            <span className="font-semibold text-xs">
              What resources are needed?
            </span>
            <p>
              <span
                className="text-xs"
                dangerouslySetInnerHTML={{
                  __html: subComponent.roadmap?.resources ?? "-",
                }}
              />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
