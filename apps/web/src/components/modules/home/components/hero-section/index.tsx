import React from "react";
import { OverallSummary } from "./OverallSummary";
import { OverallStats } from "./OverallStats";
import { Partners } from "./Partners";

export default function HeroSection() {
  return (
    <div className="flex flex-col">
      <div
        className="grid grid-cols-1 xl:grid-cols-2 gap-4 p-10 2xl:px-60 py-10 min-h-[calc(100vh-290px)] w-full"
        style={{ backgroundColor: "#273E35" }}
      >
        <OverallSummary />
        <OverallStats />
      </div>
      <div className="flex items-center justify-center w-full bg-white">
        <Partners />
      </div>
    </div>
  );
}
