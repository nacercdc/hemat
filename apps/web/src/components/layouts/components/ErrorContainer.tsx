import { Icon } from "@iconify/react";
import React from "react";
interface Props {
  children: React.ReactNode;
}
export default function ErrorContainer({ children }: Props) {
  return (
    <div className="h-[calc(100vh-78px)] flex-1 flex flex-col items-center justify-center bg-white text-basic w-full rounded-md">
      <Icon className="text-destructive-500" width={50} icon="ooui:error" />
      {children}
    </div>
  );
}
