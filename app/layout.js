import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NoteState from "@/context/NoteState";
import AuthProvider from "@/context/auth/AuthState";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import LoadingProvider from "@/components/providers/LoadingProvider";
import { Suspense } from "react";

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
  title: "SaveBook | Your Personal Notebook",
  description: "Save Notebook on the cloud",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <AuthProvider>
          <Suspense fallback={<div />}>
            <LoadingProvider>
              <Toaster position="bottom-right" reverseOrder={false} />
              <Navbar />
              <NoteState>
                {/* <main className="pt-10"> */}
                  {children}
                {/* </main> */}
              </NoteState>
              <Footer />
            </LoadingProvider>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
