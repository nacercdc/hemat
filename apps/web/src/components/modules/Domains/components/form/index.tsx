"use client";

import React, { useEffect } from "react";
import { z } from "zod";

import type { ListItemType, ListTypeLabel } from "../..";
import { useForm } from "react-hook-form";
import { Button, InputRHF, TextAreaRHF } from "@etm/web-ui-components";
import { zodResolver } from "@hookform/resolvers/zod";

const ItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().min(1, "Description is required"),
});
export type ItemFormData = z.infer<typeof ItemSchema>;

interface Props {
  type: ListTypeLabel;
  item?: ListItemType;
  onSubmitHandler: (data: ItemFormData) => void;
  onCloseModal?: () => void;
}

export function DomainComponentForm({
  item,
  onSubmitHandler,
  onCloseModal,
}: Props) {
  const { control, handleSubmit, reset } = useForm<ItemFormData>({
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
    resolver: zodResolver(ItemSchema),
  });

  useEffect(() => {
    if (item) {
      reset(item);
    }
  }, [item, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className="flex flex-col gap-6 w-full"
    >
      <div className="flex flex-col gap-4 p-4 px-7">
        <InputRHF
          control={control}
          name="name"
          size="lg"
          label="Name"
          labelVariant="bold"
        />
        <InputRHF
          control={control}
          name="code"
          size="lg"
          label="Code"
          labelVariant="bold"
        />
        <TextAreaRHF
          control={control}
          name="description"
          label="Description"
          labelVariant="bold"
          rows={8}
        />
      </div>
      <div className="bg-primary-50">
        <div className="flex items-center justify-between p-4 px-7">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onCloseModal}
          >
            Cancel
          </Button>
          <Button type="submit" size="lg">
            {item ? "Edit" : "Add"}
          </Button>
        </div>
      </div>
    </form>
  );
}
