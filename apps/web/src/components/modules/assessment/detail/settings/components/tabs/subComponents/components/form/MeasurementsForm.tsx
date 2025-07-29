"use client";

import { Button, Skeleton, useToast } from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback, useEffect } from "react";
import type { AssessmentSubComponent } from "~/libs/models/assessment-sub-component.model";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import { TextAreaRHF, Accordion } from "@etm/web-ui-components";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type {
  AssessmentSubComponentMeasurementScale,
  AssessmentSubComponentMeasurementScaleIncludable,
} from "~/libs/models/assessment-sub-component.model";
import type { Assessment } from "~/libs/models/assessment.model";
import {
  DEFAULT_LANGUAGE_CODE,
  DEFAULT_LANGUAGE_NAME,
  DEFAULT_LANGUAGE_NATIVE,
} from "~/constants";

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
});

export type MeasurementFormData = z.infer<typeof measurementFormSchema>;

interface Props {
  activeSubComponent: AssessmentSubComponent | null;
  assessment?: Assessment;
}

export const MeasurementsForm = ({ activeSubComponent, assessment }: Props) => {
  const { toast } = useToast();

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

  const { mutate: updateMeasurements, ...updateMeasurementState } =
    usePutMutation<
      AssessmentSubComponentMeasurementScale[],
      AssessmentSubComponentMeasurementScale[]
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
    },
    resolver: zodResolver(measurementFormSchema),
    mode: "all",
  });

  const assessmentLanguages = (assessment?.languages ?? []).filter(
    (lang) => lang.code !== DEFAULT_LANGUAGE_CODE
  );
  const selectedLanguages = assessmentLanguages;

  const getDefaultMeasurementTranslations = useCallback(
    (existingTranslations: Record<string, { description: string }> = {}) => {
      const translations: Record<string, { description: string }> = {};
      selectedLanguages.forEach((lang) => {
        translations[lang.code] = {
          description:
            existingTranslations[lang.code]?.description ||
            (lang.code === DEFAULT_LANGUAGE_CODE
              ? existingTranslations.en?.description || ""
              : ""),
        };
      });
      return translations;
    },
    [selectedLanguages]
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
      });
    } else {
      reset({ measurements: [] });
    }
  }, [measurements, reset, assessment?.languages]);

  const onSubmitHandler = (data: MeasurementFormData) => {
    const measurementsData = data.measurements.map((measurement, index) => {
      const filteredTranslations = Object.fromEntries(
        Object.entries(measurement.translations).filter(([key]) =>
          (selectedLanguages || []).some((lang) => lang.code === key)
        )
      );
      return {
        description: measurement.description,
        translations: filteredTranslations,
        measurementScaleId: measurements?.data[index]?.measurementScaleId ?? "",
        subComponentId: activeSubComponent?.id ?? "",
      };
    });

    updateMeasurements(
      { data: measurementsData },
      {
        onSuccess: () => {
          toast({
            title: "Scale updated successfully",
            message: "Sub component measurement scale updated successfully",
            variant: "success",
          });
        },
      }
    );
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
        <div className="flex flex-col gap-6 w-full">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <div className="flex h-16 gap-4 w-full items-center justify-end">
            <Skeleton className="h-10 w-1/12 rounded-md" />
          </div>
        </div>
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
                  <div className="flex min-[400px]:items-center flex-col items-start w-full font-medium min-[400px]:flex-row min-[400px]:gap-12 ">
                    <span className="text-sm text-dark-light min-w-12">
                      {measurement.measurementScale?.name || "Measurement"}
                    </span>
                    <span className="text-xs justify-start">
                      {selectedLanguages.length > 0 &&
                      selectedLanguages[0]?.code
                        ? watch(`measurements.${index}.description`)
                        : ""}
                    </span>
                  </div>
                ),
                content: (
                  <div className="flex flex-col gap-4 bg-basic-200/30 border border-t-0 border-basic-300 rounded-b-lg px-6 py-4">
                    {/* Default Field for English */}
                    <div className="flex-1">
                      <TextAreaRHF
                        control={control}
                        name={`measurements.${index}.description`}
                        placeholder={`Write description in ${DEFAULT_LANGUAGE_NAME || DEFAULT_LANGUAGE_NATIVE || DEFAULT_LANGUAGE_CODE}`}
                        rows={4}
                        labelVariant="bold"
                        error={
                          errors.measurements?.[index]?.translations?.[
                            DEFAULT_LANGUAGE_CODE
                          ]?.description?.message
                        }
                      />
                    </div>
                    {/* Translation Fields for non-English languages */}
                    {selectedLanguages
                      .filter((lang) => lang.code !== DEFAULT_LANGUAGE_CODE)
                      .map((lang) => (
                        <div
                          key={lang.code}
                          className="flex flex-col items-start py-2 min-[400px]:flex-row min-[400px]:gap-12 min-[400px]:justify-between"
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
