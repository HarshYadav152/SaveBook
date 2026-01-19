import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import NoteState from "@/context/NoteState";
import AuthProvider from "@/context/auth/AuthState";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import LoadingProvider from "@/components/providers/LoadingProvider";
import ToasterProvider from "@/components/providers/ToasterProvider";
import ThemeProvider from "@/context/theme/ThemeProvider";
import { Suspense } from "react";
import Head from "next/head";

// Replace Geist with Inter (similar clean sans-serif)
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

// Replace Geist Mono with Roboto Mono
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata = {
  metadataBase: new URL('https://notes.geetasystems.co.in'),
  title: {
    default: "SaveBook | Your Personal Notebook & Cloud Note-Taking App",
    template: "%s | SaveBook"
  },
  description: "SaveBook is a powerful cloud-based notebook application. Save, organize, and access your notes from anywhere. Free personal notebook with secure cloud storage.",
  keywords: ["notebook app", "cloud notes", "personal notebook", "note taking", "online notebook", "save notes", "digital notebook", "cloud storage notes"],
  authors: [{ name: "Harsh Yadav" }],
  creator: "SaveBook",
  publisher: "SaveBook",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://notes.geetasystems.co.in",
    title: "SaveBook | Your Personal Notebook & Cloud Note-Taking App",
    description: "Save, organize, and access your notes from anywhere with SaveBook's secure cloud storage.",
    siteName: "SaveBook",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SaveBook - Cloud Notebook App",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaveBook | Your Personal Notebook",
    description: "Save, organize, and access your notes from anywhere.",
    images: ["/twitter-image.jpg"],
    creator: "@savebook",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add Google Search Console verification
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  alternates: {
    canonical: "https://notes.geetasystems.co.in",
  },
  category: "Productivity",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        {/* Additional SEO meta tags */}
        <link rel="canonical" href="https://notes.geetasystems.co.in" />
        <meta name="theme-color" content="#1f2937" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Theme initialization script - prevents flash of unstyled content */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('savebook-theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldBeDark = theme === 'dark' || (!theme && prefersDark);
                  
                  if (shouldBeDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.backgroundColor = '#0f172a';
                    document.documentElement.style.colorScheme = 'dark';
                    document.body.style.backgroundColor = '#0f172a';
                    document.body.style.color = '#e2e8f0';
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.backgroundColor = '#ffffff';
                    document.documentElement.style.colorScheme = 'light';
                    document.body.style.backgroundColor = '#ffffff';
                    document.body.style.color = '#1f2937';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        {/* Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "SaveBook",
              "description": "A powerful cloud-based notebook application for saving and organizing notes",
              "url": "https://notes.geetasystems.co.in",
              "applicationCategory": "ProductivityApplication"
            })
          }}
        />
      </Head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider>
            <Suspense fallback={<div />}>
              <LoadingProvider>
                <ToasterProvider />
                <Navbar />
                <NoteState>
                  {children}
                </NoteState>
                <Footer />
              </LoadingProvider>
            </Suspense>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
