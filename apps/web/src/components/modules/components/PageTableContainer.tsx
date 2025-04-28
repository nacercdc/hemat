import React from "react";

interface Props {
  children: React.ReactNode;
}
export default function PageTableContainer({ children }: Props) {
  return <div className="p-2 bg-white mb-6">{children}</div>;
}
