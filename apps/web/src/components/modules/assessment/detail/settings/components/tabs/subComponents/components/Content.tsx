"use client";

import { SubComponentForm } from "./form/SubComponentsForm";
import { MeasurementsForm } from "./form/MeasurementsForm";
import type { AssessmentSubComponent } from "~/libs/models/assessment-sub-component.model";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import type {
  Assessment,
  AssessmentsIncludeAble,
} from "~/libs/models/assessment.model";

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
  const { data: assessment } = useFindById<Assessment, AssessmentsIncludeAble>({
    path: `assessments/${assessmentId}`,
  });

  return (
    <div className="flex flex-col w-full md:w-3/4 h-fit bg-card border border-secondary-300 rounded-r-sm">
      {activeSubComponent && (
        <>
          <SubComponentForm
            assessment={assessment}
            activeSubComponent={activeSubComponent}
            assessmentId={assessmentId}
            refetchSubComponents={refetchSubComponents}
          />
          <MeasurementsForm
            activeSubComponent={activeSubComponent}
            languageOptions={[]}
          />
        </>
      )}
    </div>
  );
}
