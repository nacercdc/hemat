"use client";

import { Button, InputRHF } from "@etm/web-ui-components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Language } from "~/libs/models/language.model";

const LanguageFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  code: z
    .string()
    .min(2, { message: "Code must be at least 2 characters" })
    .max(10, { message: "Code must be at most 10 characters" })
    .refine((val) => !/\s/.test(val), {
      message: "Code must not contain spaces",
    }),
  native: z.string().min(1, { message: "Native is required" }),
});

export type LanguageFormData = z.infer<typeof LanguageFormSchema>;

interface Props {
  onSubmitLanguageForm: (values: LanguageFormData) => void;
  onCancelLanguageForm?: () => void;
  isLoading?: boolean;
  language?: Language;
}

export function LanguageForm({
  onSubmitLanguageForm,
  onCancelLanguageForm,
  isLoading = false,
  language,
}: Props) {
  const { control, handleSubmit, reset } = useForm<LanguageFormData>({
    defaultValues: {
      name: language?.name ?? "",
      code: language?.code ?? "",
      native: language?.native ?? "",
    },
    resolver: zodResolver(LanguageFormSchema),
    mode: "all",
  });

  const onCancelHandler = () => {
    onCancelLanguageForm?.();
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmitLanguageForm(values);
        reset();
      })}
      className="flex flex-col w-full min-h-20 bg-card rounded-xl relative"
    >
      <div className="text-xl font-bold px-8 pt-8 mb-6">{`${language ? "Edit" : "Add"} Language`}</div>
      <div className="flex flex-col gap-6 px-8 flex-1 py-8 w-full">
        <InputRHF<LanguageFormData>
          control={control}
          name="name"
          label="Name"
          placeholder="Write Name"
          size="xl"
          labelVariant="bold"
        />
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <InputRHF<LanguageFormData>
            control={control}
            name="code"
            label="Code"
            placeholder="Write code"
            size="xl"
            labelVariant="bold"
          />
        </div>
        <InputRHF<LanguageFormData>
          control={control}
          name="native"
          label="Native"
          placeholder="Write native"
          size="xl"
          labelVariant="bold"
        />
      </div>
      <div className="flex justify-between items-center w-full bg-layout-bg p-4 rounded-b-lg px-8 mt-auto">
        <Button variant="outline" type="button" onClick={onCancelHandler}>
          Cancel
        </Button>
        <Button size="lg" type="submit" loading={isLoading}>
          {language ? "Edit" : "Save"}
        </Button>
      </div>
    </form>
  );
}
