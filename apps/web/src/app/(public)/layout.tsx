import React from "react";

interface Props {
  children: React.ReactNode;
}
export default function PublicLayout({ children }: Props) {
  return <div className="w-full h-full">{children}</div>;
}
