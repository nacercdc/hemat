"use client";

import {
  Button,
  ColorPickerRHF,
  InputRHF,
  MultiSelectRHF,
  TextAreaRHF,
} from "@etm/web-ui-components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ScaleCreate } from "~/libs/models/scale.model";
import { useMemo, useEffect } from "react";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { Language } from "~/libs/models/language.model";
import { Icon } from "@iconify/react/dist/iconify.js";

interface Props {
  onSubmitScaleFormHandler: (values: ScaleCreate) => void;
  onCancelScaleFormHandler?: () => void;
  isLoading?: boolean;
  scale?: ScaleCreate;
}

const languageSchema = z.object({
  name: z.string().min(1, { message: "Language name is required." }),
  code: z.string().min(1, { message: "Language code is required." }),
  native: z.string().min(1, { message: "Native language name is required." }),
});

const ScaleFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    rate: z.number().min(1, { message: "Rate is required" }),
    color: z.string().min(1, { message: "Color is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    translations: z
      .record(
        z.string(),
        z.object({
          name: z.string().optional(),
          description: z.string().optional(),
        })
      )
      .optional(),
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

type ScaleFormData = z.infer<typeof ScaleFormSchema>;

export function ScaleForm({
  onSubmitScaleFormHandler,
  onCancelScaleFormHandler,
  isLoading = false,
  scale,
}: Props) {
  const { data: languages, ...languagesState } = useFindAll<
    QueryManyResponse<Language>
  >({
    path: "/languages",
  });

  const languageOptions = useMemo(
    () =>
      (languages?.data as unknown as Language[])?.filter(
        (lang) => lang.code !== "en" && languageSchema.safeParse(lang).success
      ) ?? [],
    [languages?.data]
  );

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
    watch,
    formState: { errors },
  } = useForm<ScaleFormData>({
    defaultValues: {
      name: scale?.name ?? "",
      rate: scale?.rate ?? 0,
      color: scale?.color ?? "",
      description: scale?.description ?? "",
      translations: defaultTranslations,
      selectedLanguages: [],
    },
    resolver: zodResolver(ScaleFormSchema),
    mode: "all",
    shouldUnregister: false,
  });

  const selectedLanguages = watch("selectedLanguages");

  const onLanguageSelectHandler = (langs: Language[]) => {
    const validLangs = langs.filter(
      (lang) => languageSchema.safeParse(lang).success
    );
    setValue("selectedLanguages", validLangs);
    validLangs.forEach((lang) => {
      if (!selectedLanguages?.some((selected) => selected.code === lang.code)) {
        setValue(`translations.${lang.code}`, {
          name: "",
          description: "",
        });
      }
    });
  };

  const onRemoveLanguageHandler = (code: string) => {
    const newLangs = (selectedLanguages || []).filter((l) => l.code !== code);
    setValue("selectedLanguages", newLangs);
  };

  const onCancelHandler = () => {
    onCancelScaleFormHandler?.();
    reset();
  };

  const onSubmitHandler = (values: ScaleFormData) => {
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
    onSubmitScaleFormHandler({
      ...values,
      translations: filteredTranslations,
    });
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
    if (scale && languageOptions.length > 0) {
      const translationLangCodes = Object.keys(scale.translations || {});
      const initialSelectedLanguages = languageOptions.filter((lang) =>
        translationLangCodes.includes(lang.code)
      );
      reset({
        name: scale.name,
        rate: scale.rate,
        color: scale.color,
        description: scale.description,
        translations: scale.translations,
        selectedLanguages: initialSelectedLanguages,
      });
    } else if (!scale) {
      reset({
        name: "",
        rate: 0,
        color: "",
        description: "",
        translations: {},
        selectedLanguages: [],
      });
    }
  }, [scale, languageOptions]);

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
      <div className="flex flex-col gap-6 w-full flex-1 overflow-y-auto px-8 pb-20">
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
          />
          <ColorPickerRHF<ScaleFormData>
            control={control}
            name="color"
            defaultValue="#435ff3"
            size="xl"
            label="Color"
            labelVariant="bold"
            inModal={true}
          />
        </div>
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
          isModal={true}
          loading={languagesState.isLoading}
          error={errors.selectedLanguages?.message}
        />
        <div className="rounded-md bg-layout-bg/30 p-4 mb-4 relative">
          <span className="flex items-center mb-3 absolute -top-2 px-2 py-1 bg-destructive-700/10 text-destructive-700 rounded text-xs font-medium mr-2">
            English
          </span>
          <div className="grid grid-cols-1 gap-4 mb-2 mt-2">
            <InputRHF<ScaleFormData>
              control={control}
              name="name"
              placeholder="Write Default Name"
              label="Name"
              labelVariant="bold"
              size="xl"
              error={errors.name?.message}
            />
          </div>
          <TextAreaRHF<ScaleFormData>
            control={control}
            name="description"
            placeholder="Write Default Description..."
            label="Description"
            labelVariant="bold"
            rows={4}
            error={errors.description?.message}
          />
        </div>
        {selectedLanguages?.map((lang) => (
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
              <InputRHF<ScaleFormData>
                control={control}
                name={`translations.${lang.code}.name`}
                placeholder={`Write ${lang.name} Name`}
                label="Name"
                labelVariant="bold"
                size="xl"
                error={errors.translations?.[lang.code]?.name?.message}
              />
            </div>
            <TextAreaRHF<ScaleFormData>
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
      <div className="flex justify-between items-center sticky bottom-0 z-10 w-full bg-layout-bg p-4 rounded-b-lg px-8">
        <Button
          variant="outline"
          type="button"
          color="card"
          size="lg"
          onClick={onCancelHandler}
        >
          Cancel
        </Button>
        <Button size="lg" type="submit" loading={isLoading}>
          {scale ? "Edit" : "Save"}
        </Button>
      </div>
    </form>
  );
}
