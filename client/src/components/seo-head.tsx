import { Helmet } from "react-helmet-async";
import type { PortfolioSEO } from "@/types/portfolio";

interface SeoHeadProps {
  seo: PortfolioSEO;
}

export function SeoHead({ seo }: SeoHeadProps) {
  return (
    <Helmet>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <link rel="canonical" href={seo.canonical} />

      {/* OpenGraph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.canonical} />
      <meta property="og:type" content="website" />
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {seo.ogImage && <meta name="twitter:image" content={seo.ogImage} />}
    </Helmet>
  );
}

