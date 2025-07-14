import React from "react";
import HelpSupportButton from "~/components/modules/support/components/button";

interface Props {
  children: React.ReactNode;
}

export default function layout({ children }: Props) {
  return (
    <div className="w-full h-full relative">
      {children} <HelpSupportButton />
    </div>
  );
}
