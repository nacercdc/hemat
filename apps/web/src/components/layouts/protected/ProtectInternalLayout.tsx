import { redirect } from "next/navigation";
import { headers } from "next/headers";
import type { ReactNode } from "react";
import { env } from "~/env";
import type { User } from "~/providers/fetch-me/fetch-context.type";
import { auth } from "~/utils/auth.util";
import { X_INVOKE_PATH } from "~/constants";
import type { UseFindByIdQueryResult } from "~/libs/tanstack-api-query/hooks/useFindById";

export enum OnboardingStep {
  REGISTRATION = "registration",
  VERIFICATION = "verification",
  COMPANY_INFO = "company-info",
}

export const onboardingRoutes: Record<OnboardingStep, string> = {
  [OnboardingStep.REGISTRATION]: "/registration",
  [OnboardingStep.VERIFICATION]: "/email/verify",
  [OnboardingStep.COMPANY_INFO]: "/company-information",
};

interface Props {
  children: ReactNode;
}

export default async function ProtectInternalLayout({ children }: Props) {
  const session = await auth();

  const response = await fetch(`${env.NEXT_PUBLIC_HOSTNAME}me`, {
    headers: { Authorization: `Bearer ${session?.access_token}` },
  });

  if (!response.ok) redirect("/login");

  const currentUser = (await response.json()) as UseFindByIdQueryResult<User>;
  const currentPath = headers().get(X_INVOKE_PATH) || "";

  if (currentUser.data.is_onboarding) {
    const nextStep = currentUser.data.onboarding.next_step as OnboardingStep;
    const targetPath = onboardingRoutes[nextStep];

    if (currentPath !== targetPath) {
      redirect(targetPath);
    }
  } else {
    const isOnboardingRoute =
      Object.values(onboardingRoutes).includes(currentPath);
    if (isOnboardingRoute) {
      redirect("/");
    }
  }

  return <>{children}</>;
}
