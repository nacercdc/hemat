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
  scalesLoading?: boolean;
  createdSubComponentId?: string | null;
  subComponent?: SubComponent;
  defaultFieldsLoading?: boolean;
  defaultFieldsSuccess?: boolean;
  scalesSuccess?: boolean;
  onScalesSubmit: (data: ScalesFormData) => void;
  onDefaultFieldsSubmit: (data: DefaultFieldsFormData) => void;
}

export function SubComponentForm({
  subComponent,
  createdSubComponentId,
  scalesLoading,
  onScalesSubmit,
  defaultFieldsLoading,
  defaultFieldsSuccess,
  scalesSuccess,
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

  const handleDefaultFieldsSubmit = (data: DefaultFieldsFormData) => {
    onDefaultFieldsSubmit(data);
    if (!subComponent) {
      setScalesStepInitialLanguages(data.selectedLanguages || []);
    }
    setCurrentStep(2);
  };

  const handleScalesSubmit = (data: ScalesFormData) => {
    onScalesSubmit(data);
  };

  useEffect(() => {
    if (subComponent && !defaultFieldsSuccess) {
      setCurrentStep(1);
    }
  }, [subComponent, defaultFieldsSuccess]);

  useEffect(() => {
    if (defaultFieldsSuccess) {
      setCurrentStep(2);
    }
  }, [defaultFieldsSuccess]);

  useEffect(() => {
    if (scalesSuccess) {
      setCurrentStep(1);
    }
  }, [scalesSuccess]);

  return (
    <div className="flex flex-col gap-2 w-full max-h-[700px] overflow-y-auto">
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
        {shouldShowScalesForm && (
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
              <span className="text-sm font-medium">Measurement Scales</span>
            </div>
          </>
        )}
      </div>

      {/* Step 1: Default Fields Form */}
      {(currentStep !== 2 || defaultFieldsLoading) && (
        <DefaultFieldsForm
          loading={defaultFieldsLoading}
          subComponent={subComponentDetail}
          onSubmit={handleDefaultFieldsSubmit}
        />
      )}

      {/* Step 2: Scales Form */}
      {currentStep === 2 && shouldShowScalesForm && (
        <ScalesForm
          createdSubComponentId={createdSubComponentId}
          loading={scalesLoading}
          item={subComponentDetail}
          onSubmit={handleScalesSubmit}
          initialSelectedLanguages={scalesStepInitialLanguages}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {/* Show both forms when editing existing subcomponent */}
      {/* {subComponent && shouldShowScalesForm && (
        <>
          <DefaultFieldsForm
            loading={defaultFieldsLoading}
            item={subComponentDetail}
            onSubmit={handleDefaultFieldsSubmit}
          />
          <ScalesForm
            createdSubComponentId={createdSubComponentId}
            loading={scalesLoading}
            item={subComponentDetail}
            onSubmit={handleScalesSubmit}
          />
        </>
      )} */}
    </div>
  );
}
