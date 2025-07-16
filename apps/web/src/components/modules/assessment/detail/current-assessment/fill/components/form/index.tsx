"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ETMEditorRHF,
  isHtmlStringEmpty,
  RadioGroupRHF,
  Tooltip,
} from "@etm/web-ui-components";
import { Icon } from "@iconify/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { AssessmentFormSkeleton } from "./AssessmentFormSkeleton";
import type { Scale } from "~/libs/models/scale.model";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { Answer, AnswerIncludable } from "~/libs/models/answer.model";
import type { SubComponent } from "~/libs/models/subComponent.model";

export const SubCompAssessmentFormID = "SubCompAssessmentForm";

const MeasurementScaleSchema = z.object(
  {
    id: z.string(),
    name: z.string(),
  },
  {
    required_error: "Measurement scale is required",
    invalid_type_error: "Measurement scale type invalid",
  }
);

const AssessmentFormSchema = z.object({
  measurementScale: MeasurementScaleSchema,
  evidence: z.string().superRefine((html, ctx) => {
    if (isHtmlStringEmpty(html)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Evidence can't be empty",
      });
    }
  }),
  reference: z.string().superRefine((html, ctx) => {
    if (isHtmlStringEmpty(html)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Reference can't be empty",
      });
    }
  }),
});

export type AssessmentFormData = z.infer<typeof AssessmentFormSchema>;
export type MeasurementScaleType = z.infer<typeof MeasurementScaleSchema>;

interface Props {
  subComponent?: SubComponent;
  isLoading?: boolean;
  onSubmitHandler: (values: AssessmentFormData) => void;
}

export function SubCompAssessmentForm({
  subComponent,
  isLoading = false,
  onSubmitHandler,
}: Props) {
  const { control, reset, handleSubmit } = useForm<AssessmentFormData>({
    defaultValues: {
      evidence: "",
      reference: "",
      measurementScale: { id: "", name: "" },
    },
    resolver: zodResolver(AssessmentFormSchema),
  });

  const [activeMeasurementScale, setActiveMeasurementScale] =
    useState<MeasurementScaleType>();

  //TODO: replace assessmentId from params
  const { data: measurementScales, ...measurementScalesState } = useFindAll<
    QueryManyResponse<MeasurementScaleType>
  >({
    path: "/assessments/e9989a40-722d-4541-b368-8c7ebab86013/measurement-scales",
    queries: {
      limit: 100,
      page: 1,
    },
  });

  //TODO: replace assessmentId from params
  const { data: subComponentAnswer, ...subComponentAnswerState } = useFindById<
    QueryManyResponse<Answer>,
    AnswerIncludable
  >({
    path: `/assessments/e9989a40-722d-4541-b368-8c7ebab86013/sub-components/${subComponent?.id}/primary-answer`,
    queries: {
      include: ["measurementScale"],
    },
    tqOptions: {
      enabled: !!subComponent,
      staleTime: 0,
      retry: false,
    },
  });

  const { data: scaleDescription, ...scaleDescriptionState } = useFindById<
    Scale,
    unknown
  >({
    path: `/assessment-sub-components/${subComponent?.id}/measurement-scales/${activeMeasurementScale?.id}`,
    tqOptions: {
      enabled: !!activeMeasurementScale,
    },
  });

  const formattedMeasurementScales = useMemo(() => {
    if (!measurementScales?.data) return [];

    return (measurementScales?.data as unknown as Scale[])?.map((scale) => ({
      ...scale,
      name: `${scale.name} (${scale.rate})`,
    }));
  }, [measurementScales?.data]);

  const scaleDescriptionLoading =
    scaleDescriptionState.isFetching || scaleDescriptionState.isLoading;

  const onScaleDescHoverHandler = (scaleData: MeasurementScaleType) => {
    if (!scaleDescriptionLoading) setActiveMeasurementScale(scaleData);
  };

  const onScaleDescMouseLeaveHandler = () => {
    setActiveMeasurementScale(undefined);
  };

  //TODO: it will be an object response instead of an array onces the API is fixed
  useEffect(() => {
    const answer = subComponentAnswer as unknown as Answer;

    if (answer) {
      const formattedScale = formattedMeasurementScales.find(
        (scale) => scale.id === answer.measurementScale?.id
      );
      reset({
        evidence: answer.evidence,
        reference: answer.reference,
        measurementScale: {
          id: formattedScale?.id,
          name: formattedScale?.name,
        },
      });
    } else {
      reset({
        evidence: "",
        reference: "",
        measurementScale: { id: "", name: "" },
      });
    }
  }, [formattedMeasurementScales, reset, subComponent?.id, subComponentAnswer]);

  if (
    isLoading ||
    measurementScalesState.isFetching ||
    subComponentAnswerState.isFetching
  )
    return <AssessmentFormSkeleton />;

  return (
    <form
      key={subComponent?.id}
      id={`${SubCompAssessmentFormID}`}
      onSubmit={handleSubmit(onSubmitHandler)}
      className="w-full transition-all duration-1000 ease-in-out"
    >
      <div className="flex flex-col w-full h-full p-7 gap-6 border border-basic-300 rounded-lg">
        <span className="text-lg font-bold">{subComponent?.name}</span>

        <p className="text-xs font-medium text-dark-light">
          {subComponent?.description}
        </p>

        <RadioGroupRHF<MeasurementScaleType, AssessmentFormData>
          control={control}
          name="measurementScale"
          options={formattedMeasurementScales}
          valueKey="id"
          labelKey="name"
          size="sm"
          alignment="grid"
          badge={
            <Tooltip
              trigger={
                <Icon
                  icon="heroicons:information-circle"
                  className="!w-4 !h-4"
                />
              }
              content={scaleDescription?.description}
              contentLoading={scaleDescriptionLoading}
              color="dark"
            />
          }
          onBadgeHover={onScaleDescHoverHandler}
          onBadgeLeave={onScaleDescMouseLeaveHandler}
        />

        <ETMEditorRHF
          control={control}
          name="evidence"
          label="Evidence"
          labelVariant="medium"
          placeholder="Write you evidence here"
        />

        <ETMEditorRHF
          control={control}
          name="reference"
          label="Reference"
          labelVariant="medium"
          placeholder="Write you reference here"
        />
      </div>
    </form>
  );
}
