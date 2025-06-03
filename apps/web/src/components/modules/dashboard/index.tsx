"use client";

import MetricsContainer from "./components/MetricsContainer";
import MetricsCard from "./components/MetricsCard";
import type { Scale } from "~/libs/models/scale.model";
import DomainMetricsCard from "./components/DomainMetricsCard";
import { Map } from "./components/Map";
import { CountriesAccordion } from "./components/CountriesAccordion";
import { FilterSection } from "./components/FilterSection";
import { PageContainer } from "../components/PageContainer";
// import { useState } from "react";

// TODO: replace with real scale data
const metrics: Pick<Scale, "name" | "rate" | "color">[] = [
  {
    name: "Initial",
    rate: 1,
    color: "#FF000080",
  },
  {
    name: "Optimized",
    rate: 1,
    color: "#00FF0080",
  },
  {
    name: "Managed",
    rate: 1,
    color: "#000FF990",
  },
  {
    name: "Defined",
    rate: 1,
    color: "#FFFF0080",
  },
  {
    name: "Developing",
    rate: 1,
    color: "#FFA50080",
  },
];

export default function Dashboard() {
  // const [selectedValue, setSelectedValue] = useState<unknown>();
  // TODO: Replace with real API call

  const fetchedData: Record<string, Pick<Scale, "name" | "rate" | "color">> = {
    Ethiopia: { name: "Developing", rate: 4, color: "#FFA50080" },
    Kenya: { name: "Defined", rate: 3, color: "#FFFF0080" },
    Chad: { name: "Initial", rate: 4, color: "#FF000080" },
    Sudan: { name: "Managed", rate: 2, color: "#000FF990" },
    "South Africa": { name: "Optimized", rate: 5, color: "#00FF0080" },
  };

  const handleCountryClick = (_countryName: string) => {
    // TODO: handle country click event
  };

  // const handleDomainSelect = (value?: unknown) => {
  //   // TODO: handle domain select event
  //   setSelectedValue(value);
  // };

  const handleCountrySelect = (_value?: unknown) => {
    // TODO: handle country select event
  };

  const countryOptions = Object.keys(fetchedData).map((country) => ({
    name: country,
  }));

  return (
    <PageContainer pageTitle="Dashboard">
      <div className="flex flex-col gap-3">
        <MetricsContainer title="Measurement Metrics">
          <div className="flex flex-col-reverse items-start sm:flex-row justify-between sm:items-center">
            <div className="grid w-full max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-6 lg:px-8 py-6">
              {metrics.map((metric, index) => (
                <MetricsCard
                  key={index}
                  name={metric.name}
                  rate={metric.rate}
                  color={metric.color}
                />
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <span className="font-bold text-4xl text-primary">
                Africa CDC
              </span>
              <div className="flex flex-col pr-4">
                <span className="text-sm font-normal">
                  Centers for Disease Control and Prevention
                </span>
                <span className="text-xs font-semibold text-secondary">
                  Safeguarding Africa's Health
                </span>
              </div>
            </div>
          </div>
        </MetricsContainer>
        <MetricsContainer title="Over All Domains Metrics">
          <div className="flex flex-row gap-3 w-full py-5 overflow-x-auto sm:overflow-hidden">
            {metrics.map((metric, index) => (
              <DomainMetricsCard
                key={index}
                scale={metric}
                domain={`Domain ${index + 1}`}
              />
            ))}
          </div>
        </MetricsContainer>

        <FilterSection
          // domain={selectedValue as string}
          countryOptions={countryOptions}
          // onDomainSelect={handleDomainSelect}
          onCountrySelect={handleCountrySelect}
        />

        <div className="p-4 bg-layout-bg/15 rounded-md">
          <Map
            countryStatuses={fetchedData}
            onCountryClick={handleCountryClick}
            width="100%"
            height={600}
          />
        </div>
        <div className="mt-4 bg-layout-bg/15 p-4 rounded-md h-14">
          <CountriesAccordion countryStatuses={fetchedData} />
        </div>
      </div>
    </PageContainer>
  );
}
