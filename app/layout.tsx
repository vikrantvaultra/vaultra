import type { Metadata, Viewport } from "next";
import { Newsreader, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-newsreader",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-instrument-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Vaultra — Automation for mid-market operations, Mumbai",
    template: "%s · Vaultra",
  },
  description: siteConfig.description,
  keywords: [
    "business process automation",
    "Tally automation",
    "Zoho automation",
    "WhatsApp automation",
    "invoice data entry automation",
    "Mumbai automation consultancy",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: "Vaultra",
    title: "Your team is still typing invoices by hand.",
    description: siteConfig.description,
    locale: "en_IN",
    images: [
      {
        url: "/images/hero-office.jpg",
        width: 1376,
        height: 768,
        alt: "A quiet mid-market office in Mumbai",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your team is still typing invoices by hand.",
    description: siteConfig.description,
    images: ["/images/hero-office.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f8f6f1",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Vaultra",
  description: siteConfig.description,
  url: siteConfig.url,
  areaServed: "IN",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressCountry: "IN",
  },
  serviceType: "Business process automation consultancy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${newsreader.variable} ${instrumentSans.variable} ${ibmPlexMono.variable}`}
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
