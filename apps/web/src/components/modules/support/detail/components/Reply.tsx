"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Avatar,
  ETMEditorRHF,
  isHtmlStringEmpty,
  Skeleton,
} from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SupportReply } from "~/libs/models/support.model";
import { useFindById } from "~/libs/tanstack-api-query/hooks/useFindById";
import type { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import type { User } from "~/libs/models/user.model";

//TODO: add the rest later
const ReplaySchema = z.object({
  description: z.string().superRefine((data, ctx) => {
    if (isHtmlStringEmpty(data)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Reply is required.",
      });
    }
  }),
});

type ReplayFormData = z.infer<typeof ReplaySchema>;

interface Props {
  reply: SupportReply;
}

export function Reply({ reply }: Props) {
  const { control, reset } = useForm<ReplayFormData>({
    defaultValues: {
      description: "",
    },
    resolver: zodResolver(ReplaySchema),
  });

  const { data: replayedBy, ...replayedByState } = useFindById<
    QueryManyResponse<User>,
    unknown
  >({
    path: `/users/${reply.repliedById}`,
  });

  const { name } = (replayedBy as unknown as User) || {};

  useEffect(() => {
    if (reply) {
      reset({ description: reply.description });
    }
  }, [reply, reset]);

  return (
    <div className="flex flex-col bg-card rounded-sm gap-3 p-4">
      <span className="text-xs font-bold">Reply</span>
      <div className="flex gap-3">
        {!replayedByState.isLoading && (
          <Avatar
            src={"http://path-that-goes-no-where.com"}
            alt="user_profile_image"
            fallback={`${name?.[0] || ""}${name?.split(" ")?.[1]?.[0] || ""}`}
          />
        )}
        {replayedByState.isLoading && (
          <Skeleton className="h-10 w-10 rounded-full" />
        )}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1 text-xs">
            {!replayedByState.isLoading && (
              <span className="font-bold">{name}</span>
            )}
            {replayedByState.isLoading && (
              <Skeleton className="h-3 w-20 rounded-sm" />
            )}
            <span className="text-dark-light">
              {new Date(reply?.createdAt).toLocaleDateString()}
            </span>
          </div>
          <span className="text-xs font-bold text-info-400">
            {reply?.visibility}
          </span>
          <ETMEditorRHF
            control={control}
            label=""
            isEnabled={false}
            name="description"
            noBorder={true}
          />
        </div>
      </div>
    </div>
  );
}
