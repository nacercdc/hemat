"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  ETMEditorRHF,
  InputRHF,
  isHtmlStringEmpty,
  useOutsideClick,
  useToast,
} from "@etm/web-ui-components";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useAddMutation } from "~/libs/tanstack-api-query/hooks/useAddMutation";
import type { CreateSupport, Support } from "~/libs/models/support.model";
import { queryClient } from "~/providers/tanstack-react-query/TanstackReactQueryProvider";

const supportSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().superRefine((data, ctx) => {
    if (isHtmlStringEmpty(data)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Description is required.",
      });
    }
  }),
});

export type SupportFormData = z.infer<typeof supportSchema>;
interface Props {
  onClose: () => void;
}
export default function HelpSupportWidget({ onClose }: Props) {
  const { toast } = useToast();

  const widgetRef = useRef<HTMLDivElement>(null);

  useOutsideClick(onClose, widgetRef);

  const { control, handleSubmit } = useForm<SupportFormData>({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: zodResolver(supportSchema),
    mode: "all",
  });

  const { mutate: createSupport, ...createSupportState } = useAddMutation<
    Support,
    CreateSupport
  >("support");

  const onSubmitHandler = ({ title, description }: SupportFormData) => {
    createSupport(
      {
        data: { title, description },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            message: "Support has been created successfully!",
            variant: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["/support"] });
        },
      }
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={widgetRef}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-32 right-6 w-[400px] bg-white rounded-md shadow-xl p-6 z-50 border-[0.5px] border-success/50"
      >
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <h2 className="text-lg font-semibold mb-4">Support</h2>
          <div className="flex flex-col gap-4">
            <InputRHF
              control={control}
              name="title"
              label="Title"
              placeholder="Title"
            />

            <ETMEditorRHF
              control={control}
              name="description"
              label="Description"
              placeholder="Description"
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button type="submit" loading={createSupportState.isPending}>
              Submit
            </Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
