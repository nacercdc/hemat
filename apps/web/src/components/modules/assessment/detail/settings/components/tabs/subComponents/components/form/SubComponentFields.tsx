import { InputRHF, TextAreaRHF, Accordion } from "@etm/web-ui-components";
import type { Language } from "~/libs/models/language.model";
import type { Control, FieldErrors, UseFormWatch } from "react-hook-form";
import type { AssessmentSubComponentFormData } from "./SubComponentsForm";
import { DEFAULT_LANGUAGE_CODE } from "~/constants";

interface FieldConfig {
  key: "code" | "name" | "description";
  label: string;
  placeholder: (lang: Pick<Language, "name" | "code" | "native">) => string;
  Component: typeof InputRHF | typeof TextAreaRHF;
  props: Record<string, unknown>;
}

interface Props {
  control: Control<AssessmentSubComponentFormData>;
  selectedLanguages: Pick<Language, "name" | "code" | "native">[];
  watch: UseFormWatch<AssessmentSubComponentFormData>;
  errors: FieldErrors<AssessmentSubComponentFormData>;
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
              value: `${key}-fields`,
              trigger: (
                <div className="flex min-[400px]:items-center flex-col items-start w-full font-medium min-[400px]:flex-row min-[400px]:gap-12 ">
                  <span className="text-sm text-dark-light min-w-12">
                    {label}
                  </span>
                  <span className="text-xs justify-start">{watch(key)}</span>
                </div>
              ),
              content: (
                <div className="flex flex-col gap-4 bg-basic-200/30 border border-t-0 border-basic-300 rounded-b-lg px-6 py-4">
                  {/* Default Field for English */}
                  <div className="flex-1">
                    <Component
                      control={control}
                      name={key}
                      placeholder={placeholder({
                        code: DEFAULT_LANGUAGE_CODE,
                        name: "English",
                        native: "English",
                      })}
                      labelSize="sm"
                      {...props}
                      error={errors[key]?.message}
                    />
                  </div>
                  {/* Translation Fields for non-English languages */}
                  {selectedLanguages
                    .filter((lang) => lang.code !== DEFAULT_LANGUAGE_CODE)
                    .map((lang) => (
                      <div
                        key={lang.code}
                        className="flex flex-col items-start py-2 min-[400px]:flex-row min-[400px]:gap-12 min-[400px]:justify-between"
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
