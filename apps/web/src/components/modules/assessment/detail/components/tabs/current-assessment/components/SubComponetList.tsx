import React from "react";

interface Value {
  point: number;
  code: string;
}

interface Answer {
  evaluation: string;
  desc: string;
  value: Value;
}

interface SubComponent {
  code: string;
  name: string;
  answer: Answer;
}

// interface Component {
//   component_name: string;
//   component_code: string;
//   sub_component_name: SubComponent[];
// }
interface Props {
  subComponent: SubComponent[];
}

export default function SubComponentList({ subComponent }: Props) {
  return (
    <div>
      {subComponent.map((list) => (
        <div className="flex flex-col gap-4 bg-dark-lighter/5 rounded-sm p-4">
          <div className="flex gap-2 items-center  ">
            <h1 className="font-bold text-sm">
              {list.code} {list.name}
            </h1>
            <span className="px-3 py-1  bg-primary  font-bold text-sm text-white rounded-sm">
              {list.answer.value.point}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-sm">Evidence </h1>
            <p className="text-xs">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              a fuga unde, deserunt tempora eum quas autem voluptates obcaecati
              nam minus molestiae placeat doloribus error, perferendis veniam at
              amet minima.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-sm">Reference </h1>
            <p className="text-xs">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              a fuga unde, deserunt tempora eum quas autem voluptates obcaecati
              nam minus molestiae placeat doloribus error, perferendis veniam at
              amet minima.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
