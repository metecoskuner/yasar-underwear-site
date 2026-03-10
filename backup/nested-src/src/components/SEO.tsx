import Head from 'next/head';

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
};

export default function SEO({
  title = 'Yasar',
  description = "Yasar — konforlu iç çamaşırları. Türkiye'de tasarlandı.",
  image = '/photos/yasarLogo2.jpg',
  url = '/',
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <link rel="icon" href="/photos/yasarLogo2.jpg" />
    </Head>
  );
}
