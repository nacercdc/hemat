import React from "react";

interface Props {
  label: string;
  value: string | number | null | undefined;
  boldLabel?: boolean;
}

const LabeledValue: React.FC<Props> = ({ label, value, boldLabel = true }) => {
  return (
    <div className="flex gap-4">
      <span className={`text-sm ${boldLabel ? "font-bold" : "font-medium"}`}>
        {label}
      </span>
      <span className="text-xs font-normal">{value ?? "N/A"}</span>
    </div>
  );
};

export default LabeledValue;
