import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterHandle?: string;
}

export default function SEO({
  title = 'Viktor Labs | Digital Architecture & Motion',
  description = 'High-End Webdesign, 3D Animationen & digitale Performance-Architektur für moderne Unternehmen.',
  canonical = 'https://viktor-labs.de/',
  ogImage = '/og-image.png',
  ogType = 'website',
  twitterHandle = '@viktorlabs'
}: SEOProps) {
  const siteTitle = title.includes('Viktor Labs') ? title : `${title} | Viktor Labs`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content={twitterHandle} />
    </Helmet>
  );
}
