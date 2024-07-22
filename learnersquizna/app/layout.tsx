import { GeistSans } from "geist/font/sans";
import "./globals.css";
import React from "react";

import {Providers} from "@/components/NextUI/Providers";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Namibian Learners Test",
  description: "A quiz to help practice for your Namibian Learners test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground ">
      <Providers>
        <main className="min-h-screen flex flex-col items-center">
          {children}
        </main>
      </Providers>
      </body>
    </html>
  );
}
