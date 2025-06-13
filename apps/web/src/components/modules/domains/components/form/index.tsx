"use client";

import React, { useCallback, useEffect } from "react";
import { z } from "zod";

import type { ListItemType, ListTypeLabel } from "../..";
import { useForm } from "react-hook-form";
import {
  Button,
  InputRHF,
  MultiSelectRHF,
  TextAreaRHF,
} from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { Language } from "~/libs/models/language.model";
import { DEFAULT_LANGUAGE_CODE } from "~/constants";

const languageSchema = z.object({
  name: z.string().min(1, { message: "Language name is required" }),
  code: z.string().min(1, { message: "Language code is required" }),
  native: z.string().min(1, { message: "Native language name is required" }),
});

const itemFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    code: z
      .string({ message: "Code is required" })
      .min(2, { message: "Code must be at least 2 characters" })
      .max(10, { message: "Code must be less than 10 characters" }),
    translations: z.record(
      z.string(),
      z.object({
        name: z.string().min(1, { message: "Translation name is required" }),
        description: z
          .string()
          .min(1, { message: "Translation description is required" }),
        code: z
          .string({ message: "Translation code is required" })
          .min(2, { message: "Translation code must be at least 2 characters" })
          .max(10, {
            message: "Translation code must be less than 10 characters",
          }),
      })
    ),
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
      if (!translation.code?.trim()) {
        ctx.addIssue({
          path: ["translations", lang.code, "code"],
          code: z.ZodIssueCode.custom,
          message: `Translation code for ${lang.name.toUpperCase()} is required`,
        });
      }
      if (!translation.description?.trim()) {
        ctx.addIssue({
          path: ["translations", lang.code, "description"],
          code: z.ZodIssueCode.custom,
          message: `Translation description for ${lang.name.toUpperCase()} is required`,
        });
      }
    }
  });

export type ItemFormData = z.infer<typeof itemFormSchema>;

interface Props {
  type: ListTypeLabel;
  item?: ListItemType;
  onSubmitHandler: (data: ItemFormData) => void;
  onCloseModal?: () => void;
  loading?: boolean;
}

export function DomainComponentForm({
  item,
  onSubmitHandler,
  onCloseModal,
  loading,
}: Props) {
  const { data: languages, isLoading: languagesLoading } = useFindAll<
    QueryManyResponse<Language>
  >({
    path: "/languages",
  });

  const languageOptions: Language[] = languages?.data
    ? (languages.data as unknown as Language[]).filter(
        (lang) => languageSchema.safeParse(lang).success
      )
    : [];

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ItemFormData>({
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
      code: item?.code ?? "",
      translations: item?.translations ?? {},
      selectedLanguages: [],
    },
    resolver: zodResolver(itemFormSchema),
    mode: "all",
  });

  console.log(errors, "Eroororo");

  const selectedLanguages = watch("selectedLanguages");

  const onLanguageSelectHandler = useCallback(
    (langs: Language[]) => {
      const validLangs = langs.filter(
        (lang) => languageSchema.safeParse(lang).success
      );
      setValue("selectedLanguages", validLangs);
      validLangs.forEach((lang) => {
        if (
          !selectedLanguages?.some((selected) => selected.code === lang.code)
        ) {
          setValue(`translations.${lang.code}`, {
            name: lang.code === DEFAULT_LANGUAGE_CODE ? (item?.name ?? "") : "",
            description:
              lang.code === DEFAULT_LANGUAGE_CODE
                ? (item?.description ?? "")
                : "",
            code: lang.code === DEFAULT_LANGUAGE_CODE ? (item?.code ?? "") : "",
          });
        }
      });
    },
    [item, selectedLanguages, setValue]
  );

  const onSubmit = (values: ItemFormData) => {
    console.log(values, "Values");
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
    onSubmitHandler({
      ...values,
      translations: filteredTranslations,
    });
  };

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        description: item.description,
        code: item.code,
        translations: item.translations,
      });
    }
  }, [item, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full"
    >
      <div className="flex flex-col gap-4 p-4 px-7 max-h-[700px] overflow-x-hidden overflow-y-auto">
        <InputRHF<ItemFormData>
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
            <InputRHF<ItemFormData>
              control={control}
              name={`translations.${lang.code}.name`}
              placeholder={`Write ${lang.name} Name`}
              size="xl"
              labelVariant="bold"
              error={errors.translations?.[lang.code]?.name?.message}
            />
          </div>
        ))}
        <InputRHF<ItemFormData>
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
            <InputRHF<ItemFormData>
              control={control}
              name={`translations.${lang.code}.code`}
              placeholder={`Write ${lang.name} Code`}
              size="xl"
              labelVariant="bold"
              error={errors.translations?.[lang.code]?.code?.message}
            />
          </div>
        ))}
        <TextAreaRHF<ItemFormData>
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
            <TextAreaRHF<ItemFormData>
              control={control}
              name={`translations.${lang.code}.description`}
              placeholder={`Write ${lang.name} Description...`}
              labelVariant="bold"
              rows={4}
              error={errors.translations?.[lang.code]?.description?.message}
            />
          </div>
        ))}
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
      </div>
      <div className="bg-primary-50">
        <div className="flex items-center justify-between p-4 px-7">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCloseModal}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            loading={loading}
            // onClick={() => onAddActionHandler(cardListType)}
          >
            {item ? "Edit" : "Add"}
          </Button>
        </div>
      </div>
    </form>
  );
}
