import React from "react";

interface Props {
  children: React.ReactNode;
}

export function PageContainer({ children }: Props) {
  return (
    <div className="flex flex-col gap-4 w-full h-full rounded-md px-4 py-7 bg-white">
      {children}
    </div>
  );
}
