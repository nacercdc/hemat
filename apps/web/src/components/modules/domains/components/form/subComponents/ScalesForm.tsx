/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button, TextAreaRHF, MultiSelectRHF } from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Language } from "~/libs/models/language.model";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { Scale } from "~/libs/models/scale.model";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect } from "react";
import type { SubComponent } from "~/libs/models/subComponent.model";
import { DEFAULT_LANGUAGE_CODE } from "~/constants";
import { useGetLanguages } from "~/providers/languages/useGetLanguages";
import React from "react";

const languageSchema = z.object({
  name: z.string().min(1, { message: "Language name is required" }),
  code: z.string().min(1, { message: "Language code is required" }),
  native: z.string().min(1, { message: "Native language name is required" }),
});

const scaleSchema = z.object({
  measurementScaleId: z.string().uuid(),
  subComponentId: z.string().uuid(),
  description: z.string().min(1, { message: "Scale description is required" }),
  translations: z.record(
    z.string(),
    z.object({
      description: z
        .string()
        .min(1, { message: "Scale translation description is required" }),
    })
  ),
});

const scalesSchema = z
  .object({
    scales: z.array(scaleSchema),
    selectedLanguages: z.array(languageSchema).optional(),
  })
  .superRefine((data, ctx) => {
    const { scales, selectedLanguages = [] } = data;

    for (let i = 0; i < scales.length; i++) {
      const scale = scales[i];
      if (!scale?.description?.trim()) {
        ctx.addIssue({
          path: ["scales", i, "description"],
          code: z.ZodIssueCode.custom,
          message: `Description for scale ${scale?.measurementScaleId} is required`,
        });
      }
      if (selectedLanguages.length > 0) {
        for (const lang of selectedLanguages) {
          const translation = scale?.translations[lang.code];

          if (!translation) {
            ctx.addIssue({
              path: ["scales", i, "translations", lang.code],
              code: z.ZodIssueCode.custom,
              message: `Translation for ${lang.name.toUpperCase()} for scale ${scale?.measurementScaleId} is missing`,
            });
            continue;
          }

          if (!translation.description?.trim()) {
            ctx.addIssue({
              path: ["scales", i, "translations", lang.code, "description"],
              code: z.ZodIssueCode.custom,
              message: `Translation description for ${lang.name.toUpperCase()} for scale ${scale.measurementScaleId} is required`,
            });
          }
        }
      }
    }
  });

export type ScalesFormData = z.infer<typeof scalesSchema>;

interface Props {
  loading?: boolean;
  subComponent?: SubComponent;
  createdSubComponentId?: string | null;
  onSubmit: (data: ScalesFormData) => void;
  initialSelectedLanguages?: Omit<Language, "id">[];
  onBack?: () => void;
}

export function ScalesForm({
  subComponent,
  loading,
  onSubmit,
  createdSubComponentId,
  initialSelectedLanguages,
  onBack,
}: Props) {
  const { data: scales, ...scalesState } = useFindAll<Scale>({
    path: "/measurement-scales",
    tqOptions: {
      enabled: true,
    },
  });

  const { data: languages, ...languagesState } = useGetLanguages();

  const languageOptions: Language[] = languages?.data
    ? languages.data.filter(
        (lang) =>
          lang.code !== DEFAULT_LANGUAGE_CODE &&
          languageSchema.safeParse(lang).success
      )
    : [];

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ScalesFormData>({
    defaultValues: {
      scales: [],
      selectedLanguages: initialSelectedLanguages
        ? languageOptions.filter((lang) =>
            initialSelectedLanguages.some((sel) => sel.code === lang.code)
          )
        : [],
    },
    resolver: zodResolver(scalesSchema),
    mode: "all",
  });

  const selectedLanguages: Omit<Language, "id">[] =
    watch("selectedLanguages") || [];
  const scalesField = watch("scales");

  const onRemoveLanguageHandler = (code: string) => {
    setValue(
      "selectedLanguages",
      selectedLanguages.filter((l) => l.code !== code)
    );
  };

  const getDefaultSelectedLanguages = () => {
    if (initialSelectedLanguages && initialSelectedLanguages.length > 0) {
      return initialSelectedLanguages;
    }
    if (
      subComponent?.measurementScales &&
      subComponent.measurementScales.length > 0
    ) {
      const firstScale = subComponent.measurementScales[0];
      if (firstScale?.translations) {
        const translationLangCodes = Object.keys(firstScale.translations);
        return languageOptions.filter((lang) =>
          translationLangCodes.includes(lang.code)
        );
      }
    }
    return [];
  };

  const defaultSelectedLanguages = getDefaultSelectedLanguages();

  const onFormSubmit = (values: ScalesFormData) => {
    const filteredScales = values.scales.map((scale) => {
      const translations = {
        ...scale.translations,
        en: { description: scale.description },
      };
      const filteredTranslations = Object.fromEntries(
        Object.entries(translations).filter(
          ([langCode]) =>
            langCode === "en" ||
            (values.selectedLanguages || []).some(
              (lang) => lang.code === langCode
            )
        )
      );
      return {
        ...scale,
        translations: filteredTranslations,
      };
    });
    onSubmit({
      scales: filteredScales,
      selectedLanguages: values.selectedLanguages || [],
    });
  };

  useEffect(() => {
    if (scalesField) {
      scalesField.forEach((scale, idx) => {
        if (scale.description !== scale.translations?.en?.description) {
          setValue(
            `scales.${idx}.translations.en.description`,
            scale.description,
            { shouldValidate: false }
          );
        }
      });
    }
  }, [scalesField?.map((s) => s.description).join("|")]);

  useEffect(() => {
    if (scales?.data) {
      const mergedScales = scales.data.map((scale) => {
        const existingScale = subComponent?.measurementScales.find(
          (s) => s.measurementScaleId === scale.id
        );

        if (existingScale) {
          return {
            measurementScaleId: existingScale.measurementScaleId,
            subComponentId: existingScale.subComponentId,
            description: existingScale.description,
            translations: defaultSelectedLanguages.reduce(
              (acc, lang) => {
                acc[lang.code] = {
                  description:
                    existingScale.translations[lang.code]?.description || "",
                };
                return acc;
              },
              {} as Record<string, { description: string }>
            ),
          };
        } else {
          return {
            measurementScaleId: scale.id,
            subComponentId: subComponent?.id || createdSubComponentId || "",
            description: scale.description,
            translations: defaultSelectedLanguages.reduce(
              (acc, lang) => {
                acc[lang.code] = { description: "" };
                return acc;
              },
              {} as Record<string, { description: string }>
            ),
          };
        }
      });

      reset({
        scales: mergedScales,
        selectedLanguages: defaultSelectedLanguages,
      });
    } else {
      reset({
        scales: [],
        selectedLanguages: defaultSelectedLanguages,
      });
    }
  }, [scales, createdSubComponentId, subComponent, languages]);

  return (
    <div className="flex flex-col gap-4 p-2">
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="flex flex-col gap-4 max-h-[700px] overflow-x-hidden overflow-y-auto p-4"
      >
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
          loading={languagesState.isLoading}
          error={errors.selectedLanguages?.message}
        />
        {scalesState.isSuccess && (!scalesField || scalesField.length === 0) ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-basic-100 flex items-center justify-center">
                <Icon
                  icon="mdi:file-document-outline"
                  className="w-8 h-8 text-basic-400"
                />
              </div>
              <h3 className="text-lg font-medium text-basic mb-2">
                No scales found for this sub component
              </h3>
            </div>
          </div>
        ) : (
          [
            { code: "en", name: "English" },
            ...selectedLanguages.filter((lang) => lang.code !== "en"),
          ].map((lang) => (
            <div
              key={lang.code}
              className="rounded-md bg-layout-bg/30 p-4 mb-4 relative"
            >
              <span className=" flex items-center mb-3 absolute -top-2 px-2 py-1 bg-destructive-700/10 text-destructive-700 rounded text-xs font-medium mr-2">
                {lang.name}
              </span>
              {lang.code !== "en" && (
                <button
                  type="button"
                  className="ml-auto text-xl px-2 py-1 bg-muted/50 rounded-tr-md rounded-bl-md absolute top-0 right-0"
                  onClick={() => onRemoveLanguageHandler(lang.code)}
                >
                  <Icon icon="mdi:close" />
                </button>
              )}

              {scalesField?.map((scale, index) => {
                const fetchedScale = scales?.data?.find(
                  (s) => s.id === scale.measurementScaleId
                );
                const scaleName = fetchedScale?.name || scale.description;

                return (
                  <div key={scale.measurementScaleId} className="mb-4 mt-2">
                    <div className="font-semibold mb-1 text-[15px]">
                      {scaleName}
                    </div>
                    <TextAreaRHF<ScalesFormData>
                      control={control}
                      name={
                        lang.code === "en"
                          ? `scales.${index}.description`
                          : `scales.${index}.translations.${lang.code}.description`
                      }
                      placeholder={`Write ${lang.name} Description for ${scaleName}`}
                      labelVariant="bold"
                      rows={4}
                      error={
                        lang.code === "en"
                          ? errors.scales?.[index]?.description?.message
                          : errors.scales?.[index]?.translations?.[lang.code]
                              ?.description?.message
                      }
                    />
                  </div>
                );
              })}
            </div>
          ))
        )}
        <div className="flex items-center justify-between w-full gap-4">
          {onBack && (
            <Button type="button" variant="outline" size="lg" onClick={onBack}>
              Back
            </Button>
          )}
          <div className="flex items-center gap-4 w-full justify-end">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => reset()}
            >
              Reset
            </Button>
            <Button type="submit" size="lg" loading={loading}>
              {subComponent
                ? "Update scales description"
                : "Add scales description"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
