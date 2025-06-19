/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button, MultiSelectRHF, useToast } from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useCallback } from "react";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { Language } from "~/libs/models/language.model";

import { Fields } from "./Fields";
import type {
  AssessmentComponent,
  AssessmentComponentUpdate,
} from "~/libs/models/assessment-component.model";
import {
  DEFAULT_LANGUAGE_CODE,
  DEFAULT_LANGUAGE_NAME,
  DEFAULT_LANGUAGE_NATIVE,
} from "~/constants";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";

export const assessmentComponentFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    code: z.string().min(1, { message: "Code is required" }).max(10, {
      message: "Code must be at most 10 characters long",
    }),
    translations: z.record(
      z.string(),
      z
        .object({
          name: z.string().optional(),
          description: z.string().optional(),
          code: z.string().optional(),
        })
        .optional()
    ),
    selectedLanguages: z
      .array(
        z.object({
          name: z.string(),
          code: z.string(),
          native: z.string(),
        })
      )
      .min(1, { message: "At least one language is required" }),
  })
  .superRefine((data, ctx) => {
    data.selectedLanguages.forEach((lang) => {
      const translation = data.translations[lang.code];

      if (!translation?.name || translation.name.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Name is required for this language",
          path: ["translations", lang.code, "name"],
        });
      }

      if (!translation?.description || translation.description.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Description is required for this language",
          path: ["translations", lang.code, "description"],
        });
      }

      if (!translation?.code || translation.code.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Code is required for this language",
          path: ["translations", lang.code, "code"],
        });
      }
    });
  });

export type AssessmentComponentFormData = z.infer<
  typeof assessmentComponentFormSchema
>;

interface Props {
  activeComponent: AssessmentComponent | null;
  assessmentId: string;
  refetchComponents: () => void;
}

export function Content({
  activeComponent,
  assessmentId,
  refetchComponents,
}: Props) {
  const { toast } = useToast();
  const { data: languages, isLoading: languagesLoading } = useFindAll<
    QueryManyResponse<Language>
  >({
    path: "/languages",
  });
  const { mutate: updateComponent, ...updateComponentState } = usePutMutation<
    AssessmentComponent,
    AssessmentComponentUpdate
  >(`/assessments/${assessmentId}/components/${activeComponent?.id}`);

  const languageOptions: Language[] =
    (languages?.data as unknown as Language[]) ?? [];

  const getDefaultTranslations = useCallback(
    (component: AssessmentComponent | null) => {
      if (component?.translations) {
        return component.translations;
      }
      const translations: Record<
        string,
        { name: string; description: string; code: string }
      > = {};
      languageOptions.forEach((lang) => {
        translations[lang.code] = {
          name:
            lang.code === DEFAULT_LANGUAGE_CODE ? (component?.name ?? "") : "",
          description:
            lang.code === DEFAULT_LANGUAGE_CODE
              ? (component?.description ?? "")
              : "",
          code:
            lang.code === DEFAULT_LANGUAGE_CODE ? (component?.code ?? "") : "",
        };
      });
      return translations;
    },
    [languageOptions]
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AssessmentComponentFormData>({
    defaultValues: {
      name: activeComponent?.name ?? "",
      description: activeComponent?.description ?? "",
      code: activeComponent?.code ?? "",
      selectedLanguages: activeComponent?.translations
        ? Object.keys(activeComponent.translations).map((code) => {
            const lang = languageOptions.find((lang) => lang.code === code);
            return lang ? lang : { name: "", code, native: "" };
          })
        : languageOptions.length > 0
          ? [languageOptions[0]]
          : [],
      translations: activeComponent?.translations ?? {},
    },
    resolver: zodResolver(assessmentComponentFormSchema),
    mode: "all",
  });

  const componentLanguages = activeComponent?.translations
    ? Object.keys(activeComponent.translations).map((code) => {
        const lang = languageOptions.find((lang) => lang.code === code);
        return lang ? lang : { name: "", code, native: "" };
      })
    : languageOptions.length > 0
      ? [languageOptions[0]]
      : [];

  const selectedLanguages = watch("selectedLanguages");

  const defaultLanguage = languageOptions.find(
    (lang) => lang.code === DEFAULT_LANGUAGE_CODE
  ) || {
    name: DEFAULT_LANGUAGE_NAME,
    code: DEFAULT_LANGUAGE_CODE,
    native: DEFAULT_LANGUAGE_NATIVE,
  };

  const onLanguageSelectHandler = useCallback(
    (langs: Language[]) => {
      langs.forEach((lang) => {
        if (
          !selectedLanguages.some((selected) => selected.code === lang.code)
        ) {
          const existingTranslation =
            activeComponent?.translations?.[lang.code];

          setValue(`translations.${lang.code}`, {
            name:
              existingTranslation?.name ??
              (lang.code === DEFAULT_LANGUAGE_CODE
                ? (watch("name") ?? "")
                : ""),
            description:
              existingTranslation?.description ??
              (lang.code === DEFAULT_LANGUAGE_CODE
                ? (watch("description") ?? "")
                : ""),
            code:
              existingTranslation?.code ??
              (lang.code === DEFAULT_LANGUAGE_CODE
                ? (watch("code") ?? "")
                : ""),
          });
        }
      });
    },
    [selectedLanguages, activeComponent?.translations, setValue, watch]
  );

  const onSubmitHandler = (values: AssessmentComponentFormData) => {
    const filteredTranslations = Object.fromEntries(
      Object.entries(values.translations || {})
        .filter(([key]) =>
          values.selectedLanguages?.some((lang) => lang.code === key)
        )
        .map(([key, value]) => [
          key,
          {
            name: value?.name || "",
            description: value?.description || "",
            code: value?.code || "",
          },
        ])
    );

    updateComponent(
      {
        data: {
          id: activeComponent?.id ?? "",
          code: values.code,
          name: values.name,
          description: values.description,
          translations: filteredTranslations,
        },
        isProtected: true,
      },
      {
        onSuccess: () => {
          refetchComponents();
          toast({
            title: "Component updated successfully",
            message: "The component has been updated successfully.",
            variant: "success",
          });
        },
        onError: (error) => {
          toast({
            title: "Error updating component",
            message:
              error.message ||
              "An error occurred while updating the component.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const onCancelHandler = useCallback(() => {
    reset({
      name: activeComponent?.name ?? "",
      description: activeComponent?.description ?? "",
      code: activeComponent?.code ?? "",
      translations: getDefaultTranslations(activeComponent),
      selectedLanguages:
        componentLanguages.length > 0 ? componentLanguages : [defaultLanguage],
    });
  }, [activeComponent, getDefaultTranslations, componentLanguages, reset]);

  useEffect(() => {
    if (languageOptions.length > 0) {
      reset({
        name: activeComponent?.name ?? "",
        description: activeComponent?.description ?? "",
        code: activeComponent?.code ?? "",
        translations: getDefaultTranslations(activeComponent),
        selectedLanguages:
          componentLanguages.length > 0
            ? componentLanguages
            : [defaultLanguage],
      });
    }
  }, [activeComponent, languages, reset, getDefaultTranslations]);

  if (!activeComponent) {
    return null;
  }

  return (
    <div className="flex flex-col w-full md:w-3/4 h-fit bg-card border border-secondary-300 rounded-r-sm">
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col gap-6 w-full flex-1 overflow-y-auto pb-20 p-4"
      >
        <>
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
            onChange={() => onLanguageSelectHandler}
            size="lg"
            loading={languagesLoading}
          />
        </>

        <div className="flex justify-end gap-8 items-center w-full bg-basic-200/30 p-4">
          <Button
            variant="outline"
            type="button"
            color="card"
            size="lg"
            onClick={onCancelHandler}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            type="submit"
            loading={updateComponentState.isPending}
          >
            {updateComponentState.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
