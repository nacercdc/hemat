"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { PageContainer } from "../components/PageContainer";
import { Button } from "@etm/web-ui-components";
import { UpsideDownInvertedTabs } from "~/components/ui/upside-down-inverted-tabs";
import { RolesTable } from "./components/tabs/roles-tab";

export function Administration() {
  return (
    <PageContainer
      pageTitle="Administration"
      includeBreadcrumb={false}
      actionNodes={
        <Button
          leftNode={
            <Icon icon={"material-symbols:add"} className="!w-5 !h-5" />
          }
          size="lg"
          onClick={() => {
            //TODO: Implement add role or user
          }}
        >
          Add
        </Button>
      }
    >
      <div className="px-8">
        <UpsideDownInvertedTabs
          options={[
            {
              value: "users",
              label: "Users",
              content: <div className="mt-7 px-2">Users Tab</div>,
            },
            {
              value: "roles",
              label: "Roles",
              content: (
                <div className="mt-7">
                  <RolesTable />
                </div>
              ),
            },
          ]}
          defaultValue="users"
        />
      </div>
    </PageContainer>
  );
}
