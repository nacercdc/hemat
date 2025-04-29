import React from "react";

interface Props {
  children: React.ReactNode;
}

export function SummaryContainer({ children }: Props) {
  return (
    <div className="flex rounded-md w-full py-4 px-6 bg-white">{children}</div>
  );
}
