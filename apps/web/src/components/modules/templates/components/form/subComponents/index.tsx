"use client";

import React, { useEffect, useState } from "react";
import type { DefaultFieldsFormData } from "./DefaultFieldsForm";
import { DefaultFieldsForm } from "./DefaultFieldsForm";
import type { ScalesFormData } from "./ScalesForm";
import { ScalesForm } from "./ScalesForm";
import type {
  SubComponent,
  SubComponentIncludable,
} from "~/libs/models/subComponent.model";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";

interface FormLanguage {
  name: string;
  code: string;
  native: string;
}

interface Props {
  subComponent?: SubComponent;
  scalesState: "pending" | "error" | "success" | "idle";
  defaultFieldsState: "pending" | "error" | "success" | "idle";
  createdSubComponentId?: string | null;
  onScalesSubmit: (data: ScalesFormData) => void;
  onDefaultFieldsSubmit: (data: DefaultFieldsFormData) => void;
}

export function SubComponentForm({
  subComponent,
  onScalesSubmit,
  scalesState,
  defaultFieldsState,
  createdSubComponentId,
  onDefaultFieldsSubmit,
}: Props) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [scalesStepInitialLanguages, setScalesStepInitialLanguages] = useState<
    FormLanguage[]
  >([]);

  const { data: subComponentDetail, ..._subComponentState } = useFindById<
    SubComponent,
    SubComponentIncludable
  >({
    path: `sub-components/${subComponent?.id}`,
    queries: {
      include: ["measurementScales"],
    },
    tqOptions: {
      enabled: !!subComponent,
    },
  });

  const shouldShowScalesForm = !!createdSubComponentId || !!subComponent;

  const onDefaultFieldsSubmitHandler = (data: DefaultFieldsFormData) => {
    onDefaultFieldsSubmit(data);
    if (!subComponent) {
      setScalesStepInitialLanguages(data.selectedLanguages || []);
    }
  };

  const onScalesSubmitHandler = (data: ScalesFormData) => {
    onScalesSubmit(data);
  };

  useEffect(() => {
    if (scalesState === "success") {
      setCurrentStep(1);
    }
    if (scalesState === "error") {
      setCurrentStep(2);
    }
  }, [scalesState]);

  useEffect(() => {
    if (defaultFieldsState === "success") {
      setCurrentStep(2);
    } else {
      setCurrentStep(1);
    }
  }, [defaultFieldsState]);

  useEffect(() => {
    if (subComponent && defaultFieldsState !== "success") {
      setCurrentStep(1);
    }
  }, [subComponent, defaultFieldsState]);

  useEffect(() => {
    setCurrentStep(1);
  }, []);

  return (
    <div className="flex flex-col gap-2 w-full min-h-[700px] overflow-y-auto">
      {/* Stepper Header */}
      <div className="flex  items-center gap-2 px-4 py-2 border-b">
        <div
          className={`flex items-center gap-1 ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </div>
          <span className="text-sm font-medium">Basic Information</span>
        </div>

        <>
          <div className="flex w-1/12 h-px bg-border" />
          <div
            className={`flex items-center gap-1 ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium">
              Measurement scales description
            </span>
          </div>
        </>
      </div>

      <div className="relative w-full flex-1 min-h-[600px]">
        {/* Step 1: Default Fields Form */}
        <div
          className={`
            absolute inset-0 transition-opacity duration-300
            ${currentStep === 1 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
        >
          <DefaultFieldsForm
            loading={defaultFieldsState === "pending"}
            subComponent={subComponentDetail}
            onSubmit={onDefaultFieldsSubmitHandler}
          />
        </div>

        {/* Step 2: Scales Form */}
        <div
          className={`
            absolute inset-0 transition-opacity duration-300
            ${currentStep === 2 && shouldShowScalesForm ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
        >
          <ScalesForm
            createdSubComponentId={createdSubComponentId}
            loading={scalesState === "pending"}
            subComponent={subComponentDetail}
            onSubmit={onScalesSubmitHandler}
            initialSelectedLanguages={scalesStepInitialLanguages}
            onBack={() => setCurrentStep(1)}
          />
        </div>
      </div>
    </div>
  );
}
