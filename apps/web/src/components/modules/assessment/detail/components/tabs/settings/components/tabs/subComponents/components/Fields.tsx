import { InputRHF, TextAreaRHF, Accordion } from "@etm/web-ui-components";
import type { Language } from "~/libs/models/language.model";
import type { Control, FieldErrors, UseFormWatch } from "react-hook-form";
import type { SubComponentFormData } from "./Content";

interface FieldConfig {
  key: "code" | "name" | "description";
  label: string;
  placeholder: (lang: Language) => string;
  Component: typeof InputRHF | typeof TextAreaRHF;
  props: Record<string, unknown>;
}

interface Props {
  control: Control<SubComponentFormData>;
  selectedLanguages: Language[];
  watch: UseFormWatch<SubComponentFormData>;
  errors: FieldErrors<SubComponentFormData>;
}

export function Fields({ control, selectedLanguages, watch, errors }: Props) {
  const fields: FieldConfig[] = [
    {
      key: "code",
      label: "Code",
      placeholder: (lang) =>
        `Write code in ${lang.name || lang.native || lang.code}`,
      Component: InputRHF,
      props: { size: "xl", labelVariant: "bold" },
    },
    {
      key: "name",
      label: "Name",
      placeholder: (lang) =>
        `Write name in ${lang.name || lang.native || lang.code}`,
      Component: InputRHF,
      props: { size: "xl", labelVariant: "bold" },
    },
    {
      key: "description",
      label: "Description",
      placeholder: (lang) =>
        `Write description in ${lang.name || lang.native || lang.code}`,
      Component: TextAreaRHF,
      props: { rows: 4, labelVariant: "bold" },
    },
  ];

  return (
    <>
      {fields.map(({ key, label, placeholder, Component, props }) => (
        <Accordion
          key={key}
          items={[
            {
              value: `${key}-translations`,
              trigger: (
                <div className="flex items-center gap-12 w-full font-medium">
                  <span className="text-sm text-dark-light min-w-12">
                    {label}
                  </span>
                  <span className="text-xs justify-start">
                    {watch(
                      `translations.${selectedLanguages[0]?.code || "en"}.${key}`
                    )}
                  </span>
                </div>
              ),
              content: (
                <div className="flex flex-col gap-4 bg-basic-200/30 border border-t-0 border-basic-300 rounded-b-lg px-6 py-4">
                  {selectedLanguages.map((lang) => (
                    <div
                      key={lang.code}
                      className="flex items-start justify-between py-2 gap-12"
                    >
                      <div className="text-sm font-medium min-w-12">{`${lang.code.toUpperCase()}:`}</div>
                      <div className="flex-1">
                        <Component
                          control={control}
                          name={`translations.${lang.code}.${key}`}
                          placeholder={placeholder(lang)}
                          {...props}
                          error={
                            errors.translations?.[lang.code]?.[key]?.message
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
          type="single"
          collapsible={true}
        />
      ))}
    </>
  );
}
