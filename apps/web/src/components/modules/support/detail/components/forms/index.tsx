"use client";

import React, { useState } from "react";
import { z } from "zod";
import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Button,
  ETMEditorRHF,
  isHtmlStringEmpty,
  SelectRHF,
  useToast,
} from "@etm/web-ui-components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import {
  PriorityEnum,
  StatusEnum,
  VisibilityEnum,
} from "~/libs/models/support.model";
import type { Variants } from "framer-motion";

export const ZVisibilityEnum = z.enum([
  VisibilityEnum.PUBLIC,
  VisibilityEnum.INTERNAL,
]);
export const ZPriorityEnum = z.enum([
  PriorityEnum.HIGH,
  PriorityEnum.NORMAL,
  PriorityEnum.LOW,
]);
export const ZStatusEnum = z.enum([
  StatusEnum.OPEN,
  StatusEnum.PROCESSING,
  StatusEnum.CLOSE,
]);

const VisibilitySchema = z.object(
  {
    label: z.string(),
    value: ZVisibilityEnum,
  },
  { required_error: "Visibility is required" }
);

const PrioritySchema = z.object(
  {
    label: z.string(),
    value: ZPriorityEnum,
  },
  { required_error: "Priority is required" }
);

const StatusSchema = z.object(
  {
    label: z.string(),
    value: ZStatusEnum,
  },
  { required_error: "Status is required" }
);

const ReplayFormSchema = z.object({
  visibility: VisibilitySchema,
  priority: PrioritySchema,
  status: StatusSchema,
  description: z.string().superRefine((data, ctx) => {
    if (isHtmlStringEmpty(data)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description is required.",
      });
    }
  }),
});

type ReplayFormData = z.infer<typeof ReplayFormSchema>;
type Visibility = z.infer<typeof VisibilitySchema>;
type Priority = z.infer<typeof PrioritySchema>;
type Status = z.infer<typeof StatusSchema>;

interface Props {
  supportId: string;
  formKey: string;
  refetch: () => void;
}

export function ReplayForm({ supportId, formKey, refetch }: Props) {
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<ReplayFormData>({
    defaultValues: {
      visibility: { label: "", value: undefined },
      priority: { label: "", value: undefined },
      status: { label: "", value: undefined },
      description: "",
    },
    resolver: zodResolver(ReplayFormSchema),
  });

  const { mutate: reply, ...replayState } = useAddMutation(
    `/support/${supportId}/reply`
  );

  const panelVariants: Variants = {
    hidden: {
      y: "-100%",
      opacity: 0,
      transition: {
        type: "tween",
        duration: 0.4,
        ease: [0.86, 0, 0.07, 1],
      },
    },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.5,
        ease: [0.07, 1, 0.86, 1],
      },
    },
  };

  const onReplaySubmitHandler = (values: ReplayFormData) => {
    const newReplay = {
      description: values.description,
      priority: values.priority.value,
      visibility: values.visibility.value,
      status: values.status.value,
    };

    reply(
      {
        data: newReplay,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Successfully replayed",
            variant: "success",
          });
          reset({
            visibility: { label: "", value: undefined },
            priority: { label: "", value: undefined },
            status: { label: "", value: undefined },
            description: "",
          });
          setIsOpen(false);
          refetch();
        },
      }
    );
  };

  return (
    <div className="overflow-hidden flex flex-col gap-3">
      <div
        className="w-fit rounded-sm text-primary text-sm font-bold flex items-center self-end gap-2 bg-card p-2 py-1.5 cursor-pointer hover:text-primary/85"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Replay</span>
        <motion.div
          animate={{ rotate: isOpen ? -45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Icon icon="iconamoon:send-thin" className="!text-xl" />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={panelVariants}
            className="relative z-0"
          >
            <form
              key={formKey}
              className="bg-card border-[1px] shadow-md border-basic-200 rounded-sm p-3 flex flex-col gap-3"
              onSubmit={handleSubmit(onReplaySubmitHandler)}
            >
              <div className="flex gap-2">
                <SelectRHF<Visibility, ReplayFormData>
                  name="visibility"
                  control={control}
                  labelKey="label"
                  valueKey="value"
                  displayLabel="Visibility"
                  options={[
                    { label: "Internal", value: VisibilityEnum.INTERNAL },
                    { label: "Public", value: VisibilityEnum.PUBLIC },
                  ]}
                  labelVariant="medium"
                />
                <SelectRHF<Priority, ReplayFormData>
                  name="priority"
                  control={control}
                  labelKey="label"
                  valueKey="value"
                  displayLabel="Priority"
                  options={[
                    { label: "High", value: PriorityEnum.HIGH },
                    { label: "Medium", value: PriorityEnum.NORMAL },
                    { label: "Low", value: PriorityEnum.LOW },
                  ]}
                  labelVariant="medium"
                />
                <SelectRHF<Status, ReplayFormData>
                  name="status"
                  control={control}
                  labelKey="label"
                  valueKey="value"
                  displayLabel="Status"
                  options={[
                    { label: "Open", value: StatusEnum.OPEN },
                    { label: "Processing", value: StatusEnum.PROCESSING },
                    { label: "Close", value: StatusEnum.CLOSE },
                  ]}
                  labelVariant="medium"
                />
              </div>
              <ETMEditorRHF
                control={control}
                name="description"
                label="Description"
                placeholder="Description"
              />
              <div className="self-end">
                <Button
                  size="lg"
                  type="submit"
                  loading={replayState.isPending}
                  rightNode={
                    <Icon
                      icon="iconamoon:send-thin"
                      className="text-card text-xs -rotate-45"
                    />
                  }
                >
                  Replay
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
