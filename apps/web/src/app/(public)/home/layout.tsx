import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: Props) {
  return <div className="max-h-screen overflow-y-auto">{children}</div>;
}
