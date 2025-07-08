import React from "react";
import { Avatar } from "@etm/web-ui-components";
import { getInitials } from "~/utils/string.util";

interface Props {
  name?: string;
  email?: string;
  isLeader?: boolean;
  avatarUrl?: string;
}
export default function MemberInfo({
  name,
  email,
  avatarUrl,
  isLeader,
}: Props) {
  return (
    <div className="flex gap-2 justify-between px-2">
      <div className="flex gap-2 items-center">
        <Avatar
          src={avatarUrl ?? ""}
          alt="user_profile_image"
          fallback={getInitials(name ? name : email)}
          size="md"
        />
        <div className="flex flex-col text-xs">
          {name && <span className="font-bold">{name}</span>}
          {email && <span className="flex ">{email}</span>}
          {isLeader && <span className="font-bold">Team Leader</span>}
        </div>
      </div>
    </div>
  );
}
