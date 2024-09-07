import {GeistSans} from "geist/font/sans";
import "./globals.css";
import React from "react";

import {Providers} from "@/components/NextUI/Providers";
import {Metadata} from "next";
import {customMetaDataGenerator} from "@/lib/customMetaDataGenerator";

const defaultUrl = "https://namibianlearnerstest.frans-nekongo.com/"
    ? `https://namibianlearnerstest.frans-nekongo.com/`
    : "http://localhost:3000";

const url = "https://isqkzbwoiunnqsltbfpa.supabase.co/storage/v1/object/public/WebsiteLogo/logo.ico?t=2024-07-25T21%3A32%3A36.405Z";

export const metadata: Metadata = customMetaDataGenerator({
    title: 'Namibian Learners licence Test',
});

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
