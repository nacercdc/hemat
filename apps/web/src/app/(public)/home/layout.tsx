import React from "react";

interface Props {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: Props) {
  return (
    <div className="max-h-screen overflow-y-auto overflow-x-hidden w-screen">
      {children}
    </div>
  );
}
