import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "~/app/globals.css";

import { cn } from "@etm/ui";

const nunito = Nunito({ subsets: ["latin"], weight: ["700", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Create T3 Turbo",
  description: "Simple monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Create T3 Turbo",
    description: "Simple monorepo with shared backend for web & mobile apps",
    url: "https://create-t3-turbo.vercel.app",
    siteName: "Create T3 Turbo",
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
