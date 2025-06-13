import React from "react";
import { Icon } from "@iconify/react";
import { DropdownMenu } from "@etm/web-ui-components";

interface Props {
  id: string;
  refetch?: () => void;
}
export default function MemberAction({ id: _ }: Props) {
  const onGotoRemoveMemberHandler = () => {
    //TODO this is remove the user form the list
  };

  const onGotoTeamLeaderHandler = () => {
    //TODO this a function make the user a Time leader
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
