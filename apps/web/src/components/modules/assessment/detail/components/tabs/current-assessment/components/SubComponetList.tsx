import React from "react";

interface Value {
  point: number;
  code: string;
}

interface Answer {
  assessmentId?: string;
  subComponentId?: string;
  measurementScaleId?: string;
  evidence: string;
  reference: string;
  notes: string;
}

interface SubComponent {
  code: string;
  name: string;
  answer: Answer;
}
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
              5
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-sm">Evidence </h1>
            <p className="text-xs">{list.answer.evidence}</p>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-semibold text-sm">Reference </h1>
            <p className="text-xs">{list.answer.reference}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
