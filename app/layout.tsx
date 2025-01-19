import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { CSSProperties } from "react";
import { Provider } from "jotai";
import { Navbar } from "./[game]/navbar";

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
    <html className="bg-sand-2 text-sand-12" lang="en">
      <body
        className={`${geist.variable} ${jp.variable} font-sans antialiased`}
      >
        <div
          className="grid grid-cols-[--grid]"
          style={
            {
              "--grid": "180px 1fr 72px",
            } as CSSProperties
          }
        >
          <Provider>
            <div className="col-start-1 row-start-1 col-span-3 border-b border-dashed border-gray-6" />
            <nav className="col-start-2 row-start-1 h-12 flex items-center justify-between px-4 text-sm">
              <Navbar />
            </nav>
            <div className="col-start-1 row-start-1 row-span-2 border-r border-dashed border-gray-6" />
            <div className="col-start-3 row-start-1 row-span-2 border-l border-dashed border-gray-6" />
            <div className="col-start-1 row-start-2 col-span-3 h-[calc(100vh-theme(space.12))]">
              {children}
            </div>
          </Provider>
        </div>
      </body>
    </html>
  );
}
