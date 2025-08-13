import React from "react";
import { Avatar } from "@etm/web-ui-components";
import { capitalizeFirstLetter, getInitials } from "~/utils/string.util";

interface Props {
  name?: string;
  email?: string;
  userId?: string;
  isLeader?: boolean;
  avatarUrl?: string;
  status?: string;
  role?: string;
}
export default function MemberInfo({ name, email, avatarUrl, role }: Props) {
  return (
    <div className="flex gap-2 justify-between px-2">
      <div className="flex gap-2 items-center">
        <Avatar
          src={avatarUrl ?? ""}
          alt="user_profile_image"
          fallback={getInitials(
            name
              ? name
                ? (() => {
                    const parts = name.trim().split(" ");
                    return parts.length > 1 ? parts[1] : parts[0];
                  })()
                : ""
              : email
          )}
          size="md"
        />
        <div className="flex flex-col text-xs w-full">
          {name && <span className="font-bold w-fit">{name}</span>}
          {email && <span className="flex ">{email}</span>}
          {role && (
            <span className="flex font-bold">
              {capitalizeFirstLetter(role)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
