/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { cn } from "../../shadcn-ui/utils/cn";

export type PasswordIncludeType =
  | "LowerCase"
  | "UpperCase"
  | "Number"
  | "SpecialChar";

export const PasswordIncludeTypeMap: Record<
  PasswordIncludeType,
  { label: string; func: (password: string) => boolean }
> = {
  LowerCase: {
    label: "At least 1 lowercase letter (a-z)",
    func: (password: string) => /[a-z]/.test(password),
  },
  UpperCase: {
    label: "At least 1 uppercase letter (A-Z)",
    func: (password: string) => /[A-Z]/.test(password),
  },
  Number: {
    label: "At least 1 number (0-9)",
    func: (password: string) => /[0-9]/.test(password),
  },
  SpecialChar: {
    label: "At least 1 special character (!@#$%&*, etc.)",
    func: (password: string) =>
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  },
};

const hasMinimumLength = (password: string, minLength: number) =>
  password.length >= minLength;

export const checkPasswordStrength = (
  password: string,
  minLength = 8,
  mustIncludeTypes: PasswordIncludeType[] = []
) => {
  let score = 0;

  if (hasMinimumLength(password, minLength)) score += 1;
  if (
    mustIncludeTypes.includes("UpperCase") &&
    PasswordIncludeTypeMap.UpperCase.func(password)
  )
    score += 1;
  if (
    mustIncludeTypes.includes("LowerCase") &&
    PasswordIncludeTypeMap.LowerCase.func(password)
  )
    score += 1;
  if (
    mustIncludeTypes.includes("Number") &&
    PasswordIncludeTypeMap.Number.func(password)
  )
    score += 1;
  if (
    mustIncludeTypes.includes("SpecialChar") &&
    PasswordIncludeTypeMap.SpecialChar.func(password)
  )
    score += 1;

  score = Math.min(score, 5);

  return score;
};

interface Props {
  password: string;
  minLength?: number;
  mustIncludeTypes?: PasswordIncludeType[];
}

export function PasswordStrengthIndicator({
  password,
  minLength = 8,
  mustIncludeTypes = [],
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: mustIncludeTypes.length + 1 }).map((_, index) => (
        <div className="flex items-center gap-1.5" key={index + 1}>
          <div
            className={cn(
              "h-2.5 w-2.5 rounded-full border-[1px]",
              (index === 0 && hasMinimumLength(password, minLength)) ||
                (index > 0 &&
                  mustIncludeTypes.length > 0 &&
                  PasswordIncludeTypeMap[mustIncludeTypes[index - 1]!].func(
                    password
                  ))
                ? "bg-primary"
                : "bg-white"
            )}
          ></div>
          {index === 0 && (
            <span className="text-xs">{`At least ${minLength} characters long`}</span>
          )}
          {index > 0 && mustIncludeTypes.length > 0 && (
            <span className="text-xs">
              {PasswordIncludeTypeMap[mustIncludeTypes[index - 1]!].label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
