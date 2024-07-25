import { GeistSans } from "geist/font/sans";
import "./globals.css";
import React from "react";

import {Providers} from "@/components/NextUI/Providers";

const defaultUrl = "https://namibianlearnerstest.netlify.app"
  ? `https://namibianlearnerstest.netlify.app`
  : "http://localhost:3000";

var url ="https://isqkzbwoiunnqsltbfpa.supabase.co/storage/v1/object/public/WebsiteLogo/logo.ico?t=2024-07-25T21%3A32%3A36.405Z";
export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Namibian Learners licence Test',
  description: 'A quiz to help practice for your Namibian Learners licence test',
    icons:{
      icon:url
    },
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
