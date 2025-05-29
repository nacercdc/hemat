/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";

import { cn } from "~/utils/cn.util";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@etm/web-ui-components";

export interface Language {
  id: number;
  country: string;
  lang: string;
  code: string;
}

//Temporary dummy languages array
const languages: Language[] = [
  { id: 1, country: "English", lang: "English", code: "US" },
  { id: 2, country: "Spanish", lang: "Espanol", code: "ES" },
  { id: 3, country: "French", lang: "Francais", code: "FR" },
  { id: 4, country: "German", lang: "Deutsch", code: "DE" },
  { id: 5, country: "Italian", lang: "Italiano", code: "IT" },
];

interface Props {
  language?: Language;
  trigger?: (lang: Language | null) => React.ReactNode;
  disabled?: boolean;
}

export function LanguageSelector({
  language,
  trigger,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(
    language ?? languages[0]!
  );

  const onSelectLanguageHandler = (language: Language) => {
    const newValue = selectedLanguage?.code === language.code ? null : language;
    setSelectedLanguage(newValue);
    setOpen(false);
  };

  const LanguageItem = (language?: Language) => (
    <div className="flex items-center gap-2">
      <span className="font-semibold text-xs">
        {language?.code || selectedLanguage?.code}
      </span>
      <div className="flex flex-col gap-0">
        <span className="text-xs font-semibold text-info">
          {language?.lang || selectedLanguage?.lang}
        </span>
        <span className="text-xs text-dark-lighter text-[0.6rem]">
          {language?.country || selectedLanguage?.country}
        </span>
      </div>
    </div>
  );

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (disabled) return;
        setOpen(o);
      }}
    >
      <PopoverTrigger asChild className="flex items-center gap-3">
        <div
          className={cn(
            disabled && "cursor-not-allowed",
            "border border-primary-50 rounded-md"
          )}
        >
          {!trigger && (
            <div className="flex items-center justify-between gap-2 bg-info/5 py-1 px-3 rounded-sm text-xs">
              {selectedLanguage ? (
                LanguageItem()
              ) : (
                <span className="text-dark-light text-xs">
                  Select a language
                </span>
              )}
              <Icon icon={"lucide:chevron-down"} className="h-4 w-4 shrink-0" />
            </div>
          )}
          {trigger?.(selectedLanguage)}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0 border-none shadow-md" align="end">
        <Command>
          <CommandList>
            <CommandEmpty className="px-4 pb-1 pt-2 text-xs text-dark-lighter">
              No Languages
            </CommandEmpty>
            <CommandItem className="data-[selected=true]:bg-transparent">
              <div className="flex flex-col my-0.5 px-2">
                <span className="font-bold text-xs">Languages</span>
                <span className="text-dark-lighter text-[0.6rem]">
                  Select your language
                </span>
              </div>
            </CommandItem>
            <CommandGroup>
              {languages.map((language, index) => {
                return (
                  <CommandItem
                    key={index}
                    value={language.code}
                    onSelect={() => onSelectLanguageHandler(language)}
                    className="w-full items-center flex data-[selected=true]:bg-transparent hover:cursor-pointer"
                  >
                    <div
                      className={cn(
                        "flex items-center justify-between border-info/10 border-[1px] rounded-sm p-2 py-1 gap-16 w-full",
                        selectedLanguage?.code === language.code &&
                          "bg-primary/10 border-primary"
                      )}
                    >
                      {LanguageItem(language)}
                      <Icon
                        icon="lucide:check"
                        className={`ml-2 h-4 w-4 text-dark ${
                          selectedLanguage?.code === language.code
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
