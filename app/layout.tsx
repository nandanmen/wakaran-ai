import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wakaranai",
};

const geist = localFont({ src: "./geist.ttf", variable: "--font-geist-sans" });

const jp = Noto_Sans_JP({
  variable: "--font-jp",
  weight: ["400", "500"],
  subsets: ["latin"],
});

function Nav() {
  return (
    <nav className="p-8 pb-0">
      <div className="flex rounded-xl">
        <div className="w-[70px] h-16 relative flex items-center justify-center text-4xl font-medium text-sand-9 bg-sand-3 border border-sand-4 rounded-tl-xl rounded-bl-xl pr-2.5 -mr-2.5 overflow-hidden">
          {/* <div className="absolute inset-0">
              <svg width="100%" viewBox="0 0 100 100">
                <defs>
                  <pattern
                    id={id}
                    patternUnits="userSpaceOnUse"
                    width="5"
                    height="5"
                  >
                    <circle cx="2.5" cy="2.5" r="1" className="fill-sand-6" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill={`url(#${id})`} />
              </svg>
            </div> */}
          <p className="relative">分</p>
        </div>
        <div className="bg-sand-2 border border-sand-4 rounded-bl-xl rounded-tl-xl grow font-medium text-sand-11 flex items-center justify-center text-lg -mr-2.5 relative">
          <p>Trails in the Sky FC</p>
        </div>
        <div className="w-16 bg-sand-1 border border-sand-4 flex items-center justify-center rounded-xl text-lg font-medium text-sand-11 shrink-0 relative">
          <p
            style={{
              fontFeatureSettings: "'ss09' 1",
            }}
          >
            001
          </p>
        </div>
      </div>
    </nav>
  );
}

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
        {children}
      </body>
    </html>
  );
}
