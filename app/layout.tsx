import type { Metadata } from "next";
import { Geist, Geist_Mono, Playwrite_US_Trad } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playwrite_us_trad = Playwrite_US_Trad({
  variable: "--font-playwrite-us-trad",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Word Chains",
  description: "An online word game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playwrite_us_trad.variable} antialiased h-screen`}
      >
        {children}
        <footer className="bottom-0 text-center w-full fixed flex flex-row justify-between items-center">
          <div className="w-[24px]"></div>
          <small>Copyright © Elizabeth Tennant 2025</small>
          <a href="https://github.com/ertennant" className="p-2">
            <Image
              src="./github-mark.svg"
              alt="Link to GitHub"
              height={24}
              width={24}
            >
            </Image>
          </a>
        </footer>
      </body>
    </html>
  );
}
