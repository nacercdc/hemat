"use client";

import {
  Button,
  DateTimePickerRHF,
  Input,
  SelectRHF,
  TextArea,
} from "@etm/web-ui-components";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageContainer } from "~/components/modules/components/PageContainer";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
interface Country {
  code: string;
  name: string;
}
interface Language {
  code: string;
  name: string;
}

interface Assessment {
  id?: string;
  name: string;
  createdBy: string;
  country: Country;
  organization: string;
  description: string;
  startDate: Date;
  endDate: Date;
  language: Language;
}

const AssessmentFormSchema = z.object({
  name: z.string(),
  createdBy: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  country: z.object({
    code: z.string(),
    name: z.string(),
  }),
  organization: z.string(),
  language: z.object({
    code: z.string(),
    name: z.string(),
  }),
});
type AssessmentFormData = z.infer<typeof AssessmentFormSchema>;

export function AssessmentsCreate() {
  const { control, handleSubmit, reset } = useForm<Assessment>({
    resolver: zodResolver(AssessmentFormSchema),
    defaultValues: {
      name: "",
      createdBy: "",
      startDate: new Date(),
      endDate: new Date(),
      country: { code: "", name: "" },
      organization: "",
      language: { code: "", name: "" },
      description: "",
    },
  });

  const router = useRouter();
  return (
    <PageContainer>
      <div className="font-bold  bg-white shadow-md  flex items-start gap-8 -mx-4 -mt-4 pl-4 justify-start">
        <span className="p-2 bg-layout-bg rounded-full cursor-pointer">
          <Icon
            icon="mdi:chevron-left"
            className={`text-2xl  rounded-full font-bold  text-secondary cursor-pointer`}
            onClick={() => {
              router.push("/assessment");
            }}
          />
        </span>
        <h1 className="text-lg flex items-center p-2">Create New Assessment</h1>
      </div>
      <div className="flex flex-col w-96 md:w-[744px]  rounded-xl  overflow-y-auto  mx-auto bg-layout-bg">
        <form
          className="flex flex-col gap-6 px-8 pt-8"
          onSubmit={handleSubmit(() => {
            // onSubmitScaleFormHandler(values);
            reset();
          })}
        >
          <Input
            name="name"
            label={"Assessment Name"}
            placeholder="Write Name"
            size="xl"
            labelVariant="bold"
          />

          <Input
            name="createdBy"
            label={"Created by Name"}
            placeholder="Created by Name"
            size="xl"
            labelVariant="bold"
          />

          <div className="xl:col-start-2 col-start-1 flex gap-2">
            <DateTimePickerRHF
              control={control}
              name="startDate"
              label="Start Date"
              labelVariant="bold"
              size="xl"
              showTime={false}
              iconDirection="right"
              placeholder="Select start date"
            />
            <DateTimePickerRHF
              control={control}
              name="endDate"
              label="End Date"
              size="xl"
              showTime={false}
              iconDirection="right"
              placeholder="Select end date"
              labelVariant="bold"
            />
          </div>
          <SelectRHF<Country, AssessmentFormData>
            control={control}
            name="country"
            labelKey="name"
            valueKey="code"
            displayLabel="Country"
            labelVariant="bold"
            size="xl"
            options={[
              {
                code: "ETH",
                name: "Ethiopan",
              },
              {
                code: "EGE",
                name: "fsfsf",
              },
            ]}
          />
          <Input
            name="organization"
            label={"Organization(Optional)"}
            placeholder="Organization Name"
            size="xl"
            labelVariant="bold"
          />

          <SelectRHF<Language, AssessmentFormData>
            control={control}
            name="language"
            labelKey="name"
            valueKey="code"
            displayLabel="Language"
            labelVariant="bold"
            size="xl"
            options={[
              {
                code: "ETH",
                name: "Ethiopan",
              },
              {
                code: "EGE",
                name: "fsfsf",
              },
            ]}
          />

          <TextArea
            name="description"
            label={"Description"}
            placeholder="Write Description..."
            labelVariant="bold"
            rows={4}
          />
        </form>
        <div className="flex justify-between items-center w-full bg-layout-bg p-4 rounded-b-lg px-8">
          <Button variant="outline" color="lightGray">
            {" "}
            Cancel{" "}
          </Button>
          <Button size="lg">Save</Button>
        </div>
      </div>
    </PageContainer>
  );
}
