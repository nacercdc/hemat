"use client";

import React, { useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { DomainCardList, DomainScore } from "./DomainCardList";
import { DomainCollapsibleList } from "./DomainCollapsibleList";
import { SelectedDomainProvider } from "../../context/selected-domain/SelectedDomainProvider";
import { Map } from "./Map";

export function AssessmentDetailSection() {
  return (
    <SelectedDomainProvider>
      <div className="w-full flex flex-col gap-11 bg-white/65 py-12">
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
