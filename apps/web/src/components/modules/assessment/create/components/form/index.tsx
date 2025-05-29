import { Button, DateTimePickerRHF, Input, SelectRHF, TextArea } from "@etm/web-ui-components";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Country {
  code: string;
  name: string;
}

interface Assesment {
  id?: string;
  name: string;
  country: Country
}

const AssesmentFormSchema = z.object({
  name: z.string(),
  country: z.object(
    {
      code: z.string(),
      name: z.string()

    }
  )
})
type AssesmentFormData = z.infer<typeof AssesmentFormSchema>

export function CreateAssesmsntForm() {
  const [color, setColor] = useState<string>();
  const { control, handleSubmit, reset } = useForm<Assesment>({})
  const [date, setDate] = React.useState<Date>()
  return (
    <div className="flex flex-col w-96 md:w-[744px] h-96 md:h-[557px] bg-card rounded-xl  overflow-y-auto md:overflow-y-hidden gap-10">
      <div className="text-xl font-bold px-8 pt-8">Add New Assesment</div>
      <form className="flex flex-col gap-6 px-8">
        <Input
          name="name"
          label={"Assesment Name"}
          placeholder="Write Name"
          size="md"
          labelVariant="bold"
        />
        <SelectRHF<Country, AssesmentFormData >
          control={control}
          name="country"
          labelKey="name"
          valueKey="code"
          displayLabel="Country"
          options={[
            {
              code: "ETH",
              name: "Ethiokdfjfo"
            }
            , {
              code: "EGE",
              name: "fsfsf"
            }

          ]}

        />

        <div className="xl:col-start-2 col-start-1 flex flex-col gap-2">
          <DateTimePickerRHF
            control={control}
            name="billDate"
            label="Bill Date"
            size="xl"
            showTime={false}
            iconDirection="right"
            placeholder="Select bill date"
            labelVariant="medium"
          />
          <DateTimePickerRHF
            control={control}
            name="dueDate"
            label="Due Date"
            size="xl"
            showTime={false}
            iconDirection="right"
            placeholder="Select due date"
            labelVariant="medium"
          />
        </div>

        {/* <Select /> */}

        {/* <Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select> */}

        <TextArea
          name="description"
          label={"Description"}
          placeholder="Write Description..."
          labelVariant="bold"
          rows={4}
        />
      </form>
      <div className="flex justify-between items-center w-full bg-layout-bg p-4 rounded-b-lg px-8">
        <Button variant="outline"> Cancel </Button>
        <Button size="lg">Save</Button>
      </div>
    </div>
  );
}