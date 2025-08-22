import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";

interface Props {
  title: string;
  content: string;
}

export default function Collapsible({ title, content }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-x-4 border-sky-500  bg-white rounded-sm flex flex-col gap-4">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center cursor-pointer px-4 py-2 hover:bg-gray-50"
      >
        <h3 className="font-semibold">{title}</h3>
        <span className="text-xl">
          {isOpen ? (
            <Icon
              icon="material-symbols:check-indeterminate-small-rounded"
              className="!w-[20px] !h-[20px]"
            />
          ) : (
            <Icon icon="material-symbols:add" className="!w-[20px] !h-[20px]" />
          )}
        </span>
      </div>

      <div
        className={`px-4 text-sm overflow-hidden transition-all duration-600 ease-in-out ${
          isOpen ? "max-h-40 pb-3" : "max-h-0 pb-0"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
