"use client";

import {
  Button,
  ColorPickerRHF,
  InputRHF,
  useToast,
} from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useCallback } from "react";

import { Fields } from "./Fields";
import type {
  AssessmentMeasurementScale,
  AssessmentMeasurementScaleUpdate,
} from "~/libs/models/assessment-measurement-scale.model";
import { DEFAULT_LANGUAGE_CODE } from "~/constants";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import type { Assessment } from "~/libs/models/assessment.model";

export const assessmentMeasurementScaleFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    rate: z
      .number({ message: "Rate is required" })
      .min(1, { message: "Rate should be greater than 0" })
      .max(10, { message: "Rate should be less than 10" }),
    color: z.string().min(1, { message: "Color is required" }),
    translations: z.record(
      z.string(),
      z
        .object({
          name: z.string().optional(),
          description: z.string().optional(),
        })
        .optional()
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
  })
  .superRefine((data, ctx) => {
    data.selectedLanguages.forEach((lang) => {
      const translation = data.translations[lang.code];

      if (!translation?.name || translation.name.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Name is required for this language",
          path: ["translations", lang.code, "name"],
        });
      }

      if (!translation?.description || translation.description.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Description is required for this language",
          path: ["translations", lang.code, "description"],
        });
      }
    });
  });

export type AssessmentMeasurementScaleFormData = z.infer<
  typeof assessmentMeasurementScaleFormSchema
>;

interface Props {
  assessmentId: string;
  assessment?: Assessment;
  activeMeasurementScale: AssessmentMeasurementScale | null;
  refetchMeasurementScales: () => void;
}

export function Content({
  assessment,
  assessmentId,
  activeMeasurementScale,
  refetchMeasurementScales,
}: Props) {
  const { toast } = useToast();
  const { mutate: updateMeasurementScale, ...updateMeasurementScaleState } =
    usePutMutation<
      AssessmentMeasurementScale,
      AssessmentMeasurementScaleUpdate
    >(
      `/assessments/${assessmentId}/measurement-scales/${activeMeasurementScale?.id}`
    );

  const nonDefaultLanguages = (assessment?.languages ?? []).filter(
    (lang) => lang.code !== DEFAULT_LANGUAGE_CODE
  );

  const getDefaultTranslations = useCallback(
    (measurementScale: AssessmentMeasurementScale | null) => {
      if (measurementScale?.translations) {
        return measurementScale.translations;
      }
      const translations: Record<
        string,
        { name: string; description: string }
      > = {};
      nonDefaultLanguages.forEach((lang) => {
        translations[lang.code] = {
          name:
            lang.code === DEFAULT_LANGUAGE_CODE
              ? (measurementScale?.name ?? "")
              : "",
          description:
            lang.code === DEFAULT_LANGUAGE_CODE
              ? (measurementScale?.description ?? "")
              : "",
        };
      });
      return translations;
    },
    [nonDefaultLanguages]
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AssessmentMeasurementScaleFormData>({
    defaultValues: {
      name: activeMeasurementScale?.name ?? "",
      description: activeMeasurementScale?.description ?? "",
      selectedLanguages: nonDefaultLanguages,
      translations: activeMeasurementScale?.translations ?? {},
    },
    resolver: zodResolver(assessmentMeasurementScaleFormSchema),
    mode: "all",
  });

  const onSubmitHandler = (values: AssessmentMeasurementScaleFormData) => {
    const filteredTranslations = Object.fromEntries(
      Object.entries(values.translations || {})
        .filter(([key]) =>
          nonDefaultLanguages?.some((lang) => lang.code === key)
        )
        .map(([key, value]) => [
          key,
          {
            name: value?.name || "",
            description: value?.description || "",
          },
        ])
    );

    updateMeasurementScale(
      {
        data: {
          name: values.name,
          rate: values.rate,
          color: values.color,
          id: activeMeasurementScale?.id ?? "",
          description: values.description,
          translations: filteredTranslations,
        },
        isProtected: true,
      },
      {
        onSuccess: () => {
          refetchMeasurementScales();
          toast({
            title: "Measurement Scale updated successfully",
            message: "The measurement scale has been updated successfully.",
            variant: "success",
          });
        },
      }
    );
  };

  const onCancelHandler = useCallback(() => {
    reset({
      name: activeMeasurementScale?.name ?? "",
      description: activeMeasurementScale?.description ?? "",
      translations: getDefaultTranslations(activeMeasurementScale),
      selectedLanguages: nonDefaultLanguages,
    });
  }, [
    activeMeasurementScale,
    getDefaultTranslations,
    nonDefaultLanguages,
    reset,
  ]);

  useEffect(() => {
    reset({
      name: activeMeasurementScale?.name ?? "",
      description: activeMeasurementScale?.description ?? "",
      translations: getDefaultTranslations(activeMeasurementScale),
      rate: activeMeasurementScale?.rate ?? 1,
      color: activeMeasurementScale?.color ?? "#338E41",
      selectedLanguages: nonDefaultLanguages,
    });
  }, [activeMeasurementScale, assessment?.languages, reset]);

  if (!activeMeasurementScale) {
    return null;
  }

  return (
    <div className="flex flex-col w-full lg:w-3/4 h-fit bg-card border border-secondary-300 rounded-r-sm">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col gap-6 w-full flex-1 overflow-y-auto pb-20 p-4"
      >
        <>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <InputRHF<AssessmentMeasurementScaleFormData>
              control={control}
              type="number"
              max={10}
              min={1}
              name="rate"
              label="Rate"
              placeholder="Write Rate"
              size="lg"
              labelVariant="bold"
              maxLength={2}
            />
            <ColorPickerRHF<AssessmentMeasurementScaleFormData>
              control={control}
              name="color"
              defaultValue="#338E41"
              size="lg"
              label="Color"
              labelVariant="bold"
              inModal={true}
            />
          </div>
          <Fields
            control={control}
            selectedLanguages={nonDefaultLanguages}
            watch={watch}
            errors={errors}
          />
        </>

        <div className="flex flex-col-reverse min-[400px]:flex-row justify-end gap-2 min-[400px]:gap-8 min-[400px]:items-center  items-end w-full bg-basic-200/30 p-4">
          <Button
            variant="outline"
            type="button"
            color="card"
            size="lg"
            onClick={onCancelHandler}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            type="submit"
            loading={updateMeasurementScaleState.isPending}
          >
            {updateMeasurementScaleState.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
