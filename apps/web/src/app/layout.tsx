import type { Metadata } from "next";
import { Roboto, Shantell_Sans } from "next/font/google";

import "~/app/styles.css";
import { Providers } from "~/providers";
import { cn } from "~/utils/cn.util";
import { Toaster } from "@etm/web-ui-components";
import { constructMetadata } from "~/utils/metadata.util";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["900", "700", "500", "400", "300", "100"],
  display: "swap",
  variable: "--font-roboto",
});

const shantellSans = Shantell_Sans({
  subsets: ["latin"],
  weight: ["800", "700", "500", "400", "300"],
  display: "swap",
  variable: "--font-shantell-sans",
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
          `${roboto.variable} ${shantellSans.variable}`,
          "min-h-screen antialiased w-full bg-layout-bg font-roboto text-dark"
        )}
        suppressHydrationWarning
      >
        <Providers>{props.children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
