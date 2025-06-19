"use client";

import { Button, MultiSelectRHF } from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback, useEffect, useMemo } from "react";
import type { Language } from "~/libs/models/language.model";
import type {
  AssessmentSubComponent,
  AssessmentSubComponentMeasurementScale,
} from "../../../../../types";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import { TextAreaRHF, Accordion } from "@etm/web-ui-components";

// Measurement Schema
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
      selectedLanguages: z
        .array(
          z.object({
            id: z.string(),
            name: z.string(),
            code: z.string(),
            native: z.string(),
          })
        )
        .min(1, { message: "At least one language is required" }),
    })
  ),
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
  const measurements: AssessmentSubComponentMeasurementScale[] = useMemo(
    () => [
      {
        description: "Initial",
        translations: {
          en: { description: "Height" },
        },
        measurementScaleId: "scale1",
        subComponentId: "subComponent1",
      },
      {
        description: "Developing",
        translations: {
          en: { description: "Weight" },
        },
        measurementScaleId: "scale2",
        subComponentId: "subComponent1",
      },
      {
        description: "Defined",
        translations: {
          en: { description: "Temperature" },
        },
        measurementScaleId: "scale3",
        subComponentId: "subComponent1",
      },
    ],
    []
  );

  const { mutate: updateMeasurement, ...updateMeasurementState } =
    usePutMutation<
      AssessmentSubComponentMeasurementScale,
      AssessmentSubComponentMeasurementScale
    >(
      `/assessmentsSub-components/measurements/${activeSubComponent?.id}/measurement-scales/${measurements[0]?.measurementScaleId}`
    );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MeasurementFormData>({
    defaultValues: {
      measurements: [],
    },
    resolver: zodResolver(measurementFormSchema),
    mode: "all",
  });

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

  // Initialize form with API data
  useEffect(() => {
    if (measurements.length > 0) {
      reset({
        measurements: measurements.map((measurement) => ({
          description: measurement.description,
          translations: getDefaultMeasurementTranslations(
            measurement.translations
          ),
          selectedLanguages:
            languageOptions.length > 0
              ? [
                  languageOptions.find((lang) => lang.code === "en") ||
                    languageOptions[0],
                ]
              : [{ id: "", name: "", code: "en", native: "" }],
        })),
      });
    } else {
      reset({ measurements: [] });
    }
  }, [measurements, reset, getDefaultMeasurementTranslations, languageOptions]);

  // Update translations when selectedLanguages change
  useEffect(() => {
    measurements.forEach((_, index) => {
      const currentLanguages =
        watch(`measurements.${index}.selectedLanguages`) || [];
      const currentTranslations =
        watch(`measurements.${index}.translations`) || {};
      currentLanguages.forEach((lang) => {
        if (!currentTranslations[lang.code]) {
          setValue(`measurements.${index}.translations.${lang.code}`, {
            description:
              lang.code === "en" ? measurements[index]?.description || "" : "",
          });
        }
      });
      // Remove translations for languages no longer selected
      Object.keys(currentTranslations).forEach((code) => {
        if (!currentLanguages.some((lang) => lang.code === code)) {
          setValue(`measurements.${index}.translations.${code}`, {
            description: currentTranslations[code]?.description || "",
          });
        }
      });
    });
  }, [measurements, setValue, watch]);

  const onSubmitHandler = (
    index: number,
    values: {
      description: string;
      translations: Record<string, { description: string }>;
      selectedLanguages: Language[];
    }
  ) => {
    const filteredTranslations = Object.fromEntries(
      Object.entries(values.translations).filter(([key]) =>
        values.selectedLanguages.some((lang) => lang.code === key)
      )
    );

    updateMeasurement({
      data: {
        description: values.description,
        translations: filteredTranslations,
        measurementScaleId: measurements[index]?.measurementScaleId ?? "",
        subComponentId: activeSubComponent?.id ?? "",
      },
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
      {measurements.map((measurement, index) => (
        <Accordion
          key={`measurement-${index}-translations`}
          items={[
            {
              value: `measurement-${index}-translations`,
              trigger: (
                <div className="flex items-center gap-12 w-full font-medium">
                  <span className="text-sm text-dark-light min-w-12">
                    {measurement.description || "Measurement"}
                  </span>
                  <span className="text-xs justify-start">
                    {watch(
                      `measurements.${index}.translations.${watch(`measurements.${index}.selectedLanguages`)?.[0]?.code || "en"}.description`
                    ) || ""}
                  </span>
                </div>
              ),
              content: (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4 bg-basic-200/30 border border-t-0 border-basic-300 rounded-b-lg px-6 py-4">
                    {watch(`measurements.${index}.selectedLanguages`)?.map(
                      (lang) => (
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
                      )
                    )}

                    <MultiSelectRHF
                      control={control}
                      name={`measurements.${index}.selectedLanguages`}
                      placeholder="Select Languages"
                      options={languageOptions}
                      valueKey="code"
                      labelKey="native"
                      displayLabel="Languages"
                      labelVariant="bold"
                      size="lg"
                      loading={false}
                      error={
                        errors.measurements?.[index]?.selectedLanguages?.message
                      }
                    />
                    <div className="flex justify-end">
                      <Button
                        size="lg"
                        type="button"
                        onClick={handleSubmit((data) => {
                          const measurement = data.measurements[index];
                          if (measurement) {
                            onSubmitHandler(index, measurement);
                          }
                        })}
                        loading={updateMeasurementState.isPending}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              ),
            },
          ]}
          type="multiple"
          collapsible={true}
        />
      ))}
    </form>
  );
};
