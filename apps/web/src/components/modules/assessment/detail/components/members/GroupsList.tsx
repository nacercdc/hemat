import { Avatar } from "@etm/web-ui-components";
import React from "react";
import { getInitials } from "~/utils/string.util";

export default function GroupsList() {
  return (
    <div className="p-2 bg-white rounded-sm flex flex-col gap-3">
      <h1 className="text-sm font-bold">Group A</h1>
      <div className="w-full flex flex-col gap-4">
        <div className="flex gap-2 justify-between px-2">
          <div className="flex gap-2">
            <Avatar
              src={"http://path-that-goes-no-where.com"}
              alt="user_profile_image"
              fallback={getInitials("ETM ABC")}
              size="md"
            />
            <div className="flex flex-col text-xs py-1">
              <span className="font-bold">Dr. Kebede Alemu</span>
              <span> kebede@gmail.com</span>
            </div>
          </div>
          <span className="text-xs font-bold items-center"> Leader </span>
        </div>
      </div>
    </div>
  );
}
