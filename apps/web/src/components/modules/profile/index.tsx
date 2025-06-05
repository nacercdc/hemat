"use client";

import React from "react";
import { PageContainer } from "../components/PageContainer";
import { UpsideDownInvertedTabs } from "~/components/ui/upside-down-inverted-tabs";
import ProfileTab from "./components/tabs/profile-tab";
import ChangePasswordTab from "./components/tabs/change-password-tab";

export function Profile() {
  return (
    <PageContainer pageTitle="Profile Setting" includeBreadcrumb={false}>
      <div className="px-8">
        <UpsideDownInvertedTabs
          options={[
            {
              value: "profile",
              label: "Profile",
              content: (
                <div className="mt-9 px-2">
                  <ProfileTab />
                </div>
              ),
            },
            {
              value: "change-password",
              label: "Change Password",
              content: (
                <div className="mt-9 px-2">
                  <ChangePasswordTab />
                </div>
              ),
            },
          ]}
          defaultValue="profile"
        />
      </div>
    </PageContainer>
  );
}
