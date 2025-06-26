"use client";

import { Button, MultiSelectRHF, useToast } from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useCallback } from "react";
import type { Language } from "~/libs/models/language.model";

import { Fields } from "./SubComponentFields";
import type {
  AssessmentSubComponent,
  AssessmentSubComponentUpdate,
} from "~/libs/models/assessment-sub-component.model";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";

// SubComponent Schema
export const assessmentSubComponentFormSchema = z
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

export type AssessmentSubComponentFormData = z.infer<
  typeof assessmentSubComponentFormSchema
>;

interface Props {
  languageOptions: Language[];
  assessmentId: string;
  refetchSubComponents: () => void;
  activeSubComponent: AssessmentSubComponent | null;
}

export const SubComponentForm = ({
  languageOptions,
  assessmentId,
  activeSubComponent,
  refetchSubComponents,
}: Props) => {
  const { toast } = useToast();
  const { mutate: saveSubComponent } = usePutMutation<
    AssessmentSubComponent,
    AssessmentSubComponentUpdate
  >(`/assessments/${assessmentId}/sub-components/${activeSubComponent?.id}`);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<AssessmentSubComponentFormData>({
    defaultValues: {
      name: activeSubComponent?.name ?? "",
      description: activeSubComponent?.description ?? "",
      code: activeSubComponent?.code ?? "",
      translations: {},
      selectedLanguages: [],
    },
    resolver: zodResolver(assessmentSubComponentFormSchema),
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

  const onSubmitHandler = (values: AssessmentSubComponentFormData) => {
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
    saveSubComponent(
      {
        data: {
          ...values,
          id: activeSubComponent?.id ?? "",
          componentId: activeSubComponent?.componentId ?? "",
          translations: filteredTranslations,
        },
      },
      {
        onSuccess: () => {
          refetchSubComponents();
          toast({
            title: "Component updated successfully",
            message: "The component has been updated successfully.",
            variant: "success",
          });
        },
        onError: () => {
          toast({
            title: "Error updating component",
            message: "An error occurred while updating the component.",
            variant: "destructive",
          });
        },
      }
    );
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
        labelKey="name"
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
