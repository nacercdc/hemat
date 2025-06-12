import React from "react";

import { Domain } from "./components/tabs/domain";
import { ComponentsTab } from "./components/tabs/components-tab";

import { SecondaryTabs } from "@etm/web-ui-components";

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
            content: <div>SubComponents</div>,
          },
          {
            value: "measurement-scale",
            label: "Measurement-Scale",
            content: <div>Measurement-Scale</div>,
          },
        ]}
        defaultValue="domain"
      />
    </div>
  );
}
