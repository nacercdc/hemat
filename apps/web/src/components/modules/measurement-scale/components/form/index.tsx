/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Button,
  ColorPickerRHF,
  InputRHF,
  TextAreaRHF,
  Select,
} from "@etm/web-ui-components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ScaleCreate } from "~/libs/models/scale.model";
import { useMemo, useState } from "react";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { Language } from "~/libs/models/language.model";

interface Props {
  onSubmitScaleFormHandler: (values: ScaleCreate) => void;
  onCancelScaleFormHandler?: () => void;
  isLoading?: boolean;
  scale?: ScaleCreate;
}

export function ScaleForm({
  onSubmitScaleFormHandler,
  onCancelScaleFormHandler,
  isLoading = false,
  scale,
}: Props) {
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    scale?.translations ? Object.keys(scale.translations) : ["en"]
  );

  const { data: languages, ...languagesState } = useFindAll<
    QueryManyResponse<Language>
  >({
    path: "/languages",
  });

  const languageOptions = useMemo(
    () => (languages?.data as unknown as Language[]) ?? [],
    [languages?.data]
  );

  const ScaleFormSchema = z
    .object({
      name: z.string().min(1, { message: "Name is required" }),
      rate: z.number().min(1, { message: "Rate is required" }),
      color: z.string().min(1, { message: "Color is required" }),
      description: z.string().min(1, { message: "Description is required" }),
      translations: z
        .record(
          z.object({
            name: z.string().optional(),
            description: z.string().optional(),
          })
        )
        .optional(),
      selectedLanguages: z.array(z.string()),
    })
    .superRefine((data, ctx) => {
      const { translations = {}, selectedLanguages } = data;

      for (const lang of selectedLanguages) {
        const translation = translations[lang];

        if (!translation?.name?.trim()) {
          ctx.addIssue({
            path: ["translations", lang, "name"],
            code: z.ZodIssueCode.custom,
            message: `Translation name for ${lang.toUpperCase()} is required`,
          });
        }

        if (!translation?.description?.trim()) {
          ctx.addIssue({
            path: ["translations", lang, "description"],
            code: z.ZodIssueCode.custom,
            message: `Translation description for ${lang.toUpperCase()} is required`,
          });
        }
      }
    });

  type ScaleFormData = z.infer<typeof ScaleFormSchema>;

  const defaultTranslations = useMemo(() => {
    return Object.fromEntries(
      languageOptions.map((lang) => [
        lang.code,
        {
          name: scale?.translations?.[lang.code]?.name ?? "",
          description: scale?.translations?.[lang.code]?.description ?? "",
        },
      ])
    );
  }, [languageOptions, scale?.translations]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ScaleFormData>({
    defaultValues: {
      name: scale?.name ?? "",
      rate: scale?.rate ?? 0,
      color: scale?.color ?? "",
      description: scale?.description ?? "",
      translations: defaultTranslations,
      selectedLanguages: selectedLanguages,
    },
    resolver: zodResolver(ScaleFormSchema),
    mode: "onChange",
  });

  const onLanguageSelect = (lang?: { name: string }) => {
    if (!lang) return;
    const langCode = languageOptions.find((l) => l.name === lang.name)?.code;
    if (langCode && !selectedLanguages.includes(langCode)) {
      setSelectedLanguages([...selectedLanguages, langCode]);
      if (!defaultTranslations[langCode]) {
        setValue(`translations.${langCode}`, { name: "", description: "" });
      }
      setValue("selectedLanguages", [...selectedLanguages, langCode], {
        shouldValidate: true,
      });
    }
  };

  const onCancelHandler = () => {
    onCancelScaleFormHandler?.();
    reset();
    setSelectedLanguages(["en"]);
  };

  const onSubmitHandler = (values: ScaleFormData) => {
    const filteredTranslations = Object.fromEntries(
      Object.entries(values.translations || {})
        .filter(([key]) => values.selectedLanguages.includes(key))
        .map(([key, value]) => [
          key,
          {
            name: value.name || "",
            description: value.description || "",
          },
        ])
    );
    onSubmitScaleFormHandler({
      ...values,
      translations: filteredTranslations,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col w-full h-[557px] bg-card rounded-xl relative"
    >
      <div className="sticky top-0 z-10 bg-card px-8 pt-8 mb-6">
        <div className="text-xl font-bold">{`${
          scale ? "Edit" : "Add"
        } Measurement Scale`}</div>
      </div>
      <div className="flex-1 overflow-y-auto px-8 pb-20">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <InputRHF<ScaleFormData>
              control={control}
              type="number"
              max={10}
              name="rate"
              label="Rate"
              placeholder="Write Rate"
              size="xl"
              labelVariant="bold"
              error={errors.rate?.message}
            />
            <ColorPickerRHF<ScaleFormData>
              control={control}
              name="color"
              defaultValue="#435ff3"
              size="xl"
              label="Color"
              labelVariant="bold"
              error={errors.color?.message}
            />
          </div>
          <Select<{ name: string }>
            placeholder="Select Language"
            options={languageOptions
              .filter((lang) => !selectedLanguages.includes(lang.code))
              .map((lang) => ({ name: lang.name }))}
            valueKey="name"
            labelKey="name"
            onSelect={onLanguageSelect}
            loading={languagesState.isLoading}
            size="lg"
          />
          <InputRHF<ScaleFormData>
            control={control}
            name="name"
            label="Name"
            placeholder="Write Default Name"
            size="xl"
            labelVariant="bold"
            error={errors.name?.message}
          />
          {selectedLanguages.map((langCode) => {
            const lang = languageOptions.find((l) => l.code === langCode);
            return (
              <div key={langCode} className="flex gap-2">
                <div className="text-sm font-medium">{`${lang?.code.toUpperCase()}:`}</div>
                <InputRHF<ScaleFormData>
                  control={control}
                  name={`translations.${langCode}.name`}
                  placeholder={`Write ${lang?.name} Name`}
                  size="xl"
                  labelVariant="bold"
                  error={
                    errors.translations?.[langCode]
                      ? (errors.translations[langCode] as any)?.name?.message
                      : undefined
                  }
                />
              </div>
            );
          })}
          <TextAreaRHF<ScaleFormData>
            control={control}
            name="description"
            label="Description"
            placeholder="Write Default Description..."
            labelVariant="bold"
            rows={4}
            error={errors.description?.message}
          />
          {selectedLanguages.map((langCode) => {
            const lang = languageOptions.find((l) => l.code === langCode);
            return (
              <div key={langCode} className="flex gap-2">
                <div className="text-sm font-medium">{`${lang?.code.toUpperCase()}:`}</div>
                <TextAreaRHF<ScaleFormData>
                  control={control}
                  name={`translations.${langCode}.description`}
                  placeholder={`Write ${lang?.name} Description...`}
                  labelVariant="bold"
                  rows={4}
                  error={
                    errors.translations?.[langCode]
                      ? (errors.translations[langCode] as any)?.description
                          ?.message
                      : undefined
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className="sticky bottom-0 z-10 w-full bg-layout-bg p-4 rounded-b-lg px-8">
        <div className="flex justify-between items-center">
          <Button variant="outline" type="button" onClick={onCancelHandler}>
            Cancel
          </Button>
          <Button size="lg" type="submit" loading={isLoading}>
            {scale ? "Edit" : "Save"}
          </Button>
        </div>
      </div>
    </form>
  );
}
