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
  title: "SaveBook | Your Personal Notebook",
  description: "SaveBook is a cloud-based notebook application.",
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
