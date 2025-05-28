import { Button, ColorPicker, Input, TextArea } from "@etm/web-ui-components";
import { useState } from "react";

export function ScaleForm() {
  const [color, setColor] = useState<string>();
  return (
    <div className="flex flex-col w-96 md:w-[744px] h-96 md:h-[557px] bg-card rounded-xl  overflow-y-auto md:overflow-y-hidden gap-10">
      <div className="text-xl font-bold px-8 pt-8">Add Measurement Scale</div>
      <form className="flex flex-col gap-6 px-8">
        <Input
          name="name"
          label={"Name"}
          placeholder="Write Name"
          size="xl"
          labelVariant="bold"
        />
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <Input
            name="rate"
            label={"Rate"}
            placeholder="Write Rate"
            size="xl"
            labelVariant="bold"
          />
          <ColorPicker
            onChange={(color) => setColor(color)}
            value={color}
            defaultValue="#435ff3"
            size="xl"
            label="Color"
            labelVariant="bold"
          />
        </div>
        <TextArea
          name="description"
          label={"Description"}
          placeholder="Write Description..."
          labelVariant="bold"
          rows={4}
        />
      </form>
      <div className="flex justify-between items-center w-full bg-layout-bg p-4 rounded-b-lg px-8">
        <Button variant="outline" color="card">
          Cancel
        </Button>
        <Button size="lg">Save</Button>
      </div>
    </div>
  );
}
