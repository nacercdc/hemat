"use client";

import React from "react";
import AssessmentToolsSection from "./components/assessment-tools-section";
import HeroSection from "./components/hero-section";
import { NavBar } from "./components/NavBar";
import { AssessmentDetailSection } from "./components/assessment-detail-section";
import { FooterSection } from "./components/footer-section";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex flex-col">
        <NavBar />
        <HeroSection />
      </div>
      <AssessmentDetailSection />
      <AssessmentToolsSection />
      <FooterSection />
    </div>
  );
}
