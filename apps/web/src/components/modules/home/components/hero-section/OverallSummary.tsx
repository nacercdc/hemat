import React from "react";
import { Icon } from "@iconify/react";
import { Colors } from "../../constants";
import { Button } from "@etm/web-ui-components";

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
          <h3
            className="text-xl font-bold"
            style={{ color: `${Colors.HERO_H2}` }}
          >
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
        <div className="flex items-center gap-3">
          <div className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center">
            <Icon icon="la:map" className="!w-6 !h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-[#F2D98C]">42</span>
            <span className="text-white/65 font-medium text-sm">
              Active Countries
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center">
            <Icon
              icon="material-symbols:domain-rounded"
              className="!w-6 !h-6"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-[#F2D98C]">4</span>
            <span className="text-white/65 font-medium text-sm">Domain</span>
          </div>
        </div>
      </div>
    </div>
  );
}
