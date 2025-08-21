import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@etm/web-ui-components";
import { TotalDomains } from "./TotalDomains";
import { TotalComponents } from "./TotalComponents";
import { TotalSubComponents } from "./TotalSubComponents";

export function OverallSummary() {
  return (
    <div className="xl:flex-col w-full text-white xl:justify-between hidden xl:flex">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-7xl">HIEMAT</h1>
          <div className="flex flex-col gap-1">
            <h2 className=" text-3xl">Health Information Exchange Maturity</h2>
            <h2 className="font-light text-3xl">Assessment Toolkit</h2>
          </div>
        </div>
        <p className="text-sm max-w-lg leading-6">
          The HIEMAT is a structured tool developed by Africa CDC to help
          African Union Member States assess and improve their Health
          Information Exchange (HIE) systems. It evaluates maturity across four
          domains Leadership & Governance, Workforce & Management, ICT
          Infrastructure, and Standards & Interoperability and provides
          practical roadmaps to strengthen interoperability, identify gaps, and
          guide investments in digital health.
        </p>
        <h3
          className="text-[0.9rem]] font-semibold max-w-2xl"
          style={{ color: "#E8D8A6" }}
        >
          This toolkit empowers countries to track progress, promote data-driven
          decision-making, and advance seamless health data exchange across the
          continent.
        </h3>
      </div>
      {/* <div className="flex flex-col gap-1">
        <span className="font-medium text-sm text-white/75">
          Let's get started
        </span>
        <Button
          size="xl"
          color="light"
          variant="outline"
          onClick={() => {
            router.push("/register");
          }}
        >
          Register
        </Button>
      </div> */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-10">
          <TotalDomains />
          <TotalComponents />
          <TotalSubComponents />
        </div>
        <a href="#assessment_tools">
          <Button
            rightNode={
              <Icon icon="gravity-ui:arrow-up" className="rotate-90" />
            }
          >
            ASSESSMENT TOOL OVERVIEW
          </Button>
        </a>
      </div>
    </div>
  );
}
