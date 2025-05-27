import { Button } from "@etm/web-ui-components";

export default function MeasurementScale() {
  return (
    <div className="flex flex-col gap-14 rounded-[6px] p-4 h-[100vh] bg-secondary">
      <div className="flex">
        <div className="text-2xl font-bold">Measurement Scale</div>
        <Button>Add</Button>
      </div>
    </div>
  );
}
