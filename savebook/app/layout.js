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

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata = {
  title: {
    default: "SaveBook | Your Personal Notebook",
    template: "%s | SaveBook",
  },
  description:
    "SaveBook is a cloud-based notebook application that allows users to securely create, manage, and access notes from anywhere.",
  keywords: [
    "SaveBook",
    "Notebook App",
    "Cloud Notes",
    "Note Taking App",
    "Next.js App",
  ],
  authors: [{ name: "SaveBook Team" }],
  creator: "SaveBook",
  openGraph: {
    title: "SaveBook | Your Personal Notebook",
    description:
      "Securely create, manage, and access your notes anytime, anywhere.",
    url: "https://savebook.vercel.app",
    siteName: "SaveBook",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SaveBook | Your Personal Notebook",
    description:
      "A cloud-based notebook application built with Next.js.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-white text-black min-h-screen`}
      >
        <AuthProvider>
          <Suspense fallback={<div />}>
            <LoadingProvider>
              <Toaster position="top-right" />
              <Navbar />
              <NoteState>{children}</NoteState>
              <Footer />
            </LoadingProvider>
          </Suspense>
        </AuthProvider>
        <ScrollToTop />
      </body>
    </html>
  );
}
