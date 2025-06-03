import { Icon } from "@iconify/react/dist/iconify.js";
import { cn } from "~/utils/cn.util";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function MetricsContainer({children,title}:Props) {
  return (
 <div className="flex bg-layout-bg/15 p-3 rounded-md w-full min-h-40">
  <div className={cn("flex flex-col rounded-md w-full p-2", {
    "bg-card": title==="Measurement Metrics"
  })}>
    <div className="flex gap-5 items-center">
      <Icon icon="fluent-mdl2:assessment-group"/>
    <span className="text-sm font-bold">{title}</span>
    </div>
    {children}
  </div>
 </div>
  );
}