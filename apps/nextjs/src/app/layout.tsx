import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "~/app/styles.css";

import { cn } from "@etm/ui/shadcn-ui/utils/cn";

const nunito = Nunito({ subsets: ["latin"], weight: ["700", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Yarn monorepo starter",
  description: "Simple monorepo backend and web & mobile apps",
  openGraph: {
    title: "Yarn monorepo starter",
    description: "Simple monorepo backend and web & mobile apps",
    url: "https://etmsoftwareplc.com",
    siteName: "Yarn monorepo starter",
  },
  twitter: {
    card: "summary_large_image",
    site: "@jullerino",
    creator: "@jullerino",
  },
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-card text-primary-foreground antialiased",
          nunito.className,
        )}
        suppressHydrationWarning
      >
        {props.children}
      </body>
    </html>
  );
}
