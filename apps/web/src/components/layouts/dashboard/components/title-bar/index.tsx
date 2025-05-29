import React from "react";

interface Props {
  title: string;
  children?: React.ReactNode;
}

export default function TitleBar({ title, children }: Props) {
  return (
    <div className="flex justify-between w-full">
      <span className="text-2xl font-bold">{title}</span>
      {children}
    </div>
  );
}
