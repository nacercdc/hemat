/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client";

import React, { useEffect } from "react";
import { PageContainer } from "../../components/PageContainer";
import { useParams, useRouter } from "next/navigation";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import { z } from "zod";
import {
  Badge,
  ETMEditorRHF,
  isHtmlStringEmpty,
  Skeleton,
} from "@etm/web-ui-components";
import { ReplayForm } from "./components/forms";
import { AnimatedCounter } from "../../home/components/hero-section/AnimatedCounter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StatusEnum } from "~/libs/models/support.model";
import { Reply } from "./components/Reply";
import { SupportSkeleton } from "./components/SupportSkeleton";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import { RepliesSkeleton } from "./components/RepliesSkeleton";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { Support, SupportReply } from "~/libs/models/support.model";

const SupportDescriptionSchema = z.object({
  description: z.string().superRefine((data, ctx) => {
    if (isHtmlStringEmpty(data)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description is required.",
      });
    }
  }),
});

type SupportDetailData = z.infer<typeof SupportDescriptionSchema>;

export function SupportDetail() {
  const params = useParams();

  const router = useRouter();

  const { control, reset } = useForm<SupportDetailData>({
    defaultValues: { description: "" },
    resolver: zodResolver(SupportDescriptionSchema),
  });

  const { data: support, ...supportState } = useFindById<
    QueryManyResponse<Support>,
    unknown
  >({
    path: `/support/${params.id}`,
    tqOptions: { queryKey: ["/support"] },
  });

  const { data: supportReplies, ...supportRepliesState } = useFindAll<
    QueryManyResponse<SupportReply>,
    unknown
  >({
    path: `/support/${params.id}/replies`,
    queries: {
      take: 100,
      skip: 1,
    },
    tqOptions: { queryKey: ["/support/replies"], enabled: !!support },
  });

  const { title, description, status } = (support as unknown as Support) || {};

  const replies = (supportReplies?.data as unknown as SupportReply[]) || {};

  const onBackHandler = () => {
    router.back();
  };

  useEffect(() => {
    if (description) {
      reset({ description });
    }
  }, [description, reset]);

  return (
    <PageContainer
      pageTitle={
        <>
          {!supportState.isFetching && <span>{title}</span>}
          {supportState.isFetching && <Skeleton className="w-36 h-6" />}
        </>
      }
      includeBreadcrumb={false}
      onBack={onBackHandler}
    >
      {!supportState.isFetching && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="rounded-sm p-3 flex flex-col gap-3 w-full bg-dark-lighter/10 row-start-2 lg:row-start-1 col-span-full lg:col-span-2">
            <span className="text-sm font-medium">Description</span>
            <ETMEditorRHF
              control={control}
              name="description"
              label=""
              isEnabled={false}
            />
            <ReplayForm
              supportId={params.id as string}
              formKey={new Date().toLocaleDateString()}
              refetch={supportRepliesState.refetch}
            />
            {!supportRepliesState.isLoading &&
              supportRepliesState.isFetching && (
                <RepliesSkeleton single={true} />
              )}
            {Array.isArray(replies) &&
              replies?.map((reply) => <Reply key={reply.id} reply={reply} />)}
            {supportRepliesState.isLoading && <RepliesSkeleton />}
          </div>
          <div className="flex flex-col gap-3 row-start-1 col-span-full lg:col-span-1">
            <div className="flex justify-between items-center rounded-sm  shadow-md p-2 px-4">
              <div className="flex flex-col gap-1 items-center">
                <span className="font-bold text-2xl text-primary">
                  <AnimatedCounter
                    to={replies?.length || 0}
                    from={0}
                    duration={2}
                  />
                </span>
                <span className="text-sm font-medium">Replies</span>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <Badge
                  text={status}
                  variant={
                    status === StatusEnum.CLOSE ? "destructive" : "success"
                  }
                />
                <span className="text-sm font-medium">Status</span>
              </div>
              <div className="flex flex-col gap-1 items-center">
                <Badge text="High" variant="destructive" />
                <span className="text-sm font-medium">Priority</span>
              </div>
            </div>
            <div className="rounded-sm shadow-md font-medium text-sm p-2 px-4">
              Attachment Card Goes Here!!
            </div>
          </div>
        </div>
      )}
      {supportState.isFetching && <SupportSkeleton />}
    </PageContainer>
  );
}
