import React from "react";
import { Button } from "@etm/web-ui-components";
import { ActiveCountries } from "./ActiveCountries";
import { TotalDomains } from "./TotalDomains";

export function OverallSummary() {
  return (
    <div className="xl:flex-col w-full text-white xl:justify-between hidden xl:flex">
      <div className="flex flex-col gap-5">
        <h1 className="font-bold text-7xl">Africa CDC</h1>
        <div className="flex flex-col gap-1">
          <h2 className="font-light text-3xl">
            Centers for Diseases Control and
          </h2>
          <h2 className="font-light text-3xl">Prevention</h2>
          <h3 className="text-xl font-bold" style={{ color: "#E8D8A6" }}>
            Safeguarding Africa's Health
          </h3>
        </div>
        <p className="text-sm">
          Is a specialized technical institution of the Africa Union established
          to
          <br />
          support public health initiatives of member states
        </p>
      </div>
      <div className="flex flex-col gap-1">
        <span className="font-medium text-sm text-white/75">
          Lest get started
        </span>
        <Button size="xl" color="light">
          Register
        </Button>
      </div>
      <div className="flex gap-10">
        <ActiveCountries />
        <TotalDomains />
      </div>
    </div>
  );
}
