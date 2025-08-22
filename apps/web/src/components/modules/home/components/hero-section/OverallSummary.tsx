import React from "react";
import { Icon } from "@iconify/react";
import { Button } from "@etm/web-ui-components";
import { TotalDomains } from "./TotalDomains";
import { TotalComponents } from "./TotalComponents";
import { TotalSubComponents } from "./TotalSubComponents";

export function OverallSummary() {
  return (
    <div className="flex-col w-full text-white justify-between flex items-center md:items-start">
      <div className="flex flex-col gap-10 items-center md:items-start">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <h1 className="font-bold text-7xl">HIEMAT</h1>
          <h2 className="text-center md:text-start text-3xl">
            Health Information Exchange Maturity
          </h2>
          <h2 className="font-light text-3xl inline-block xl:block md:text-start text-center">
            Assessment Toolkit
          </h2>
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
      <div className="flex flex-col gap-4 md:mt-2 mt-7">
        <div className="flex xl:flex-row gap-2 flex-col">
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
