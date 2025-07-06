import React from "react";
import { Icon } from "@iconify/react";
import { DropdownMenu } from "@etm/web-ui-components";

interface Props {
  id: string;
  refetch?: (email?: string) => void;
}
export default function MemberAction({ id, refetch }: Props) {
  const onGotoRemoveMemberHandler = () => {
    if (refetch) {
      refetch(id); // Call removeEmail with this email
    }
  };

  const onGotoTeamLeaderHandler = () => {
    //TODO this a function make the user a Time leader
    console.log(`Make ${id} a Team Leader`);
  };

  return (
    <DropdownMenu
      triggerTextAlign="end"
      align="end"
      trigger={
        <Icon
          icon="mi:options-horizontal"
          className="text-xl text-right text-dark"
        />
      }
      options={[
        {
          value: "Group leader",
          label: "Group leader",
          onClick: onGotoTeamLeaderHandler,
        },
        {
          value: "Remove",
          label: "Remove",
          destructive: true,
          onClick: onGotoRemoveMemberHandler,
        },
      ]}
    />
  );
}
