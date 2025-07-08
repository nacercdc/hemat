import React from "react";
import { Icon } from "@iconify/react";
import { DropdownMenu } from "@etm/web-ui-components";

type OptionType = "Team leader" | "Make Primary" | "Remove";
interface Props {
  id: string;
  refetch?: (email?: string) => void;
  optionsList?: OptionType[];
}
export default function MemberAction({
  id,
  refetch,
  optionsList = ["Team leader", "Make Primary", "Remove"],
}: Props) {
  const onGotoRemoveMemberHandler = () => {
    if (refetch) {
      refetch(id);
    }
  };

  const onGotoPrimaryLeaderHandler = () => {
    //TODO: this a function make the user a Time leader
    console.log(`Make ${id} a Primary`);
  };

  const onGotoTeamLeaderHandler = () => {
    //TODO: this a function make the user a Time leader
    console.log(`Make ${id} a Team Leader`);
  };
  const allOptions = {
    "Team leader": {
      value: "Team leader",
      label: "Team leader",
      onClick: onGotoTeamLeaderHandler,
    },
    "Make Primary": {
      value: "Make Primary",
      label: "Make Primary",
      onClick: onGotoPrimaryLeaderHandler,
    },
    Remove: {
      value: "Remove",
      label: "Remove",
      destructive: true,
      onClick: onGotoRemoveMemberHandler,
    },
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
      options={optionsList.map((key) => allOptions[key])}
    />
  );
}
