/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useCallback, useEffect } from "react";
import { z } from "zod";

import { useForm } from "react-hook-form";
import {
  Button,
  InputRHF,
  MultiSelectRHF,
  TextAreaRHF,
} from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Language } from "~/libs/models/language.model";
import { DEFAULT_LANGUAGE_CODE } from "~/constants";
import { useGetLanguages } from "~/providers/languages/useGetLanguages";
import type { ListItemType } from "../../types";
import { Icon } from "@iconify/react/dist/iconify.js";

const languageSchema = z.object({
  name: z.string().min(1, { message: "Language name is required." }),
  code: z.string().min(1, { message: "Language code is required." }),
  native: z.string().min(1, { message: "Native language name is required." }),
});

const itemFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required." }),
    description: z.string().min(1, { message: "Description is required." }),
    translations: z.record(
      z.string(),
      z.object({
        name: z.string().optional(),
        description: z.string().optional(),
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
          message: `Translation name for ${lang.name} is required.`,
        });
      }
      if (!translation.description?.trim()) {
        ctx.addIssue({
          path: ["translations", lang.code, "description"],
          code: z.ZodIssueCode.custom,
          message: `Translation description for ${lang.name} is required.`,
        });
      }
    }
  });

export type ItemFormData = z.infer<typeof itemFormSchema>;

interface Props {
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
    setValue,
    watch,
    formState: { errors },
  } = useForm<ItemFormData>({
    defaultValues: {
      name: item?.name ?? "",
      description: item?.description ?? "",
      translations: item?.translations ?? {},
      selectedLanguages: [],
    },
    resolver: zodResolver(itemFormSchema),
    mode: "all",
    shouldUnregister: false,
  });

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
          });
        }
      });
    },
    [item, selectedLanguages, setValue, watch]
  );

  const onSubmit = (values: ItemFormData) => {
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
          },
        ])
    );
    onSubmitHandler({
      ...values,
      translations: filteredTranslations,
    });
  };

  const onRemoveLanguageHandler = (code: string) => {
    const newLangs = (selectedLanguages || []).filter((l) => l.code !== code);
    setValue("selectedLanguages", newLangs);
  };

  useEffect(() => {
    if (selectedLanguages && Array.isArray(selectedLanguages)) {
      selectedLanguages.forEach((lang) => {
        const translation = watch(`translations.${lang.code}`);
        if (!translation || typeof translation !== "object") {
          setValue(`translations.${lang.code}`, { name: "", description: "" });
        } else {
          if (typeof translation.name !== "string") {
            setValue(`translations.${lang.code}.name`, "");
          }
          if (typeof translation.description !== "string") {
            setValue(`translations.${lang.code}.description`, "");
          }
        }
      });
    }
  }, [selectedLanguages]);

  useEffect(() => {
    if (item && languageOptions.length > 0) {
      const translationLangCodes = Object.keys(item.translations || {});
      const initialSelectedLanguages = languageOptions.filter((lang) =>
        translationLangCodes.includes(lang.code)
      );
      reset({
        name: item.name,
        description: item.description,
        translations: item.translations,
        selectedLanguages: initialSelectedLanguages,
      });
    } else if (!item) {
      reset({
        name: "",
        description: "",
        translations: {},
        selectedLanguages: [],
      });
    }
  }, [item, languages]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full"
    >
      <div className="flex flex-col gap-4 p-4 px-7 max-h-[700px] overflow-x-hidden overflow-y-auto">
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
          loading={languagesState.isLoading}
          error={errors.selectedLanguages?.message}
        />
        {/* English (default, not removable) */}
        <div className="rounded-md bg-layout-bg/30 p-4 mb-4 relative">
          <span className="flex items-center mb-3 absolute -top-2 px-2 py-1 bg-destructive-700/10 text-destructive-700 rounded text-xs font-medium mr-2">
            English
          </span>
          <div className="grid grid-cols-1 gap-4 mb-2 mt-2">
            <InputRHF<ItemFormData>
              control={control}
              name="name"
              placeholder="Write Default Name"
              label="Name"
              labelVariant="bold"
              size="xl"
              error={errors.name?.message}
            />
          </div>
          <TextAreaRHF<ItemFormData>
            control={control}
            name="description"
            placeholder="Write Default Description..."
            label="Description"
            labelVariant="bold"
            rows={4}
            error={errors.description?.message}
          />
        </div>
        {/* Other selected languages */}
        {selectedLanguages
          ?.filter((lang) => lang.code !== DEFAULT_LANGUAGE_CODE)
          .map((lang) => (
            <div
              key={lang.code}
              className="rounded-md bg-layout-bg/30 p-4 mb-4 relative"
            >
              <span className="flex items-center mb-3 absolute -top-2 px-2 py-1 bg-destructive-700/10 text-destructive-700 rounded text-xs font-medium mr-2">
                {lang.name}
              </span>
              <button
                type="button"
                className="ml-auto text-xl px-2 py-1 bg-muted/50 rounded-tr-md rounded-bl-md absolute top-0 right-0"
                onClick={() => onRemoveLanguageHandler(lang.code)}
              >
                <Icon icon="mdi:close" />
              </button>
              <div className="grid grid-cols-1 gap-4 mb-2 mt-2">
                <InputRHF<ItemFormData>
                  control={control}
                  name={`translations.${lang.code}.name`}
                  placeholder={`Write ${lang.name} Name`}
                  label="Name"
                  labelVariant="bold"
                  size="xl"
                  error={errors.translations?.[lang.code]?.name?.message}
                />
              </div>
              <TextAreaRHF<ItemFormData>
                control={control}
                name={`translations.${lang.code}.description`}
                placeholder={`Write ${lang.name} Description...`}
                label="Description"
                labelVariant="bold"
                rows={4}
                error={errors.translations?.[lang.code]?.description?.message}
              />
            </div>
          ))}
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
          <Button type="submit" size="lg" loading={loading}>
            {item ? "Edit" : "Add"}
          </Button>
        </div>
      </div>
    </form>
  );
}
