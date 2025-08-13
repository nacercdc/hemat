import React from "react";
import { Avatar } from "@etm/web-ui-components";
import { capitalizeFirstLetter, getInitials } from "~/utils/string.util";

interface Props {
  name: string | undefined;
  email: string | undefined;
  isAdmin?: boolean;
  avatarUrl?: string;
  role: string | undefined;
}
export default function GroupMemberCard({
  name,
  email,
  isAdmin = false,
  avatarUrl,
  role,
}: Props) {
  return (
    <div className="flex gap-2 justify-between px-2">
      <div className="flex gap-2">
        <Avatar
          src={avatarUrl ?? ""}
          alt="user_profile_image"
          fallback={getInitials(
            name
              ? (() => {
                  const parts = name.trim().split(" ");
                  return parts.length > 1 ? parts[1] : parts[0];
                })()
              : ""
          )}
          size="md"
        />
        <div className="flex flex-col text-xs py-1">
          <span className="font-bold">{name}</span>
          <span>{email}</span>
        </div>
      </div>
      <span className="text-xs font-normal items-center">
        {capitalizeFirstLetter(role ?? "")}
      </span>
    </div>
  );
}
