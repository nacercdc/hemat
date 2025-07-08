import React from "react";
import { DomainToolsCollapsibleList } from "./DomainToolsCollapsibleList";

export default function AssessmentToolsSection() {
  return (
    <div className="w-full flex flex-col gap-11 px-10 2xl:px-48 bg-[#fafafa] py-12">
      <h2 className="text-3xl font-bold">Assessment Tools</h2>
      <DomainToolsCollapsibleList />
    </div>
  );
}
