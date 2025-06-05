import React from "react";

interface LabeledValueProps {
  label: string;
  value: string | number | null | undefined;
  boldLabel?: boolean;
}

const LabeledValue: React.FC<LabeledValueProps> = ({
  label,
  value,
  boldLabel = true,
}) => {
  return (
    <div className="flex gap-4">
      <span className={`text-sm ${boldLabel ? "font-bold" : "font-medium"}`}>
        {label}
      </span>
      <span className="text-sm font-thin">{value ?? "N/A"}</span>
    </div>
  );
};

export default LabeledValue;
