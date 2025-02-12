import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import "~/app/styles.css";
import { Providers } from "~/providers";
import { cn } from "~/utils/cn.util";
import { Toaster } from "@e-market/web-ui-components";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["900", "800", "700", "600", "500", "400", "300", "200", "100"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "E-market",
  description: "E-market dashboard",
  openGraph: {
    title: "E-market",
    description: "E-market dashboard",
    url: "https://etmsoftwareplc.com",
    siteName: "E-market",
  },
};

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
