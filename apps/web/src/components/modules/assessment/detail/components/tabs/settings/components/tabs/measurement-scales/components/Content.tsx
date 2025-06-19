/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button, MultiSelectRHF } from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useCallback } from "react";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { Language } from "~/libs/models/language.model";
import type { AssessmentMeasurementScale } from "../../../../types";
import { Fields } from "./Fields";

export const measurementScaleFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    code: z.string().min(1, { message: "Code is required" }),
    translations: z.record(
      z.string(),
      z.object({
        name: z.string().min(1, { message: "Translation name is required" }),
        description: z
          .string()
          .min(1, { message: "Translation description is required" }),
        code: z.string().min(1, { message: "Translation code is required" }),
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
  .refine(
    (data) => {
      const translationKeys = Object.keys(data.translations);
      return data.selectedLanguages.every((lang) =>
        translationKeys.includes(lang.code)
      );
    },
    {
      message: "All selected languages must have corresponding translations",
      path: ["selectedLanguages"],
    }
  );

export type MeasurementScaleFormData = z.infer<
  typeof measurementScaleFormSchema
>;

interface Props {
  activeMeasurementScale: AssessmentMeasurementScale | null;
}

export function Content({ activeMeasurementScale }: Props) {
  const { data: languages, isLoading: languagesLoading } = useFindAll<
    QueryManyResponse<Language>
  >({
    path: "/languages",
  });

  const languageOptions: Language[] =
    (languages?.data as unknown as Language[]) ?? [];

  const getDefaultTranslations = useCallback(
    (measurementScale: AssessmentMeasurementScale | null) => {
      const translations: Record<
        string,
        { name: string; description: string; code: string }
      > = {};
      languageOptions.forEach((lang) => {
        translations[lang.code] = {
          name: lang.code === "en" ? (measurementScale?.name ?? "") : "",
          description:
            lang.code === "en" ? (measurementScale?.description ?? "") : "",
          code: lang.code === "en" ? (measurementScale?.code ?? "") : "",
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
  } = useForm<MeasurementScaleFormData>({
    defaultValues: {
      name: activeMeasurementScale?.name ?? "",
      description: activeMeasurementScale?.description ?? "",
      code: activeMeasurementScale?.code ?? activeMeasurementScale?.code,
      translations: getDefaultTranslations(activeMeasurementScale),
      selectedLanguages: [],
    },
    resolver: zodResolver(measurementScaleFormSchema),
    mode: "all",
  });

  const selectedLanguages = watch("selectedLanguages");

  const onLanguageSelectHandler = useCallback(
    (langs: Language[]) => {
      langs.forEach((lang) => {
        if (
          !selectedLanguages.some((selected) => selected.code === lang.code)
        ) {
          setValue(`translations.${lang.code}`, {
            name:
              lang.code === "en" ? (activeMeasurementScale?.name ?? "") : "",
            description:
              lang.code === "en"
                ? (activeMeasurementScale?.description ?? "")
                : "",
            code:
              lang.code === "en" ? (activeMeasurementScale?.code ?? "") : "",
          });
        }
      });
    },
    [activeMeasurementScale, selectedLanguages, setValue]
  );

  const onSubmitHandler = (values: MeasurementScaleFormData) => {
    const _filteredTranslations = Object.fromEntries(
      Object.entries(values.translations).filter(([key]) =>
        values.selectedLanguages.some((lang) => lang.code === key)
      )
    );
    // TODO: Implement save logic
  };

  const onCancelHandler = useCallback(() => {
    const defaultLang = languageOptions.find((lang) => lang.code === "en") ||
      languageOptions[0] || {
        id: "",
        name: "",
        code: "en",
        native: "",
      };
    reset({
      name: activeMeasurementScale?.name ?? "",
      description: activeMeasurementScale?.description ?? "",
      code: activeMeasurementScale?.code ?? activeMeasurementScale?.code,
      translations: getDefaultTranslations(activeMeasurementScale),
      selectedLanguages: languageOptions.length > 0 ? [defaultLang] : [],
    });
  }, [activeMeasurementScale, getDefaultTranslations, languageOptions, reset]);

  useEffect(() => {
    if (languageOptions.length > 0) {
      const defaultLang =
        languageOptions.find((lang) => lang.code === "en") ||
        languageOptions[0];
      reset({
        name: activeMeasurementScale?.name ?? "",
        description: activeMeasurementScale?.description ?? "",
        code: activeMeasurementScale?.code ?? activeMeasurementScale?.code,
        translations: getDefaultTranslations(activeMeasurementScale),
        selectedLanguages: defaultLang ? [defaultLang] : [],
      });
    }
  }, [activeMeasurementScale, languages, reset, getDefaultTranslations]);

  return (
    <div className="flex flex-col w-full md:w-3/4 h-fit bg-card border border-secondary-300 rounded-r-sm">
      <form
        id="measurementScale-form"
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col gap-6 w-full flex-1 overflow-y-auto pb-20 p-4"
      >
        {activeMeasurementScale && (
          <>
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
              labelKey="native"
              displayLabel="Languages"
              labelVariant="bold"
              onChange={() => onLanguageSelectHandler}
              size="lg"
              loading={languagesLoading}
              error={errors.selectedLanguages?.message}
            />
          </>
        )}
      </form>
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
        <Button size="lg" type="submit" form="measurementScale-form">
          Save
        </Button>
      </div>
    </div>
  );
}
