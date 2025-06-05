import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

export default function GroupsLeaderDefault() {
  return (
    <div className="p-2 bg-white rounded-sm flex flex-col gap-3">
      <h1 className="text-sm font-bold items-start">Groups Leader</h1>
      <div className="w-full flex flex-col gap-2 items-center">
        <div className="rounded-full bg-layout-bg w-fit flex items-center p-2 ">
          <Icon
            icon={"meteor-icons:user"}
            className="!w-6 !h-6 text-primary-400"
          />
        </div>
        <span className="text-sm font-thin">Group leader here</span>
      </div>
    </div>
  );
}
