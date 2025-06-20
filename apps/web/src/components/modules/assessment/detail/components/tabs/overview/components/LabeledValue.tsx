import React from "react";

interface Props {
  label: string;
  value: string | number | null | undefined | Date | React.ReactNode;
  boldLabel?: boolean;
}

const LabeledValue: React.FC<Props> = ({ label, value, boldLabel = true }) => {
  const displayValue =
    value instanceof Date
      ? value.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : (value ?? "N/A");

  return (
    <div className="flex gap-4">
      <span className={`text-xs ${boldLabel ? "font-bold" : "font-medium"}`}>
        {label}
      </span>
      <span className="text-xs font-normal">{displayValue}</span>
    </div>
  );
};

export default LabeledValue;
