import React from "react";

interface Props {
  children: React.ReactNode;
}
export default function PageTableContainer({ children }: Props) {
  return <div className="p-2 mb-6 rounded-sm h-[620px]">{children}</div>;
}
