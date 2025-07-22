/* eslint-disable react-hooks/exhaustive-deps */
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
import { Icon } from "@iconify/react/dist/iconify.js";

const languageSchema = z.object({
  name: z.string().min(1, { message: "Language name is required." }),
  code: z.string().min(1, { message: "Language code is required." }),
  native: z.string().min(1, { message: "Native language name is required." }),
});

const defaultFieldsSchema = z
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
          message: `Translation for ${lang.name} is missing`,
        });
        continue;
      }

      if (!translation.name?.trim()) {
        ctx.addIssue({
          path: ["translations", lang.code, "name"],
          code: z.ZodIssueCode.custom,
          message: `Translation name for ${lang.name} is required`,
        });
      }

      if (!translation.description?.trim()) {
        ctx.addIssue({
          path: ["translations", lang.code, "description"],
          code: z.ZodIssueCode.custom,
          message: `Translation description for ${lang.name} is required`,
        });
      }
    }
  });

export type DefaultFieldsFormData = z.infer<typeof defaultFieldsSchema>;

interface Props {
  loading?: boolean;
  subComponent?: SubComponent;
  onSubmit: (data: DefaultFieldsFormData) => void;
}

export function DefaultFieldsForm({ subComponent, loading, onSubmit }: Props) {
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
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<DefaultFieldsFormData>({
    defaultValues: {
      name: subComponent?.name ?? "",
      description: subComponent?.description ?? "",
      translations: subComponent?.translations ?? {},
      selectedLanguages:
        languageOptions.filter((lang) =>
          Object.keys(subComponent?.translations || {}).includes(lang.code)
        ) || [],
    },
    resolver: zodResolver(defaultFieldsSchema),
    mode: "all",
    shouldUnregister: true,
  });

  const selectedLanguages: Omit<Language, "id">[] =
    watch("selectedLanguages") || [];

  const onFormSubmit = (values: DefaultFieldsFormData) => {
    const translations = {
      ...values.translations,
      en: {
        name: values.name,
        description: values.description,
      },
    };
    const filteredTranslations = Object.fromEntries(
      Object.entries(translations)
        .filter(
          ([key]) =>
            key === "en" ||
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
    onSubmit({
      ...values,
      translations: filteredTranslations,
    });
  };

  const onRemoveLanguageHandler = (code: string) => {
    const newLangs = (selectedLanguages || []).filter((l) => l.code !== code);
    setValue("selectedLanguages", newLangs);
  };

  const syncEnglishFields = () => {
    const name = watch("name");
    const description = watch("description");
    setValue("translations.en.name", name, { shouldValidate: false });
    setValue("translations.en.description", description, {
      shouldValidate: false,
    });
  };

  useEffect(() => {
    const subscription = watch((value, { name: changed }) => {
      if (["name", "code", "description"].includes(changed || "")) {
        syncEnglishFields();
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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
    if (subComponent && languageOptions.length > 0) {
      const translationLangCodes = Object.keys(subComponent.translations || {});
      const initialSelectedLanguages = languageOptions.filter((lang) =>
        translationLangCodes.includes(lang.code)
      );
      reset({
        name: subComponent.name,
        description: subComponent.description,
        translations: subComponent.translations,
        selectedLanguages: initialSelectedLanguages,
      });
    } else if (!subComponent) {
      reset({
        name: "",
        description: "",
        translations: {},
        selectedLanguages: [],
      });
    }
  }, [subComponent, languages]);

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="flex flex-col gap-4 p-4 px-7 min-h-[500px] h-full overflow-x-hidden overflow-y-auto"
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
      {/* English translation (default, not removable) */}
      <div className="rounded-md bg-layout-bg/30 p-4 mb-4 relative">
        <span className=" flex items-center mb-3 absolute -top-2 px-2 py-1 bg-destructive-700/10 text-destructive-700 rounded text-xs font-medium mr-2">
          English
        </span>

        <div className="grid grid-cols-1 gap-4 mb-2 mt-2">
          <InputRHF
            control={control}
            name="name"
            placeholder="Write sub-component name"
            label="Name"
            labelVariant="bold"
            error={errors.name?.message}
          />
        </div>
        <TextAreaRHF
          control={control}
          name="description"
          placeholder="Write description ..."
          label="Description"
          labelVariant="bold"
          error={errors.description?.message}
        />
      </div>
      {/* Other selected languages */}
      {selectedLanguages?.map((lang) => (
        <div
          key={lang.code}
          className="rounded-md bg-layout-bg/30 p-4 mb-4 relative"
        >
          <span className=" flex items-center mb-3 absolute -top-2 px-2 py-1 bg-destructive-700/10 text-destructive-700 rounded text-xs font-medium mr-2">
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
            <InputRHF
              control={control}
              name={`translations.${lang.code}.name`}
              placeholder="Write sub-component name"
              label="Name"
              labelVariant="bold"
              error={errors.translations?.[lang.code]?.name?.message}
            />
          </div>
          <TextAreaRHF
            control={control}
            name={`translations.${lang.code}.description`}
            placeholder="Write description ..."
            label="Description"
            labelVariant="bold"
            error={errors.translations?.[lang.code]?.description?.message}
          />
        </div>
      ))}
      <div className="flex items-center justify-end gap-4 mt-auto">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => reset()}
        >
          Reset
        </Button>
        <Button type="submit" size="lg" loading={loading}>
          {subComponent ? "Edit" : "Add"}
        </Button>
      </div>
    </form>
  );
}
