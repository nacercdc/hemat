import { env } from "~/env";
import type { SiteConfig } from "~/types/site-config.type";

export const BASE_URL = env.NEXT_PUBLIC_HOST_URL;

const EMAIL_URL = "mailto:info@etmsoftwareplc.com";

export const siteConfig: SiteConfig = {
  name: "yarn-monorepo-starter",
  tagLine: "Yarn Monorepo Starter",
  description: "Yarn monorepo starter",
  url: BASE_URL,
  authors: [
    {
      name: "ETM Software PLC",
      url: "https://emtsoftwareplc.com",
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
    icon: "/favicon.ico",
  },
};
