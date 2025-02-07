import type { ComponentPropsWithoutRef } from "react";
import React from "react";
import { Button as NWButton } from "../../../nativewindui/components/button/Button";
import { omit } from "@e-market/utilities";

type Props = Omit<
  ComponentPropsWithoutRef<typeof NWButton>,
  "className" | "style"
>;

export const Button = (props: Props) => {
  return (
    <NWButton
      {...omit(
        props as ComponentPropsWithoutRef<typeof NWButton>,
        "className",
        "style"
      )}
    />
  );
};
