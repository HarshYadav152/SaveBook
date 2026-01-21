import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/common/ScrollToTop";
import { Toaster } from "react-hot-toast";
import NoteState from "@/context/NoteState";
import AuthProvider from "@/context/auth/AuthState";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import LoadingProvider from "@/components/providers/LoadingProvider";
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

import ThemeProvider from "@/components/providers/ThemeProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* ... existing Head content ... */}
      </Head>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <Suspense fallback={<div />}>
              <LoadingProvider>
                <Toaster
                  position="top-right"
                  reverseOrder={false}
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#1f2937',
                      color: '#fff',
                      border: '1px solid #374151',
                    },
                    success: {
                      style: {
                        background: '#10b981',
                        color: '#fff',
                      },
                    },
                    error: {
                      style: {
                        background: '#ef4444',
                        color: '#fff',
                      },
                    },
                  }}
                />
                <Navbar />
                <NoteState>
                  {children}
                </NoteState>
                <Footer />
              </LoadingProvider>
            </Suspense>
          </AuthProvider>
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
