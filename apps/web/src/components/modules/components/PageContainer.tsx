import React from "react";

interface Props {
  children: React.ReactNode;
}

export function PageContainer({ children }: Props) {
  return <div className="flex flex-col gap-6">{children}</div>;
}
