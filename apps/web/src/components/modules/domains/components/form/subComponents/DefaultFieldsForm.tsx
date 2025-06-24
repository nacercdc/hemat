"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  InputRHF,
  MultiSelectRHF,
  TextAreaRHF,
} from "@etm/web-ui-components";
import type { Language } from "~/libs/models/language.model";
import { useGetLanguages } from "~/providers/languages/useGetLanguages";
import type { SubComponent } from "~/libs/models/subComponent.model";
import { DEFAULT_LANGUAGE_CODE } from "~/constants";

const languageSchema = z.object({
  name: z.string().min(1, { message: "Language name is required" }),
  code: z.string().min(1, { message: "Language code is required" }),
  native: z.string().min(1, { message: "Native language name is required" }),
});

const translationSchema = z.object({
  name: z.string().min(1, { message: "Translation name is required" }),
  description: z
    .string()
    .min(1, { message: "Translation description is required" }),
  code: z.string().min(1, { message: "Translation code is required" }),
});

const defaultFieldsSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    code: z
      .string()
      .min(1, { message: "Code is required" })
      .max(10, { message: "Code must be less than 10 characters" }),
    translations: z.record(z.string(), translationSchema).optional(),
    selectedLanguages: z.array(languageSchema).optional(),
  })
  .superRefine((data, ctx) => {
    const { translations = {}, selectedLanguages = [] } = data;

    for (const lang of selectedLanguages) {
      const translation = translations[lang.code];

      if (!translation) {
        ctx.addIssue({
          path: ["translations", lang.code],
          code: z.ZodIssueCode.custom,
          message: `Translation for ${lang.name.toUpperCase()} is missing`,
        });
        continue;
      }

      if (!translation.name?.trim()) {
        ctx.addIssue({
          path: ["translations", lang.code, "name"],
          code: z.ZodIssueCode.custom,
          message: `Translation name for ${lang.name.toUpperCase()} is required`,
        });
      }

      if (!translation.description?.trim()) {
        ctx.addIssue({
          path: ["translations", lang.code, "description"],
          code: z.ZodIssueCode.custom,
          message: `Translation description for ${lang.name.toUpperCase()} is required`,
        });
      }

      if (!translation.code?.trim()) {
        ctx.addIssue({
          path: ["translations", lang.code, "code"],
          code: z.ZodIssueCode.custom,
          message: `Translation code for ${lang.name.toUpperCase()} is required`,
        });
      }
    }
  });

export type DefaultFieldsFormData = z.infer<typeof defaultFieldsSchema>;

interface Props {
  loading?: boolean;
  item?: SubComponent;
  onCloseModal?: () => void;
  onSubmit: (data: DefaultFieldsFormData) => void;
}

export function DefaultFieldsForm({
  item,
  loading,
  onSubmit,
  onCloseModal,
}: Props) {
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
    formState: { errors },
  } = useForm<DefaultFieldsFormData>({
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
      code: item?.code ?? "",
      translations: item?.translations ?? {},
      selectedLanguages: [],
    },
    resolver: zodResolver(defaultFieldsSchema),
    mode: "all",
  });

  const selectedLanguages = watch("selectedLanguages");

  const onFormSubmit = (values: DefaultFieldsFormData) => {
    const filteredTranslations = Object.fromEntries(
      Object.entries(values.translations || {})
        .filter(([key]) =>
          values.selectedLanguages?.some((lang) => lang.code === key)
        )
        .map(([key, value]) => [
          key,
          {
            name: value.name || "",
            description: value.description || "",
            code: value.code || "",
          },
        ])
    );
    onSubmit({
      ...values,
      translations: filteredTranslations,
    });
  };

  useEffect(() => {
    if (item && languageOptions.length > 0) {
      const translationLangCodes = Object.keys(item.translations || {});
      const initialSelectedLanguages = languageOptions.filter((lang) =>
        translationLangCodes.includes(lang.code)
      );
      reset({
        name: item.name,
        description: item.description,
        code: item.code,
        translations: item.translations,
        selectedLanguages: initialSelectedLanguages,
      });
    } else if (!item) {
      reset({
        name: "",
        code: "",
        description: "",
        translations: {},
        selectedLanguages: [],
      });
    }
  }, [item, languages, reset]);

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-4 p-4 px-7 min-h-[500px] max-h-[700px] overflow-x-hidden overflow-y-auto
      "
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
      <InputRHF<DefaultFieldsFormData>
        control={control}
        name="name"
        label="Name"
        placeholder="Write Default Name"
        size="xl"
        labelVariant="bold"
        error={errors.name?.message}
      />
      {selectedLanguages?.map((lang) => (
        <div key={lang.code} className="flex gap-2">
          <div className="text-sm font-medium">{`${lang.code.toUpperCase()}:`}</div>
          <InputRHF<DefaultFieldsFormData>
            control={control}
            name={`translations.${lang.code}.name`}
            placeholder={`Write ${lang.name} Name`}
            size="xl"
            labelVariant="bold"
            error={errors.translations?.[lang.code]?.name?.message}
          />
        </div>
      ))}
      <InputRHF<DefaultFieldsFormData>
        control={control}
        name="code"
        label="Code"
        placeholder="Write Default Code"
        size="xl"
        labelVariant="bold"
        error={errors.code?.message}
      />
      {selectedLanguages?.map((lang) => (
        <div key={lang.code} className="flex gap-2">
          <div className="text-sm font-medium">{`${lang.code.toUpperCase()}:`}</div>
          <InputRHF<DefaultFieldsFormData>
            control={control}
            name={`translations.${lang.code}.code`}
            placeholder={`Write ${lang.name} Code`}
            size="xl"
            labelVariant="bold"
            error={errors.translations?.[lang.code]?.code?.message}
          />
        </div>
      ))}
      <TextAreaRHF<DefaultFieldsFormData>
        control={control}
        name="description"
        label="Description"
        placeholder="Write Default Description..."
        labelVariant="bold"
        rows={4}
        error={errors.description?.message}
      />
      {selectedLanguages?.map((lang) => (
        <div key={lang.code} className="flex gap-2">
          <div className="text-sm font-medium">{`${lang.code.toUpperCase()}:`}</div>
          <TextAreaRHF<DefaultFieldsFormData>
            control={control}
            name={`translations.${lang.code}.description`}
            placeholder={`Write ${lang.name} Description...`}
            labelVariant="bold"
            rows={4}
            error={errors.translations?.[lang.code]?.description?.message}
          />
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
          {item ? "Edit" : "Add"}
        </Button>
      </div>
    </form>
  );
}
