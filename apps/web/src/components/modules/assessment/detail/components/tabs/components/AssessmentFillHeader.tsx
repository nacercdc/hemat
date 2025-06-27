"use client";
import { Select } from "@etm/web-ui-components";
import { useFindAll } from "~/libs/tanstack-api-query/hooks/useFindAll";
import React from "react";
import { QueryManyResponse } from "~/libs/tanstack-api-query/helpers/types";
import { Language } from "~/libs/models/language.model";

interface Props {
  title: string;
  subTitle: string;
}

export default function AssessmentFillHeader({ title, subTitle }: Props) {
  const onSelectLanguageHandler = (_name?: Language) => {
    //TODO: Implement filtering the domains based on the selected language  for the group
  };
  const { data: languages, ...languagesState } = useFindAll<
    QueryManyResponse<Language>
  >({
    path: "/languages",
  });
  return (
    <div className="flex items-center justify-between w-full h-16 rounded-lg bg-basic-200 px-3 py-3">
      <div className="flex flex-col items-start gap-1">
        <span className="text-sm font-bold">{title}</span>
        <span className="text-xs font-normal">{subTitle}</span>
      </div>

      <div className="flex gap-4 items-center justify-center">
        <Select<Language>
          placeholder="Language"
          options={(languages?.data as unknown as Language[]) ?? []}
          valueKey="name"
          labelKey="name"
          onSelect={onSelectLanguageHandler}
          size="md"
        />
      </div>
    </div>
  );
}
