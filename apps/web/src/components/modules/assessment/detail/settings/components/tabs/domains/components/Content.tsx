/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button, useToast } from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useCallback } from "react";

import { Fields } from "./Fields";
import type {
  AssessmentDomain,
  AssessmentDomainUpdate,
} from "~/libs/models/assessment-domain.model";
import { DEFAULT_LANGUAGE_CODE } from "~/constants";
import { usePutMutation } from "~/libs/tanstack-api-query/hooks/usePutMutation";
import type { Assessment } from "~/libs/models/assessment.model";

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
  assessment?: Assessment;
  assessmentId: string;
  refetchDomains: () => void;
  activeDomain: AssessmentDomain | null;
}

export function Content({
  activeDomain,
  assessment,
  assessmentId,
  refetchDomains,
}: Props) {
  const { toast } = useToast();

  const nonDefaultLanguages = (assessment?.languages ?? []).filter(
    (lang) => lang.code !== DEFAULT_LANGUAGE_CODE
  );

  const getDefaultTranslations = useCallback(
    (domain: AssessmentDomain | null) => {
      if (domain?.translations) {
        return domain.translations;
      }
      const translations: Record<
        string,
        { name: string; description: string; code: string }
      > = {};
      nonDefaultLanguages.forEach((lang) => {
        translations[lang.code] = {
          name: "",
          description: "",
          code: "",
        };
      });
      return translations;
    },
    [nonDefaultLanguages]
  );

  const {
    control,
    handleSubmit,
    reset,
    // setValue, // removed, not used
    watch,
    formState: { errors },
  } = useForm<AssessmentDomainFormData>({
    defaultValues: {
      name: activeDomain?.name ?? "",
      description: activeDomain?.description ?? "",
      code: activeDomain?.code ?? "",
      selectedLanguages: nonDefaultLanguages,
      translations: activeDomain?.translations ?? {},
    },
    resolver: zodResolver(assessmentDomainFormSchema),
    mode: "all",
  });

  const selectedLanguages = nonDefaultLanguages;

  const { mutate: updateDomain, ...updateDomainState } = usePutMutation<
    AssessmentDomain,
    AssessmentDomainUpdate
  >(`/assessments/${assessmentId}/domains/${activeDomain?.id}`);

  const onSubmitHandler = (values: AssessmentDomainFormData) => {
    const filteredTranslations = Object.fromEntries(
      Object.entries(values.translations || {})
        .filter(([key]) => selectedLanguages?.some((lang) => lang.code === key))
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
          translations: filteredTranslations, // only non-default languages
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
      selectedLanguages: nonDefaultLanguages,
    });
  }, [activeDomain, getDefaultTranslations, nonDefaultLanguages, reset]);

  useEffect(() => {
    reset({
      name: activeDomain?.name ?? "",
      description: activeDomain?.description ?? "",
      code: activeDomain?.code ?? "",
      translations: getDefaultTranslations(activeDomain),
      selectedLanguages: nonDefaultLanguages,
    });
  }, [activeDomain, reset]);

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
