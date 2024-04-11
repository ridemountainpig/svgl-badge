import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

export const metadata: Metadata = {
    title: "Svgl Badges",
    description:
        "A beautiful badges with svgl SVG logos. Decorate your README.md profile with svgl badges",
    keywords:
        "svgl, svgl badges, svgl badge, svgl logo, svgl logos, svgl svg, svgl svg logos, svgl svg logo, svgl svg badges, svgl svg badge",
    authors: [
        {
            name: "ridemountainpig",
            url: "https://www.github.com/ridemountainpig",
        },
    ],
    openGraph: {
        type: "website",
        url: "https://svgl-badge.vercel.app/",
        title: "Svgl Badges",
        description:
            "A beautiful badges with svgl SVG logos. Decorate your README.md profile with svgl badges",
        images: [
            {
                url: "https://svgl-badge.vercel.app/svgl.png",
                width: 1200,
                height: 630,
                alt: "Svgl Badges",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Svgl Badges",
        description:
            "A beautiful badges with svgl SVG logos. Decorate your README.md profile with svgl badges",
        creator: "@ridemountainpig",
        images: ["https://svgl-badge.vercel.app/svgl.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
            <GoogleAnalytics gaId="G-SPCB204YQ0" />
        </html>
    );
}
