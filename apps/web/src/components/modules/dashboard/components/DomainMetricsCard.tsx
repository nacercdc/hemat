import { Progress } from "@etm/web-ui-components";
import { isLightColor } from "../utils/luminacity.util";

interface Props {
  domain: string;
  scale: {
    name: string;
    rate: number;
    color: string;
  };
}

export default function DomainMetricsCard({ domain, scale }: Props) {
  const textColor = isLightColor(scale.color) ? "text-black" : "text-white";

  return (
    <div
      className="flex flex-col gap-2 items-start h-20 min-w-72 bg-card border-l-2 rounded-sm py-2 px-4 "
      style={{ borderColor: scale.color }}
    >
      <span className="text-sm font-medium ">{domain}</span>
      <div className="flex gap-1">
        <span className="text-xs font-normal">{scale.name}</span>
        <div
          className={`flex items-center justify-center w-5 h-4 rounded-[3px] text-xs font-medium ${textColor}`}
          style={{ background: scale.color }}
        >
          {scale.rate}
        </div>
      </div>
      <div className="flex items-center justify-center w-9/12 zh-2 rounded-[3px]">
        <Progress value={30} shape="circular" color={scale.color} size="md" />
      </div>
    </div>
  );
}
