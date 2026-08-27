import type { Metadata, Viewport } from "next";
import { Outfit, DM_Mono } from "next/font/google";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-display",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});

const ogImage = {
  url: "/images/og.jpg",
  width: 1200,
  height: 630,
  alt: "A long row of identical printed invoices",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Vaultra · Automation for mid-market operations, Mumbai",
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
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your team is still typing invoices by hand.",
    description: siteConfig.description,
    images: [ogImage.url],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F7F7F2",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${outfit.variable} ${dmMono.variable}`}>
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
