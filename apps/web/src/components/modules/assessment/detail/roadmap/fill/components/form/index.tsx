"use client";

import type { Dispatch, SetStateAction } from "react";
import React, { useEffect, useMemo, useState } from "react";
import {
  DateTimePickerRHF,
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
import { RoadmapFormSkeleton } from "./RoadmapFormSkeleton";
import type { Scale } from "~/libs/models/scale.model";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type {
  RoadmapAnswer,
  RoadmapAnswerIncludable,
} from "~/libs/models/roadmap-answer.model";
import type { Answer, AnswerIncludable } from "~/libs/models/answer.model";
import type { SubComponent } from "~/libs/models/subComponent.model";
import { useParams } from "next/navigation";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import { RoadmapDocUpload } from "./RoadmapDocUpload";

export const SubCompRoadmapFormID = "SubCompRoadmapForm";

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

const RoadmapFormSchema = z.object({
  startTime: z.date(),
  endTime: z.date(),
  measurementScale: MeasurementScaleSchema,
  gapAddressed: z.string().superRefine((html, ctx) => {
    if (isHtmlStringEmpty(html)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Gap addressed can't be empty",
      });
    }
  }),
  activities: z.string().superRefine((html, ctx) => {
    if (isHtmlStringEmpty(html)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Strategic initiatives can't be empty",
      });
    }
  }),
  responsible: z.string().superRefine((html, ctx) => {
    if (isHtmlStringEmpty(html)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Responsible entities can't be empty",
      });
    }
  }),
  resources: z.string().superRefine((html, ctx) => {
    if (isHtmlStringEmpty(html)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Resources used can't be empty",
      });
    }
  }),
});

export type RoadmapFormData = z.infer<typeof RoadmapFormSchema>;
export type MeasurementScaleType = z.infer<typeof MeasurementScaleSchema>;

interface Props {
  subComponent?: SubComponent;
  isLoading?: boolean;
  onRoadmapSubmitHandler: () => void;
  onSubmitting: Dispatch<SetStateAction<boolean>>;
}

export function SubCompRoadmapForm({
  subComponent,
  isLoading = false,
  onRoadmapSubmitHandler,
  onSubmitting,
}: Props) {
  const params = useParams();

  const [roadmapAnswerId, setRoadmapAnswerId] = useState<string | null>(null);

  const { control, reset, handleSubmit } = useForm<RoadmapFormData>({
    defaultValues: {
      startTime: new Date(),
      endTime: new Date(),
      measurementScale: { id: "", name: "" },
      gapAddressed: "",
      activities: "",
      responsible: "",
      resources: "",
    },
    resolver: zodResolver(RoadmapFormSchema),
  });

  const [activeMeasurementScale, setActiveMeasurementScale] =
    useState<MeasurementScaleType>();

  const { mutate: answerRoadmap, ...answerRoadmapState } = useAddMutation<
    { id: string; name: string },
    Omit<RoadmapFormData, "startTime" | "endTime"> & {
      assessmentId: string;
      measurementScaleId: string;
      subComponentId: string;
      answerId: string;
      startTime: string;
      endTime: string;
      documentation: string; //delete me ASAP
    }
  >(`assessments/${params.id as string}/roadmaps`);

  const { data: measurementScales, ...measurementScalesState } = useFindAll<
    QueryManyResponse<MeasurementScaleType>
  >({
    path: `/assessments/${params.id as string}/measurement-scales`,
    queries: {
      take: 100,
    },
  });

  const { data: subCompAssessmentAnswer, ...subCompAssessmentAnswerState } =
    useFindById<QueryManyResponse<Answer>, AnswerIncludable>({
      path: `/assessments/${params.id as string}/sub-components/${subComponent?.id}/primary-answer`,

      queries: {
        include: ["measurementScale"],
      },
      tqOptions: {
        enabled: !!subComponent,
        staleTime: 0,
      },
    });

  const { data: subCompRoadmapAnswer, ...subCompRoadmapAnswerState } =
    useFindById<QueryManyResponse<RoadmapAnswer>, RoadmapAnswerIncludable>({
      path: `/assessments/${params.id as string}/sub-components/${subComponent?.id}/roadmap-answer`,

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

  const onSubmitHandler = (values: RoadmapFormData & { answerId: string }) => {
    if (subComponent) onSubmitting(true);
    answerRoadmap(
      {
        data: {
          ...values,
          measurementScaleId: values.measurementScale.id,
          assessmentId: params.id as string,
          subComponentId: subComponent.id,
          answerId: values.answerId,
          startTime: new Date(values.startTime).toISOString(),
          endTime: new Date(values.endTime).toISOString(),
          documentation: "documentation", //delete me ASAP
        },
      },
      {
        onSuccess: () => {
          onSubmitting(false);
          subCompRoadmapAnswerState.refetch();
          onRoadmapSubmitHandler();
        },
      }
    );
  };

  useEffect(() => {
    const answer = subCompRoadmapAnswer as unknown as RoadmapAnswer;

    if (answer) {
      const formattedScale = formattedMeasurementScales.find(
        (scale) => scale.id === answer.measurementScaleId
      );
      setRoadmapAnswerId(answer.id);
      reset({
        startTime: new Date(answer.startTime),
        endTime: new Date(answer.endTime),
        gapAddressed: answer.gapAddressed,
        activities: answer.activities,
        resources: answer.resources,
        responsible: answer.responsible,
        measurementScale: {
          id: formattedScale?.id,
          name: formattedScale?.name,
        },
      });
    } else {
      setRoadmapAnswerId(null);
      reset({
        startTime: new Date(),
        endTime: new Date(),
        gapAddressed: "",
        activities: "",
        resources: "",
        responsible: "",
        measurementScale: { name: "", id: "" },
      });
    }
  }, [
    formattedMeasurementScales,
    subComponent?.id,
    subCompRoadmapAnswer,
    reset,
  ]);

  if (
    isLoading ||
    measurementScalesState.isFetching ||
    subCompAssessmentAnswerState.isFetching ||
    subCompRoadmapAnswerState.isFetching
  )
    return <RoadmapFormSkeleton />;

  return (
    <form
      key={subComponent?.id}
      id={`${SubCompRoadmapFormID}`}
      onSubmit={handleSubmit((v: RoadmapFormData) =>
        onSubmitHandler({
          ...v,
          answerId: (subCompAssessmentAnswer as unknown as Answer).answerId,
        })
      )}
      className="w-full transition-all duration-1000 ease-in-out"
    >
      <div className="flex flex-col w-full h-full p-7 gap-6 border border-basic-300 rounded-lg">
        <span className="text-lg font-bold">{subComponent?.name}</span>

        <p className="text-xs font-medium text-dark-light">
          {subComponent?.description}
        </p>

        <div className="bg-dark-lighter/10 rounded-sm -mx-3 px-3 py-3 gap-4 flex flex-col">
          <span className="text-sm font-medium">Current Score</span>
          <div className="text-sm bg-[#FFFD024F] rounded-sm p-2 w-fit">{`Score: ${(subCompAssessmentAnswer as unknown as Answer)?.measurementScale.rate}`}</div>
        </div>

        <div className="bg-dark-lighter/10 rounded-sm -mx-3 px-3 py-3 flex gap-4">
          <DateTimePickerRHF
            control={control}
            name="startTime"
            label="Start Date"
            labelVariant="medium"
          />
          <DateTimePickerRHF
            control={control}
            name="endTime"
            label="End Date"
            labelVariant="medium"
          />
        </div>

        <RadioGroupRHF<MeasurementScaleType, RoadmapFormData>
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
          name="gapAddressed"
          label="Gap Addressed"
          labelVariant="medium"
          placeholder="Enter gap addressed here"
        />

        <ETMEditorRHF
          control={control}
          name="activities"
          label="Strategic Inactivities / Activities"
          labelVariant="medium"
          placeholder="Enter strategic inactivities / activities here"
        />

        <ETMEditorRHF
          control={control}
          name="responsible"
          label="Who is Responsible"
          labelVariant="medium"
          placeholder="Enter who is responsible here"
        />

        <ETMEditorRHF
          control={control}
          name="resources"
          label="Resources Used"
          labelVariant="medium"
          placeholder="Enter resources used here"
        />

        <div className="flex flex-col gap-2">
          {(subCompRoadmapAnswer as unknown as RoadmapAnswer)?.documentUrl && (
            <a
              href={
                (subCompRoadmapAnswer as unknown as RoadmapAnswer)?.documentUrl
              }
              target="_blank"
              className="w-fit flex flex-col gap-1 items-center cursor-pointer"
            >
              <Icon icon="proicons:document" className="w-8 h-8" />
              <span className="text-xs font-bold hover:underline">
                Document
              </span>
            </a>
          )}
          <RoadmapDocUpload
            roadmapAnswerId={roadmapAnswerId}
            refetchAnswer={subCompRoadmapAnswerState.refetch}
          />
        </div>
      </div>
    </form>
  );
}
