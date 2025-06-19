"use client";

import { Button, MultiSelectRHF } from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useCallback } from "react";
import type { Language } from "~/libs/models/language.model";
import type { AssessmentSubComponent } from "../../../../../types";
import { Fields } from "./SubComponentFields";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";

// SubComponent Schema
export const subComponentFormSchema = z
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

export type SubComponentFormData = z.infer<typeof subComponentFormSchema>;

interface SubComponentFormProps {
  activeSubComponent: AssessmentSubComponent | null;
  languageOptions: Language[];
}

export const SubComponentForm: React.FC<SubComponentFormProps> = ({
  activeSubComponent,
  languageOptions,
}) => {
  const { mutate: saveSubComponent } = useAddMutation<
    AssessmentSubComponent,
    SubComponentFormData
  >("/sub-components");

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<SubComponentFormData>({
    defaultValues: {
      name: activeSubComponent?.name ?? "",
      description: activeSubComponent?.description ?? "",
      code: activeSubComponent?.code ?? "",
      translations: {},
      selectedLanguages: [],
    },
    resolver: zodResolver(subComponentFormSchema),
    mode: "all",
  });

  const selectedLanguages = watch("selectedLanguages");

  const getDefaultTranslations = useCallback(
    (subComponent: AssessmentSubComponent | null) => {
      const translations: Record<
        string,
        { name: string; description: string; code: string }
      > = {};
      languageOptions.forEach((lang) => {
        translations[lang.code] = {
          name: lang.code === "en" ? (subComponent?.name ?? "") : "",
          description:
            lang.code === "en" ? (subComponent?.description ?? "") : "",
          code: lang.code === "en" ? (subComponent?.code ?? "") : "",
        };
      });
      return translations;
    },
    [languageOptions]
  );

  const onCancelHandler = useCallback(() => {
    const defaultLang = languageOptions.find((lang) => lang.code === "en") ||
      languageOptions[0] || {
        id: "",
        name: "",
        code: "en",
        native: "",
      };
    reset({
      name: activeSubComponent?.name ?? "",
      description: activeSubComponent?.description ?? "",
      code: activeSubComponent?.code ?? "",
      translations: getDefaultTranslations(activeSubComponent),
      selectedLanguages: languageOptions.length > 0 ? [defaultLang] : [],
    });
  }, [activeSubComponent, getDefaultTranslations, languageOptions, reset]);

  const onSubmitHandler = (values: SubComponentFormData) => {
    const filteredTranslations = Object.fromEntries(
      Object.entries(values.translations).filter(([key]) =>
        values.selectedLanguages.some((lang) => lang.code === key)
      )
    );
    saveSubComponent({
      data: { ...values, translations: filteredTranslations },
    });
  };

  useEffect(() => {
    if (languageOptions.length > 0) {
      const defaultLang =
        languageOptions.find((lang) => lang.code === "en") ||
        languageOptions[0];
      reset({
        name: activeSubComponent?.name ?? "",
        description: activeSubComponent?.description ?? "",
        code: activeSubComponent?.code ?? "",
        translations: getDefaultTranslations(activeSubComponent),
        selectedLanguages: defaultLang ? [defaultLang] : [],
      });
    }
  }, [activeSubComponent, languageOptions, reset, getDefaultTranslations]);

  return (
    <form
      id="subComponent-form"
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col gap-6 w-full flex-1 overflow-y-auto p-4"
    >
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
        size="lg"
        loading={false}
        error={errors.selectedLanguages?.message}
      />
      <div className="flex justify-end gap-4">
        <Button
          variant="outline"
          type="button"
          color="card"
          size="lg"
          onClick={onCancelHandler}
        >
          Cancel
        </Button>
        <Button size="lg" type="submit" form="subComponent-form">
          Save SubComponent
        </Button>
      </div>
    </form>
  );
};
