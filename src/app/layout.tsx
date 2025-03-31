import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
    title: "Latebis",
    description: "My art.",
};

const caveat = Caveat({
    variable: "--font-caveat",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={caveat.className}>{children}</body>
        </html>
    );
}
