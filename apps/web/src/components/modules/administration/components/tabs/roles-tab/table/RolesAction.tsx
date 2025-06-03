"use client";

import React from "react";
import { DropdownMenu } from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { Role } from "~/libs/models/role.model";

interface Props {
  role: Role;
  onRefetch?: () => void;
}

export default function RolesAction({ role: _ }: Props) {
  return (
    <>
      <DropdownMenu
        triggerTextAlign="end"
        align="end"
        trigger={
          <Icon
            icon="mi:options-horizontal"
            className="text-xl text-right text-dark"
          />
        }
        options={[]}
      />
    </>
  );
}
