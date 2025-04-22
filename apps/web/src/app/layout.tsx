import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "~/app/styles.css";
import { Providers } from "~/providers";
import { cn } from "~/utils/cn.util";
import { Toaster } from "@etm/web-ui-components";
import { constructMetadata } from "~/utils/metadata.util";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["900", "800", "700", "600", "500", "400", "300", "200", "100"],
  variable: "--font-poppins",
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
        className={cn("min-h-screen antialiased", poppins.className)}
        suppressHydrationWarning
      >
        <Providers>{props.children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
