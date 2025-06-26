import { Button, Progress } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
interface Domain {
  id: string;
  name: string;
  componentsCount: number;
  subComponentsCount: number;
  progress: number;
}

interface Props {
  domain: Domain;
  onDetailViewClickHandler: (id: string) => void;
  onFillClickHandler: (id: string) => void;
}

export default function AssessmentDomainCard({
  domain,
  onDetailViewClickHandler,
  onFillClickHandler,
}: Props) {
  return (
    <div
      key={domain.name}
      className="flex flex-col w-60 min-h-56 border border-dark-lighter/20 bg-card rounded-xl p-4 justify-between"
    >
      <div
        className="flex flex-col gap-3 items-start text-wrap"
        onClick={() => onDetailViewClickHandler(domain.id)}
      >
        <h3 className="text-sm font-bold">{domain.name}</h3>
        <div className="flex items-center">
          <span className="text-xs font-normal flex-wrap">Components :</span>
          <span className="text-sm font-bold">{domain.componentsCount}</span>
        </div>
        <div className="flex items-center flex-wrap">
          <span className="text-xs font-normal">Sub-Components :</span>
          <span className="text-sm font-bold">{domain.subComponentsCount}</span>
        </div>
      </div>

      <div className="flex flex-col w-full justify-between items-center gap-4">
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-primary">Progress</span>
            <span className="text-xs font-semibold text-dark-light">
              {domain.progress}%
            </span>
          </div>
          <Progress
            value={domain.progress}
            color="#00B156"
            size="md"
            shape="circular"
          />
          <div className="flex w-full items-center mt-4">
            <Button
              size="fullSm"
              variant="outline"
              onClick={() => onFillClickHandler(domain.id)}
            >
              <div className="flex items-center justify-center gap-4">
                Fill
                <Icon icon="lucide:chevron-right" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
