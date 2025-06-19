import React from "react";

import { SecondaryTabs } from "@etm/web-ui-components";

import { Domain } from "./components/tabs/domains";
import SubComponents from "./components/tabs/subComponents";
import MeasurementScales from "./components/tabs/measurement-scales";
import ComponentsTab from "./components/tabs/components-tab";

export function Settings() {
  return (
    <div className="">
      <SecondaryTabs
        options={[
          {
            value: "domain",
            label: "Domain",
            content: <Domain />,
          },
          {
            value: "components",
            label: "Components",
            content: <ComponentsTab />,
          },
          {
            value: "subComponents",
            label: "SubComponents",
            content: <SubComponents />,
          },
          {
            value: "measurement-scale",
            label: "Measurement-Scale",
            content: <MeasurementScales />,
          },
        ]}
        defaultValue="domain"
      />
    </div>
  );
}
