"use client";

import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { Language } from "~/libs/models/language.model";

import { SubComponentForm } from "./form/SubComponentsForm";
import { MeasurementsForm } from "./form/MeasurementsForm";
import type { AssessmentSubComponent } from "~/libs/models/assessment-sub-component.model";

interface Props {
  activeSubComponent: AssessmentSubComponent | null;
  assessmentId: string;
  refetchSubComponents: () => void;
}

export function Content({
  activeSubComponent,
  assessmentId,
  refetchSubComponents,
}: Props) {
  const { data: languages, isLoading: _languagesLoading } =
    useFindAll<Language>({
      path: "/languages",
    });

  return (
    <div className="flex flex-col w-full md:w-3/4 h-fit bg-card border border-secondary-300 rounded-r-sm">
      {activeSubComponent && (
        <>
          <SubComponentForm
            activeSubComponent={activeSubComponent}
            languageOptions={languages?.data ?? []}
            assessmentId={assessmentId}
            refetchSubComponents={refetchSubComponents}
          />
          <MeasurementsForm
            activeSubComponent={activeSubComponent}
            languageOptions={languages?.data ?? []}
          />
        </>
      )}
    </div>
  );
}
