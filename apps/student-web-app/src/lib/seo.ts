import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://chulatutordream.com";

export const SITE_NAME = "Chula Tutor Dream";

export const DEFAULT_TITLE =
  "Chula Tutor Dream | หาติวเตอร์ส่วนตัว เรียนพิเศษ ทุกระดับชั้น ทุกวิชา";

export const DEFAULT_DESCRIPTION =
  "หาติวเตอร์สอนพิเศษคุณภาพจากจุฬาฯ ธรรมศาสตร์ และมหาวิทยาลัยชั้นนำ ทุกระดับชั้น ทุกวิชา ทั้งเรียนที่บ้านและออนไลน์";

export const DEFAULT_KEYWORDS = [
  "หาติวเตอร์",
  "ติวเตอร์ส่วนตัว",
  "เรียนพิเศษ",
  "เรียนออนไลน์",
  "ติวเตอร์จุฬา",
  "ติวเตอร์แพทย์",
  "ติวเตอร์วิศวะ",
];

const DEFAULT_OG_IMAGE = "/logo.png";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  image = DEFAULT_OG_IMAGE,
  noIndex = false,
  absoluteTitle = false,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  absoluteTitle?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: DEFAULT_KEYWORDS,
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "th_TH",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/logo.png"),
    description: DEFAULT_DESCRIPTION,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "chulatutordream@gmail.com",
      availableLanguage: ["Thai"],
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "th-TH",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: absoluteUrl("/logo.png"),
    },
  };
}

export function articleJsonLd({
  title,
  description,
  path,
  image,
  author,
  publishedAt,
}: {
  title: string;
  description: string;
  path: string;
  image: string;
  author: string;
  publishedAt: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: absoluteUrl(image),
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
    datePublished: publishedAt,
    mainEntityOfPage: absoluteUrl(path),
    inLanguage: "th-TH",
  };
}
