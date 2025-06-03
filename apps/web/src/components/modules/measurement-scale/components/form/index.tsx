"use client";

import {
  Button,
  ColorPickerRHF,
  InputRHF,
  TextAreaRHF,
} from "@etm/web-ui-components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Scale } from "~/libs/models/scale.model";

const ScaleFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  rate: z.number().min(1, { message: "Rate is required" }),
  color: z.string().min(1, { message: "Color is required" }),
  description: z.string().min(1, { message: "Description is required" }),
});

export type ScaleFormData = z.infer<typeof ScaleFormSchema>;

interface Props {
  onSubmitScaleFormHandler: (values: ScaleFormData) => void;
  onCancelScaleFormHandler?: () => void;
  isLoading?: boolean;
  scale?: Scale;
}

export function ScaleForm({
  onSubmitScaleFormHandler,
  onCancelScaleFormHandler,
  isLoading = false,
  scale,
}: Props) {
  const { control, handleSubmit, reset } = useForm<ScaleFormData>({
    defaultValues: {
      name: scale?.name ?? "",
      rate: scale?.rate ?? 0,
      color: scale?.color ?? "",
      description: scale?.description ?? "",
    },
    resolver: zodResolver(ScaleFormSchema),
    mode: "onChange",
  });

  const onCancelHandler = () => {
    onCancelScaleFormHandler?.();
    reset();
  };

  if (isLoading) {
    return <div>Loading...</div>; // TODO replace this with a proper skeleton component if available
  }

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmitScaleFormHandler(values);
        reset();
      })}
      className="flex flex-col w-full  min-h-96 md:min-h-[557px] bg-card rounded-xl relative"
    >
      <div className="text-xl font-bold px-8 pt-8">{`${scale ? "Edit" : "Add"} Measurement Scale`}</div>
      <div className="flex flex-col gap-6 px-8 flex-1 pb-20 w-full">
        <InputRHF<ScaleFormData>
          control={control}
          name="name"
          label="Name"
          placeholder="Write Name"
          size="xl"
          labelVariant="bold"
        />
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <InputRHF<ScaleFormData>
            control={control}
            name="rate"
            label="Rate"
            placeholder="Write Rate"
            size="xl"
            labelVariant="bold"
          />
          <ColorPickerRHF<ScaleFormData>
            control={control}
            name="color"
            defaultValue="#435ff3"
            size="xl"
            label="Color"
            labelVariant="bold"
          />
        </div>
        <TextAreaRHF<ScaleFormData>
          control={control}
          name="description"
          label="Description"
          placeholder="Write Description..."
          labelVariant="bold"
          rows={4}
        />
      </div>
      <div className="flex justify-between items-center w-full bg-layout-bg p-4 rounded-b-lg px-8 mt-auto">
        <Button
          variant="outline"
          color="card"
          type="button"
          onClick={onCancelHandler}
        >
          Cancel
        </Button>
        <Button size="lg" type="submit">
          {scale ? "Edit" : "Save"}
        </Button>
      </div>
    </form>
  );
}
