import React from "react";
import { HorizontalDotButton } from "./HorizontalDotButton";
interface Props {
  icon: React.ReactElement;
  title: string;
  subtitle: string;
}
export default function SummaryCard({ icon, title, subtitle }: Props) {
  return (
    <div className="flex flex-row relative items-center bg-white rounded-sm h-28 w-full px-6 py-6 gap-6">
      <div className="top-2 right-2 absolute">
        <HorizontalDotButton />
      </div>
      <div className="p-2.5 bg-primary-900/10 h-12 rounded-md">{icon}</div>
      <div className="flex flex-col gap-0">
        <span className="font-bold text-3xl text-basic-800">{title}</span>
        <span className="text-xs text-dark-light">{subtitle}</span>
      </div>
    </div>
  );
}
