import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Imagine.club",
    description: "Imagine.club - Mock News Feed",
};

export default function RootLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode;
    params: { lang: string };
}>) {
    return (
        <html lang={params.lang || 'pt'}>
            <body>{children}</body>
        </html>
    );
}
