import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NoteState from "@/context/NoteState";
import AuthProvider from "@/context/auth/AuthState";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import LoadingProvider from "@/components/providers/LoadingProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SaveBook | Your Personal Notebook",
  description: "Save Notebook on the cloud",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LoadingProvider>
            <Toaster position="bottom-right" reverseOrder={false} />
            <Navbar />
            <NoteState>
              <main className="pt-16">
                {children}
              </main>
            </NoteState>
            <Footer />
          </LoadingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
