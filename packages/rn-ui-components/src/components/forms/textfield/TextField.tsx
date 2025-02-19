import type { ComponentPropsWithoutRef } from "react";
import React from "react";
import { TextField as NWTextField } from "../../../nativewindui/components/textfield";
import { omit } from "@etm/utilities";
import { FormController } from "../helper/FormController";

interface Props
  extends Omit<
    ComponentPropsWithoutRef<typeof NWTextField>,
    | "className"
    | "style"
    | "labelClassName"
    | "containerClassName"
    | "placeholderClassName"
  > {
  caption?: string;
}

export const TextField = ({ caption, ...props }: Props) => {
  return (
    <FormController errorMessage={props.errorMessage} caption={caption}>
      <NWTextField
        {...omit(
          props as ComponentPropsWithoutRef<typeof NWTextField>,
          "className",
          "style",
          "labelClassName",
          "containerClassName",
          "placeholderClassName"
        )}
      />
    </FormController>
  );
};
