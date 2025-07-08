import React from "react";
import { NavBar } from "./components/NavBar";
import HeroSection from "./components/hero-section";
import { AssessmentDetailSection } from "./components/assessment-detail-section";
import AssessmentToolsSection from "./components/assessment-tools-section";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full flex flex-col">
        <NavBar />
        <HeroSection />
      </div>
      <AssessmentDetailSection />
      <AssessmentToolsSection />
    </div>
  );
}
