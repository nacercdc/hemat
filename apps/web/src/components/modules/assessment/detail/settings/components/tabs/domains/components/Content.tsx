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
  AssessmentDomain,
  AssessmentDomainUpdate,
} from "~/libs/models/assessment-domain.model";
import {
  DEFAULT_LANGUAGE_CODE,
  DEFAULT_LANGUAGE_NAME,
  DEFAULT_LANGUAGE_NATIVE,
} from "~/constants";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";

export const assessmentDomainFormSchema = z
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

export type AssessmentDomainFormData = z.infer<
  typeof assessmentDomainFormSchema
>;

interface Props {
  activeDomain: AssessmentDomain | null;
  assessmentId: string;
  refetchDomains: () => void;
}

export function Content({ activeDomain, assessmentId, refetchDomains }: Props) {
  const { toast } = useToast();
  const { data: languages, isLoading: languagesLoading } = useFindAll<
    QueryManyResponse<Language>
  >({
    path: "/languages",
  });
  const { mutate: updateDomain, ...updateDomainState } = usePutMutation<
    AssessmentDomain,
    AssessmentDomainUpdate
  >(`/assessments/${assessmentId}/domains/${activeDomain?.id}`);

  const languageOptions: Language[] =
    (languages?.data as unknown as Language[]) ?? [];

  const getDefaultTranslations = useCallback(
    (domain: AssessmentDomain | null) => {
      if (domain?.translations) {
        return domain.translations;
      }
      const translations: Record<
        string,
        { name: string; description: string; code: string }
      > = {};
      languageOptions.forEach((lang) => {
        translations[lang.code] = {
          name: lang.code === DEFAULT_LANGUAGE_CODE ? (domain?.name ?? "") : "",
          description:
            lang.code === DEFAULT_LANGUAGE_CODE
              ? (domain?.description ?? "")
              : "",
          code: lang.code === DEFAULT_LANGUAGE_CODE ? (domain?.code ?? "") : "",
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
  } = useForm<AssessmentDomainFormData>({
    defaultValues: {
      name: activeDomain?.name ?? "",
      description: activeDomain?.description ?? "",
      code: activeDomain?.code ?? "",
      selectedLanguages: activeDomain?.translations
        ? Object.keys(activeDomain.translations).map((code) => {
            const lang = languageOptions.find((lang) => lang.code === code);
            return lang ? lang : { name: "", code, native: "" };
          })
        : languageOptions.length > 0
          ? [languageOptions[0]]
          : [],
      translations: activeDomain?.translations ?? {},
    },
    resolver: zodResolver(assessmentDomainFormSchema),
    mode: "all",
  });

  const domainLanguages = activeDomain?.translations
    ? Object.keys(activeDomain.translations).map((code) => {
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
          const existingTranslation = activeDomain?.translations?.[lang.code];

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
    [selectedLanguages, activeDomain?.translations, setValue, watch]
  );

  const onSubmitHandler = (values: AssessmentDomainFormData) => {
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

    updateDomain(
      {
        data: {
          id: activeDomain?.id ?? "",
          code: values.code,
          name: values.name,
          description: values.description,
          translations: filteredTranslations,
        },
        isProtected: true,
      },
      {
        onSuccess: () => {
          refetchDomains();
          toast({
            title: "Domain updated successfully",
            message: "The domain has been updated successfully.",
            variant: "success",
          });
        },
      }
    );
  };

  const onCancelHandler = useCallback(() => {
    reset({
      name: activeDomain?.name ?? "",
      description: activeDomain?.description ?? "",
      code: activeDomain?.code ?? "",
      translations: getDefaultTranslations(activeDomain),
      selectedLanguages:
        domainLanguages.length > 0 ? domainLanguages : [defaultLanguage],
    });
  }, [activeDomain, getDefaultTranslations, domainLanguages, reset]);

  useEffect(() => {
    if (languageOptions.length > 0) {
      reset({
        name: activeDomain?.name ?? "",
        description: activeDomain?.description ?? "",
        code: activeDomain?.code ?? "",
        translations: getDefaultTranslations(activeDomain),
        selectedLanguages:
          domainLanguages.length > 0 ? domainLanguages : [defaultLanguage],
      });
    }
  }, [activeDomain, languages, reset, getDefaultTranslations]);

  if (!activeDomain) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col w-full md:w-3/4 h-full bg-card border border-secondary-300 rounded-r-sm gap-6 flex-1 overflow-y-auto pb-20 p-4"
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
          labelKey="name"
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
        <Button size="lg" type="submit" loading={updateDomainState.isPending}>
          {updateDomainState.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
