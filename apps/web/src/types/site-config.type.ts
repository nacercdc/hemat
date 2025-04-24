export interface AuthorsConfig {
  name: string;
  url: string;
}

export interface SiteConfig {
  name: string;
  tagLine: string;
  description: string;
  url: string;
  authors: AuthorsConfig[];
  socialLinks: {
    github: string;
    bluesky: string;
    twitter: string;
    email: string;
  };
  creator: string;
  defaultNextTheme?: string;
  icons: {
    icon: string;
    shortcut?: string;
    apple?: string;
  };
}
