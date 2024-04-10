import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Svgl Badges",
    description:
        "A beautiful badges with svgl SVG logos. Decorate your README.md profile with svgl badges",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
