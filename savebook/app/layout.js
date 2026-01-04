import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NoteState from "@/context/NoteState";
import AuthProvider from "@/context/auth/AuthState";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import LoadingProvider from "@/components/providers/LoadingProvider";
import { Suspense } from "react";

// Font configuration should stay in layout.js
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
  description: "Save Notebook on the cloud",
};

// ClientBody component should be defined here
function ClientBody({ children, className }) {
  return (
    <body className={className} suppressHydrationWarning={true}>
      {children}
    </body>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`}>
      <ClientBody className="antialiased">
        <AuthProvider>
          <Suspense fallback={<div />}>
            <LoadingProvider>
              {/* Enhanced Toaster configurations */}
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
      </ClientBody>
    </html>
  );
}