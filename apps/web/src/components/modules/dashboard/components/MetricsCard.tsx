import { isLightColor } from "../utils/luminacity.util";

interface Props {
  name: string;
  rate: number;
  color: string;
}




export default function MetricsCard({name, rate, color}: Props) {
  const textColor = isLightColor(color) ? 'text-black' : 'text-white';
  
  return (
    <div className="flex gap-5 items-center">
      <div 
        style={{background: color}} 
        className={`flex items-center justify-center w-9 h-6 rounded-sm font-bold text-sm ${textColor}`}
      >
        {rate}
      </div>
      <span className="text-sm font-medium">{name}</span>
    </div>
  );
}
