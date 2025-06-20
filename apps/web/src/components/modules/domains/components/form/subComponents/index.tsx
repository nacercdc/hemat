"use client";

import React, { useState } from "react";
import type { DefaultFieldsFormData } from "./DefaultFieldsForm";
import { DefaultFieldsForm } from "./DefaultFieldsForm";
import type { ScalesFormData } from "./ScalesForm";
import { ScalesForm } from "./ScalesForm";
import type { ListItemType } from "../../..";
import type { Language } from "~/libs/models/language.model";

interface Props {
  loading?: boolean;
  item?: ListItemType;
  onCloseModal?: () => void;
  createdSubComponentId?: string | null;
  onScalesSubmit: (data: ScalesFormData) => void;
  onDefaultFieldsSubmit: (data: DefaultFieldsFormData) => void;
}

export function SubComponentForm({
  item,
  loading,
  onCloseModal,
  onScalesSubmit,
  onDefaultFieldsSubmit,
  createdSubComponentId,
}: Props) {
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>([]);

  const onLanguageSelect = (langs: Language[]) => {
    console.log(langs, "Trigerr");
    setSelectedLanguages(langs);
  };

  console.log(createdSubComponentId, "First");
  console.log(selectedLanguages, "Selected Languages");

  return (
    <div className="flex flex-col gap-2 w-full max-h-[700px] overflow-y-auto">
      <DefaultFieldsForm
        item={item}
        onSubmit={onDefaultFieldsSubmit}
        onCloseModal={onCloseModal}
        onLanguageSelect={onLanguageSelect}
        loading={loading}
      />
      <ScalesForm
        loading={loading}
        onCloseModal={onCloseModal}
        // selectedLanguages={selectedLanguages}
        onSubmit={onScalesSubmit}
        createdSubComponentId={createdSubComponentId}
      />
    </div>
  );
}
