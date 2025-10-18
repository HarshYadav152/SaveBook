import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NoteState from "@/context/NoteState";

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
        <NoteState>
          <Toaster
            position="bottom-right"
            reverseOrder={false}
          />
          {children}
        </NoteState>
      </body>
    </html>
  );
}
