import React from "react";

interface Props {
  header: string;
  subHeader: string;
}

export function AuthCardHeader({ header, subHeader }: Props) {
  return (
    <div className="flex flex-col gap-0">
      <h2 className="text-2xl font-semibold">{header}</h2>
      <div className="max-w-xs">
        <h5 className="text-xs text-dark-lighter font-medium ">{subHeader}</h5>
      </div>
    </div>
  );
}
