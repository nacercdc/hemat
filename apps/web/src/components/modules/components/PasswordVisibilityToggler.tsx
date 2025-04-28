import React from "react";
import { Icon } from "@iconify/react";

interface Props {
  visible: boolean;
  onToggle: () => void;
}

export default function PasswordVisibilityToggler({
  visible,
  onToggle,
}: Props) {
  return (
    <button type="button" onClick={onToggle}>
      <Icon
        icon={visible ? "iconamoon:eye-off-light" : "iconamoon:eye-light"}
        className="w-6 cursor-pointer font-extralight mr-3 mt-2"
      />
    </button>
  );
}
