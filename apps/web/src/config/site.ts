import { env } from "~/env";
import type { SiteConfig } from "~/types/site-config.type";

export const BASE_URL = env.NEXT_PUBLIC_BASE_URL ?? "";

const EMAIL_URL = "mailto:info@etmsoftwareplc.com";

export const siteConfig: SiteConfig = {
  name: "case-tracking",
  tagLine: "Case tracking",
  description: "Case tracking",
  url: BASE_URL,
  authors: [
    {
      name: "ETM Software PLC",
      url: "https://etmsoftwareplc.com",
    },
  ],
  creator: "@etmsoftwareplc",
  socialLinks: {
    email: EMAIL_URL,
    bluesky: "",
    github: "",
    twitter: "",
  },

  icons: {
    icon: "/icon.png",
  },
};
