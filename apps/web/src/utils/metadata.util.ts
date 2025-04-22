import type { Metadata } from "next";
import { siteConfig } from "~/config/site";

interface MetadataProps {
  page?: string;
  title?: string;
  description?: string;
  images?: string[];
  noIndex?: boolean;
  path?: string;
  canonicalUrl?: string;
}

export function constructMetadata({
  page = "Home",
  title,
  description,
  images = [],
  noIndex = false,
  canonicalUrl,
}: MetadataProps): Metadata {
  // get page specific metadata translations
  const pageTitle = title;
  const pageDescription = description;

  // build full title
  const finalTitle = page === "Home" ? `Home ` : `${pageTitle} `;

  // build image URLs
  const imageUrls =
    images.length > 0
      ? images.map((img) => ({
          url: img.startsWith("http") ? img : `${siteConfig.url}${img}`,
          alt: pageTitle,
        }))
      : [
          {
            url: `${siteConfig.url}/og.png`,
            alt: pageTitle,
          },
        ];

  // Open Graph Site
  const pageURL = siteConfig.url;

  return {
    title: finalTitle,
    description: pageDescription,
    keywords: [],
    authors: siteConfig.authors,
    creator: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl ? `${siteConfig.url}${canonicalUrl}` : undefined,
    },
    openGraph: {
      type: "website",
      title: finalTitle,
      description: pageDescription,
      url: pageURL,
      siteName: title,
      images: imageUrls,
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: pageDescription,
      site: `${siteConfig.url}${pageURL}`,
      images: imageUrls,
      creator: siteConfig.creator,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
  };
}
