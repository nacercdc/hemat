import React from "react";

interface Value {
  point: number;
  code: string;
}

interface Answer {
  evaluation: string;
  desc: string;
  value: Value[];
}

interface SubComponent {
  name: string;
  answer: Answer[];
}

interface Component {
  component_name: string;
  component_code: string;
  sub_component: SubComponent[];
}
interface Props {
  components: Component[];
}

export default function DomainComponent({ components }: Props) {
  return (
    <div className="flex flex-col gap-4 bg-dark-lighter/5 rounded-sm p-4">
      <div className="flex gap-2 items-center  ">
        <h1 className="font-bold text-sm">1.A.1 Component One </h1>
        <span className="px-3 py-1  bg-primary  font-bold text-sm text-white rounded-sm">
          5
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-sm">Evidence </h1>
        <p className="text-xs">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam a
          fuga unde, deserunt tempora eum quas autem voluptates obcaecati nam
          minus molestiae placeat doloribus error, perferendis veniam at amet
          minima.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-semibold text-sm">Reference </h1>
        <p className="text-xs">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam a
          fuga unde, deserunt tempora eum quas autem voluptates obcaecati nam
          minus molestiae placeat doloribus error, perferendis veniam at amet
          minima.
        </p>
      </div>
    </div>
  );
}
