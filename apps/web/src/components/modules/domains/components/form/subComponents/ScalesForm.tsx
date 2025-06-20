"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button, TextAreaRHF, Accordion } from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
// import type { Language } from "~/libs/models/language.model";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type {
  Scale,
  ScaleFilterable,
  ScaleSortable,
} from "~/libs/models/scale.model";
import { Icon } from "@iconify/react/dist/iconify.js";
import type { ListItemType } from "../../..";
import { useEffect } from "react";

const languageSchema = z.object({
  name: z.string().min(1, { message: "Language name is required" }),
  code: z.string().min(1, { message: "Language code is required" }),
  native: z.string().min(1, { message: "Native language name is required" }),
});

const scaleSchema = z.object({
  measurementScaleId: z.string().uuid(),
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
  });

export type ScalesFormData = z.infer<typeof scalesSchema>;

interface Props {
  loading?: boolean;
  item?: ListItemType;
  onCloseModal?: () => void;
  // selectedLanguages: Language[];
  createdSubComponentId?: string | null;
  onSubmit: (data: ScalesFormData) => void;
}

export function ScalesForm({
  item,
  loading,
  onSubmit,
  onCloseModal,
  // selectedLanguages = [
  //   { code: "en", name: "English", native: "English", id: "1" },
  // ],
  createdSubComponentId,
}: Props) {
  const { data: scales, ..._scalesState } = useFindAll<
    Scale,
    unknown,
    ScaleFilterable,
    ScaleSortable
  >({
    path: "/measurement-scales",
  });

  console.log(
    [{ code: "en", name: "English", native: "English", id: "1" }],
    "Selected Languages defff"
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScalesFormData>({
    defaultValues: {
      scales: [],
      // selectedLanguages: [],
    },
    resolver: zodResolver(scalesSchema),
    mode: "all",
  });

  const selectedLanguages = [
    { code: "en", name: "English", native: "English", id: "1" },
  ];

  useEffect(() => {
    if (scales?.data && selectedLanguages.length > 0 && createdSubComponentId) {
      const initialScales = scales.data.map((scale) => ({
        measurementScaleId: scale.id, // This is the key fix
        description: scale.description || "",
        translations: selectedLanguages.reduce(
          (acc, lang) => {
            acc[lang.code] = { description: "" };
            return acc;
          },
          {} as Record<string, { description: string }>
        ),
      }));

      reset({
        scales: initialScales,
        selectedLanguages,
      });
    } else {
      reset({
        scales: [],
        selectedLanguages: [],
      });
    }
  }, [scales, createdSubComponentId, reset]);

  console.log(errors, "Errors");

  const onFormSubmit = (values: ScalesFormData) => {
    const filteredScales = values.scales.map((scale, index) => {
      const originalScale = scales?.data[index];

      console.log(originalScale);

      return {
        description: scale.description || "",
        measurementScaleId: originalScale?.id || scale.measurementScaleId,
        subComponentId: createdSubComponentId,
        translations: Object.fromEntries(
          Object.entries(scale.translations || {}).filter(([langCode]) =>
            values.selectedLanguages?.some((lang) => lang.code === langCode)
          )
        ),
      };
    });
    console.log(filteredScales, "Filtered Scales");

    onSubmit({
      scales: filteredScales,
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
          className="flex flex-col gap-4 max-h-[700px] overflow-x-hidden overflow-y-auto"
        >
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
              {[
                { code: "en", name: "English", native: "English", id: "1" },
              ]?.map((lang) => (
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
