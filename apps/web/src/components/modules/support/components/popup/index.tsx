"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Button,
  ETMEditorRHF,
  InputRHF,
  isHtmlStringEmpty,
  useOutsideClick,
} from "@etm/web-ui-components";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";

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

type SupportFormData = z.infer<typeof supportSchema>;
interface Props {
  onClose: () => void;
}
export default function HelpSupportWidget({ onClose }: Props) {
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

  const onSubmitHandler = (_values: SupportFormData) => {
    // Send data to API here...
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
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
