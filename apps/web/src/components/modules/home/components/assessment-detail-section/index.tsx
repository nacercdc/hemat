import React from "react";
import { SectionHeader } from "./SectionHeader";
import { DomainCardList } from "./DomainCardList";
import { DomainCollapsibleList } from "./DomainCollapsibleList";

export function AssessmentDetailSection() {
  return (
    <div className="w-full flex flex-col gap-11 bg-white/65 py-12">
      <div className="flex flex-col gap-11 px-48">
        <SectionHeader />
        <DomainCardList />
      </div>
      <DomainCollapsibleList />
    </div>
  );
}
