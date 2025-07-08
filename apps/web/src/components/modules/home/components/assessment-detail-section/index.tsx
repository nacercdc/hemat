"use client";

import React from "react";
import { SectionHeader } from "./SectionHeader";
import { DomainCardList } from "./DomainCardList";
import { DomainCollapsibleList } from "./DomainCollapsibleList";
import { SelectedDomainProvider } from "../../context/selected-domain/SelectedDomainProvider";
import { Map } from "./Map";

export function AssessmentDetailSection() {
  return (
    <SelectedDomainProvider>
      <div className="w-full flex flex-col gap-11 bg-white/65 pt-12">
        <div className="flex flex-col gap-11 px-10 2xl:px-48 w-full">
          <SectionHeader />
          <DomainCardList />
        </div>
        <DomainCollapsibleList />
        <Map />
      </div>
    </SelectedDomainProvider>
  );
}
