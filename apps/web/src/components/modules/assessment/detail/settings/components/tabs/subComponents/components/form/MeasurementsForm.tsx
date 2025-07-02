"use client";

import { Button, MultiSelectRHF } from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback, useEffect } from "react";
import type { Language } from "~/libs/models/language.model";
import type { AssessmentSubComponent } from "~/libs/models/assessment-sub-component.model";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import { TextAreaRHF, Accordion } from "@etm/web-ui-components";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type {
  AssessmentSubComponentMeasurementScale,
  AssessmentSubComponentMeasurementScaleIncludable,
} from "~/libs/models/assessment-sub-component.model";

export const measurementFormSchema = z.object({
  measurements: z.array(
    z.object({
      description: z.string().min(1, { message: "Description is required" }),
      translations: z.record(
        z.string(),
        z.object({
          description: z
            .string()
            .min(1, { message: "Translation description is required" }),
        })
      ),
    })
  ),
  selectedLanguages: z
    .array(
      z.object({
        name: z.string(),
        code: z.string(),
        native: z.string(),
      })
    )
    .min(1, { message: "At least one language is required" }),
});

export type MeasurementFormData = z.infer<typeof measurementFormSchema>;

interface Props {
  activeSubComponent: AssessmentSubComponent | null;
  languageOptions: Language[];
}

export const MeasurementsForm = ({
  activeSubComponent,
  languageOptions,
}: Props) => {
  const { data: measurements, isLoading: measurementsLoading } = useFindAll<
    AssessmentSubComponentMeasurementScale,
    AssessmentSubComponentMeasurementScaleIncludable
  >({
    path: activeSubComponent?.id
      ? `/assessment-sub-components/${activeSubComponent.id}/measurement-scales`
      : "",
    queries: {
      include: ["measurementScale"],
    },
    tqOptions: {
      enabled: !!activeSubComponent?.id,
    },
  });

  const { mutate: updateMeasurement, ...updateMeasurementState } =
    usePutMutation<
      AssessmentSubComponentMeasurementScale,
      AssessmentSubComponentMeasurementScale
    >(
      `/assessment-sub-components/${activeSubComponent?.id}/measurement-scales`
    );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MeasurementFormData>({
    defaultValues: {
      measurements: [],
      selectedLanguages: [],
    },
    resolver: zodResolver(measurementFormSchema),
    mode: "all",
  });

  const selectedLanguages = Array.isArray(watch("selectedLanguages"))
    ? watch("selectedLanguages")
    : [];

  const getDefaultMeasurementTranslations = useCallback(
    (existingTranslations: Record<string, { description: string }> = {}) => {
      const translations: Record<string, { description: string }> = {};
      languageOptions.forEach((lang) => {
        translations[lang.code] = {
          description:
            existingTranslations[lang.code]?.description ||
            (lang.code === "en"
              ? existingTranslations.en?.description || ""
              : ""),
        };
      });
      return translations;
    },
    [languageOptions]
  );

  useEffect(() => {
    if (measurements?.data && measurements?.data.length > 0) {
      reset({
        measurements: measurements?.data.map((measurement) => ({
          description: measurement.description,
          translations: getDefaultMeasurementTranslations(
            measurement.translations
          ),
        })),
        selectedLanguages:
          languageOptions.length > 0
            ? [
                languageOptions.find((lang) => lang.code === "en") ||
                  languageOptions[0],
              ]
            : [{ id: "", name: "", code: "en", native: "" }],
      });
    } else {
      reset({ measurements: [], selectedLanguages: [] });
    }
  }, [measurements, reset, getDefaultMeasurementTranslations, languageOptions]);

  const onSubmitHandler = (data: MeasurementFormData) => {
    data.measurements.forEach((measurement, index) => {
      const filteredTranslations = Object.fromEntries(
        Object.entries(measurement.translations).filter(([key]) =>
          (data.selectedLanguages || []).some((lang) => lang.code === key)
        )
      );
      updateMeasurement({
        data: {
          description: measurement.description,
          translations: filteredTranslations,
          measurementScaleId:
            measurements?.data[index]?.measurementScaleId ?? "",
          subComponentId: activeSubComponent?.id ?? "",
        },
      });
    });
  };

  return (
    <form
      id="measurements-form"
      className="flex flex-col gap-6 w-full flex-1 overflow-y-auto p-4"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-bold">Measurement Scales</h3>
      </div>
      {/* TODO: Replace with empty place holder when no measurements are found */}
      {measurementsLoading ? (
        <div>Loading measurement scales...</div>
      ) : measurements?.data.length === 0 ? (
        <div>No measurement scales found for this sub-component.</div>
      ) : (
        measurements?.data.map((measurement, index) => (
          <Accordion
            key={`measurement-${index}-translations`}
            items={[
              {
                value: `measurement-${index}-translations`,
                trigger: (
                  <div className="flex items-center gap-12 w-full font-medium">
                    <span className="text-sm text-dark-light min-w-12">
                      {measurement.measurementScale?.name || "Measurement"}
                    </span>
                    <span className="text-xs justify-start">
                      {selectedLanguages.length > 0 &&
                      selectedLanguages[0]?.code
                        ? watch(
                            `measurements.${index}.translations.${selectedLanguages[0].code}.description`
                          ) || ""
                        : ""}
                    </span>
                  </div>
                ),
                content: (
                  <div className="flex flex-col gap-4 bg-basic-200/30 border border-t-0 border-basic-300 rounded-b-lg px-6 py-4">
                    {selectedLanguages.map((lang) => (
                      <div
                        key={lang.code}
                        className="flex items-start justify-between py-2 gap-12"
                      >
                        <div className="text-sm font-medium min-w-12">{`${lang.code.toUpperCase()}:`}</div>
                        <div className="flex-1">
                          <TextAreaRHF
                            control={control}
                            name={`measurements.${index}.translations.${lang.code}.description`}
                            placeholder={`Write description in ${lang.name || lang.native || lang.code}`}
                            rows={4}
                            labelVariant="bold"
                            error={
                              errors.measurements?.[index]?.translations?.[
                                lang.code
                              ]?.description?.message
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
            ]}
            type="multiple"
            collapsible={true}
          />
        ))
      )}

      <MultiSelectRHF
        control={control}
        name="selectedLanguages"
        placeholder="Select Languages"
        options={languageOptions}
        valueKey="code"
        labelKey="name"
        displayLabel="Languages"
        labelVariant="bold"
        size="lg"
        loading={false}
        error={errors.selectedLanguages?.message}
      />
      <div className="flex justify-end mt-4">
        <Button
          size="lg"
          type="submit"
          loading={updateMeasurementState.isPending}
          onClick={handleSubmit(onSubmitHandler)}
        >
          Save
        </Button>
      </div>
    </form>
  );
};
