"use client";

import React, { useState } from "react";
import { Select } from "@etm/web-ui-components";
import type { Language } from "~/libs/models/language.model";

interface Props {
  title: string;
  subTitle: string;
  languages: Language[];
  onLanguageChangeHandler?: (lang?: string) => void;
}

export default function AssessmentFillHeader({
  title,
  subTitle,
  languages,
  onLanguageChangeHandler,
}: Props) {
  const [selectedLang, setSelectedLang] = useState<Language | undefined>();

  const onSelectLanguageHandler = (lang?: Language) => {
    setSelectedLang(lang);
    onLanguageChangeHandler?.(lang?.code);
  };

  return (
    <div className="flex items-center justify-between w-full h-16 rounded-lg bg-basic-200 px-3 py-3">
      <div className="flex flex-col items-start gap-1">
        <span className="text-sm font-bold">{title}</span>
        <span className="text-xs font-normal">{subTitle}</span>
      </div>

      <div className="flex gap-4 items-center justify-center">
        <Select<Language>
          placeholder="Language"
          options={languages}
          valueKey="code"
          labelKey="name"
          onSelect={onSelectLanguageHandler}
          value={selectedLang}
          size="md"
        />
      </div>
    </div>
  );
}
