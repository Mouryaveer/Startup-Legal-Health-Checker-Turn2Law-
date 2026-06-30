// ============================================================
// Turn2Law Legal Health Check — SEO Constants & Helpers
// ============================================================

export const SITE_CONFIG = {
  name: "Turn2Law",
  product: "Legal Health Check",
  tagline: "Know Your Startup's Legal Health Score",
  description:
    "Free legal health assessment for Indian startups. Get your compliance score across company formation, IP, employment, contracts, data privacy, and regulatory areas in under 10 minutes.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL || "https://healthcheck.turn2law.com",
  ogImage: "/og-image.png",
  twitterHandle: "@turn2law",
  email: "hello@turn2law.com",
  phone: "+91 98765 43210",
};

export const DEFAULT_SEO = {
  title: `${SITE_CONFIG.product} — ${SITE_CONFIG.tagline} | ${SITE_CONFIG.name}`,
  description: SITE_CONFIG.description,
  openGraph: {
    type: "website" as const,
    locale: "en_IN",
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image" as const,
    creator: SITE_CONFIG.twitterHandle,
  },
};

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    contactPoint: {
      "@type": "ContactPoint",
      email: SITE_CONFIG.email,
      contactType: "customer service",
    },
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${SITE_CONFIG.name} ${SITE_CONFIG.product}`,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
  };
}

export function generateWebApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${SITE_CONFIG.name} ${SITE_CONFIG.product}`,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };
}

export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.url}`,
    })),
  };
}
