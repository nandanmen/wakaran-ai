import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { CSSProperties } from "react";
import { Provider } from "jotai";

export const metadata: Metadata = {
  title: "Wakaranai",
};

const geist = localFont({ src: "./geist.ttf", variable: "--font-geist-sans" });

const jp = Noto_Sans_JP({
  variable: "--font-jp",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="bg-gray-2 text-gray-12" lang="en">
      <body
        className={`${geist.variable} ${jp.variable} font-sans antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
