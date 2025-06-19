"use client";

import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { Language } from "~/libs/models/language.model";
import type { AssessmentSubComponent } from "../../../../types";

import { SubComponentForm } from "./form/SubComponentsForm";
import { MeasurementsForm } from "./form/MeasurementsForm";

interface Props {
  activeSubComponent: AssessmentSubComponent | null;
}

export function Content({ activeSubComponent }: Props) {
  const { data: languages, isLoading: _languagesLoading } = useFindAll<
    QueryManyResponse<Language>
  >({
    path: "/languages",
  });

  const languageOptions: Language[] =
    (languages?.data as unknown as Language[]) ?? [];

  return (
    <div className="flex flex-col w-full md:w-3/4 h-fit bg-card border border-secondary-300 rounded-r-sm">
      {activeSubComponent && (
        <>
          <SubComponentForm
            activeSubComponent={activeSubComponent}
            languageOptions={languageOptions}
          />
          <MeasurementsForm
            activeSubComponent={activeSubComponent}
            languageOptions={languageOptions}
          />
        </>
      )}
    </div>
  );
}
