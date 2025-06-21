"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Button,
  TextAreaRHF,
  Accordion,
  MultiSelectRHF,
} from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Language } from "~/libs/models/language.model";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type {
  Scale,
  ScaleFilterable,
  ScaleSortable,
} from "~/libs/models/scale.model";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useMemo } from "react";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { SubComponent } from "~/libs/models/subComponent.model";

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
  item?: SubComponent;
  onCloseModal?: () => void;
  subComponentId?: string | null;
  onSubmit: (data: ScalesFormData) => void;
}

export function ScalesForm({
  item,
  loading,
  onSubmit,
  onCloseModal,
  subComponentId,
}: Props) {
  const { data: scales, ..._scalesState } = useFindAll<
    Scale,
    unknown,
    ScaleFilterable,
    ScaleSortable
  >({
    path: "/measurement-scales",
    tqOptions: {
      enabled: !item,
    },
  });

  const { data: languages, ...languagesState } = useFindAll<
    QueryManyResponse<Language>
  >({
    path: "/languages",
  });

  const languageOptions = useMemo(
    () => (languages?.data as unknown as Language[]) ?? [],
    [languages?.data]
  );

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ScalesFormData>({
    defaultValues: {
      scales: [],
      selectedLanguages: [],
    },
    resolver: zodResolver(scalesSchema),
    mode: "all",
  });

  const selectedLanguages = watch("selectedLanguages");
  const getDefaultSelectedLanguages = () => {
    if (item?.measurementScales && item.measurementScales.length > 0) {
      const firstScale = item.measurementScales[0];
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

  useEffect(() => {
    if (scales?.data && subComponentId) {
      const initialScales =
        item?.measurementScales && item.measurementScales.length > 0
          ? item.measurementScales.map((scale) => ({
              measurementScaleId: scale.measurementScaleId,
              subComponentId: scale.subComponentId,
              description: scale.description,
              translations: defaultSelectedLanguages.reduce(
                (acc, lang) => {
                  acc[lang.code] = {
                    description:
                      scale.translations[lang.code]?.description || "",
                  };
                  return acc;
                },
                {} as Record<string, { description: string }>
              ),
            }))
          : scales.data.map((scale) => ({
              measurementScaleId: scale.id,
              subComponentId: subComponentId,
              description: scale.description,
              translations: defaultSelectedLanguages.reduce(
                (acc, lang) => {
                  acc[lang.code] = { description: "" };
                  return acc;
                },
                {} as Record<string, { description: string }>
              ),
            }));
      reset({
        scales: initialScales,
        selectedLanguages:
          defaultSelectedLanguages.length > 0
            ? defaultSelectedLanguages
            : selectedLanguages,
      });
    } else {
      reset({
        scales: [],
        selectedLanguages:
          defaultSelectedLanguages.length > 0 ? defaultSelectedLanguages : [],
      });
    }
  }, [scales, subComponentId, item]);

  const onFormSubmit = (values: ScalesFormData) => {
    const filteredScales = values.scales.map((scale) => {
      return {
        id: item?.id,
        description: scale.description || "",
        measurementScaleId: scale.measurementScaleId,
        subComponentId: subComponentId || "",
        translations:
          (values.selectedLanguages || []).length > 0
            ? Object.fromEntries(
                Object.entries(scale.translations || {}).filter(([langCode]) =>
                  (values.selectedLanguages || []).some(
                    (lang) => lang.code === langCode
                  )
                )
              )
            : {},
      };
    });

    onSubmit({
      scales: filteredScales,
      selectedLanguages: values.selectedLanguages || [],
    });
  };

  const accordionItems = [
    {
      value: "scales",
      trigger: (
        <div className="flex items-center">
          <Icon icon="cheveron-down" className="w-4 h-4" />
          <span className="text-sm font-bold">Measurement scales</span>
        </div>
      ),
      content: (
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col gap-4 max-h-[700px] overflow-x-hidden overflow-y-auto p-4"
        >
          <MultiSelectRHF<Language, ScalesFormData>
            control={control}
            name="selectedLanguages"
            placeholder="Select Languages"
            options={languageOptions}
            valueKey="code"
            labelKey="native"
            displayLabel="Languages"
            labelVariant="bold"
            size="lg"
            loading={languagesState.isLoading}
            error={errors.selectedLanguages?.message}
          />

          {scales?.data.map((scale, index) => (
            <div key={scale.id} className="flex flex-col items-start gap-3">
              <div className="text-xs font-medium">{`${scale.name}`}</div>
              <TextAreaRHF<ScalesFormData>
                control={control}
                name={`scales.${index}.description`}
                placeholder={`Write ${scale.name} Description`}
                labelVariant="bold"
                rows={4}
                error={errors.scales?.[index]?.description?.message}
              />
              {(selectedLanguages || []).length > 0 &&
                (selectedLanguages || []).map((lang) => (
                  <div key={lang.code} className="flex gap-2 w-full">
                    <div className="text-sm font-medium">{`${lang.code.toUpperCase()}:`}</div>
                    <TextAreaRHF<ScalesFormData>
                      control={control}
                      name={`scales.${index}.translations.${lang.code}.description`}
                      placeholder={`Write ${lang.name} Description for ${scale.name}`}
                      labelVariant="bold"
                      rows={4}
                      error={
                        errors.scales?.[index]?.translations?.[lang.code]
                          ?.description?.message
                      }
                    />
                  </div>
                ))}
            </div>
          ))}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onCloseModal}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" loading={loading}>
              {item ? "Edit scale" : "Add scale"}
            </Button>
          </div>
        </form>
      ),
    },
  ];

  return (
    <div className="flex p-7">
      <Accordion items={accordionItems} />
    </div>
  );
}
