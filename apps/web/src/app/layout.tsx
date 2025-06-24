import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "~/app/styles.css";
import { Providers } from "~/providers";
import { cn } from "~/utils/cn.util";
import { Toaster } from "@etm/web-ui-components";
import { constructMetadata } from "~/utils/metadata.util";
import HelpSupportButton from "~/components/modules/support/components/button";

const inter = Inter({
  subsets: ["latin"],
  weight: ["900", "700", "500", "400", "300", "100"],
  display: "swap",
  variable: "--font-roboto",
});

export function generateMetadata(): Metadata {
  return constructMetadata({
    title: "Yarn monorepo starter",
    description: "Yarn monorepo starter",
    path: `/`,
  });
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          `${inter.variable}`,
          "min-h-screen antialiased w-full bg-layout-bg font-roboto text-dark p-0 overflow-hidden relative"
        )}
        suppressHydrationWarning
      >
        <Providers>{props.children}</Providers>
        <Toaster />
        <HelpSupportButton />
      </body>
    </html>
  );
}
