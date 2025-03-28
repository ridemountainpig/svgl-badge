import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
    title: "Svgl Badges",
    description:
        "A beautiful badges with svgl SVG logos. Decorate your README.md profile with svgl badges",
    verification: {
        google: "MsZruHXSkmggHUEIMwVqn24AappLAZUSBmLcp4XwFGo",
    },
    keywords:
        "svgl, svgl badge, svgl badges, svgl logo, svgl logos, svg badges, svg logos, markdown badges, svgl svg badge, svgl svg logo, customizable svg badges, open source svg logos, svgl badge generator, svgl badge design, vercel svgl badges",
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
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </body>
            <GoogleAnalytics gaId="G-SPCB204YQ0" />
        </html>
    );
}
