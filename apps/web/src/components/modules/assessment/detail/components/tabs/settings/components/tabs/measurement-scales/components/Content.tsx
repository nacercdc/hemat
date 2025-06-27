/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Button,
  ColorPickerRHF,
  InputRHF,
  MultiSelectRHF,
  useToast,
} from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useCallback } from "react";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { Language } from "~/libs/models/language.model";

import { Fields } from "./Fields";
import type {
  AssessmentMeasurementScale,
  AssessmentMeasurementScaleUpdate,
} from "~/libs/models/assessment-measurement-scale.model";
import {
  DEFAULT_LANGUAGE_CODE,
  DEFAULT_LANGUAGE_NAME,
  DEFAULT_LANGUAGE_NATIVE,
} from "~/constants";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";

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
  activeMeasurementScale: AssessmentMeasurementScale | null;
  assessmentId: string;
  refetchMeasurementScales: () => void;
}

export function Content({
  activeMeasurementScale,
  assessmentId,
  refetchMeasurementScales,
}: Props) {
  const { toast } = useToast();
  const { data: languages, isLoading: languagesLoading } = useFindAll<
    QueryManyResponse<Language>
  >({
    path: "/languages",
  });
  const { mutate: updateMeasurementScale, ...updateMeasurementScaleState } =
    usePutMutation<
      AssessmentMeasurementScale,
      AssessmentMeasurementScaleUpdate
    >(
      `/assessments/${assessmentId}/measurement-scales/${activeMeasurementScale?.id}`
    );

  const languageOptions: Language[] =
    (languages?.data as unknown as Language[]) ?? [];

  const getDefaultTranslations = useCallback(
    (measurementScale: AssessmentMeasurementScale | null) => {
      if (measurementScale?.translations) {
        return measurementScale.translations;
      }
      const translations: Record<
        string,
        { name: string; description: string }
      > = {};
      languageOptions.forEach((lang) => {
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
    [languageOptions]
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AssessmentMeasurementScaleFormData>({
    defaultValues: {
      name: activeMeasurementScale?.name ?? "",
      description: activeMeasurementScale?.description ?? "",
      selectedLanguages: activeMeasurementScale?.translations
        ? Object.keys(activeMeasurementScale.translations).map((code) => {
            const lang = languageOptions.find((lang) => lang.code === code);
            return lang ? lang : { name: "", code, native: "" };
          })
        : languageOptions.length > 0
          ? [languageOptions[0]]
          : [],
      translations: activeMeasurementScale?.translations ?? {},
    },
    resolver: zodResolver(assessmentMeasurementScaleFormSchema),
    mode: "all",
  });

  const measurementScaleLanguages = activeMeasurementScale?.translations
    ? Object.keys(activeMeasurementScale.translations).map((code) => {
        const lang = languageOptions.find((lang) => lang.code === code);
        return lang ? lang : { name: "", code, native: "" };
      })
    : languageOptions.length > 0
      ? [languageOptions[0]]
      : [];

  const selectedLanguages = watch("selectedLanguages");
  const defaultLanguage = languageOptions.find(
    (lang) => lang.code === DEFAULT_LANGUAGE_CODE
  ) || {
    name: DEFAULT_LANGUAGE_NAME,
    code: DEFAULT_LANGUAGE_CODE,
    native: DEFAULT_LANGUAGE_NATIVE,
  };

  const onLanguageSelectHandler = useCallback(
    (langs: Language[]) => {
      langs.forEach((lang) => {
        if (
          !selectedLanguages.some((selected) => selected.code === lang.code)
        ) {
          const existingTranslation =
            activeMeasurementScale?.translations?.[lang.code];

          setValue(`translations.${lang.code}`, {
            name:
              existingTranslation?.name ??
              (lang.code === DEFAULT_LANGUAGE_CODE
                ? (watch("name") ?? "")
                : ""),
            description:
              existingTranslation?.description ??
              (lang.code === DEFAULT_LANGUAGE_CODE
                ? (watch("description") ?? "")
                : ""),
          });
        }
      });
    },
    [selectedLanguages, activeMeasurementScale?.translations, setValue, watch]
  );

  const onSubmitHandler = (values: AssessmentMeasurementScaleFormData) => {
    const filteredTranslations = Object.fromEntries(
      Object.entries(values.translations || {})
        .filter(([key]) =>
          values.selectedLanguages?.some((lang) => lang.code === key)
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
      selectedLanguages:
        measurementScaleLanguages.length > 0
          ? measurementScaleLanguages
          : [defaultLanguage],
    });
  }, [
    activeMeasurementScale,
    getDefaultTranslations,
    measurementScaleLanguages,
    reset,
  ]);

  useEffect(() => {
    if (languageOptions.length > 0) {
      reset({
        name: activeMeasurementScale?.name ?? "",
        description: activeMeasurementScale?.description ?? "",
        translations: getDefaultTranslations(activeMeasurementScale),
        rate: activeMeasurementScale?.rate ?? 1,
        color: activeMeasurementScale?.color ?? "#338E41",
        selectedLanguages:
          measurementScaleLanguages.length > 0
            ? measurementScaleLanguages
            : [defaultLanguage],
      });
    }
  }, [activeMeasurementScale, languages, reset, getDefaultTranslations]);

  if (!activeMeasurementScale) {
    return null;
  }

  return (
    <div className="flex flex-col w-full md:w-3/4 h-fit bg-card border border-secondary-300 rounded-r-sm">
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
            selectedLanguages={selectedLanguages}
            watch={watch}
            errors={errors}
          />
          <MultiSelectRHF
            control={control}
            name="selectedLanguages"
            placeholder="Select Languages"
            options={languageOptions}
            valueKey="code"
            labelKey="name"
            displayLabel="Languages"
            labelVariant="bold"
            onChange={() => onLanguageSelectHandler}
            size="lg"
            loading={languagesLoading}
          />
        </>

        <div className="flex justify-end gap-8 items-center w-full bg-basic-200/30 p-4">
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
