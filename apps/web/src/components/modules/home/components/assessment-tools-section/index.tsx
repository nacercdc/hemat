"use client";

import React from "react";
import { DomainToolsCollapsibleList } from "./DomainToolsCollapsibleList";
import { AnimatedSection, fadeInUp } from "../AnimatedSection";

export default function AssessmentToolsSection() {
  return (
    <div className="bg-[#fafafa]">
      <AnimatedSection animation={fadeInUp} className="w-full">
        <div className="flex flex-col gap-11 px-10 2xl:px-48 py-12">
          <h2 className="text-3xl font-bold">Assessment Tools</h2>
          <DomainToolsCollapsibleList />
        </div>
      </AnimatedSection>
    </div>
  );
}
