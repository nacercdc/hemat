import React from "react";
import { cn } from "../../shadcn-ui/utils/cn";

export type PasswordIncludeType =
  | "LowerCase"
  | "UpperCase"
  | "Number"
  | "SpecialChar";

export const checkPasswordStrength = (
  password: string,
  minLength = 8,
  mustIncludeTypes: PasswordIncludeType[] = []
) => {
  let score = 0;

  const hasMinimumLength = password.length >= minLength;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
    password
  );

  if (hasMinimumLength) score += 1;
  if (mustIncludeTypes.includes("UpperCase") && hasUppercase) score += 1;
  if (mustIncludeTypes.includes("LowerCase") && hasLowercase) score += 1;
  if (mustIncludeTypes.includes("Number") && hasNumbers) score += 1;
  if (mustIncludeTypes.includes("SpecialChar") && hasSpecialChars) score += 1;

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
    <div className="flex items-center gap-2">
      {Array.from({ length: mustIncludeTypes.length + 1 }).map((_, index) => (
        <div
          key={index + 1}
          className={cn(
            "flex-1 h-2 w-14 rounded-full",
            index + 1 <=
              checkPasswordStrength(password, minLength, mustIncludeTypes)
              ? "bg-success-400"
              : "bg-white"
          )}
        ></div>
      ))}
    </div>
  );
}
