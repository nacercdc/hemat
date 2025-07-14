"use client";

import React, { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import type { FilledSubComponent } from "..";

interface Props {
  steps: FilledSubComponent[];
  activeStep: number;
  isDisabled: boolean;
  onStepClick: (index: number) => void;
}

export const Stepper = ({
  steps,
  activeStep,
  isDisabled,
  onStepClick,
}: Props) => {
  const stepperRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (stepperRef.current) {
      const activeElement = stepperRef.current.children[
        activeStep
      ] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      } else {
        stepperRef.current.scrollLeft = 0;
      }
    }
  }, [activeStep]);

  return (
    <nav
      className="flex items-center justify-center my-1 overflow-hidden"
      aria-label="Progress"
    >
      <ol
        ref={stepperRef}
        className="flex gap-2 flex-nowrap overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
      >
        {steps.map((step, index) => (
          <li key={step.id} className="flex items-center">
            <button
              className={`relative flex justify-center items-center w-6 h-6 rounded-full text-xs font-medium transition-colors mx-2 ${
                index === activeStep
                  ? "bg-card text-primary border-[1px] border-primary"
                  : step.filled
                    ? "bg-primary text-card"
                    : "bg-basic-200 text-dark hover:bg-basic-300"
              } ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              onClick={() => !isDisabled && onStepClick(index)}
              disabled={isDisabled}
              aria-current={index === activeStep ? "step" : undefined}
              aria-label={`Go to step ${index + 1}: ${step.name}`}
              title={step.name}
            >
              {index + 1}
            </button>
            {index < steps.length - 1 && (
              <span
                className="w-8 h-1 bg-basic-200 mx-1 ml-3 self-center"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
