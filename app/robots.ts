import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/_next/static/media/"],
        },
        sitemap: "https://svgl-badge.vercel.app/sitemap.xml",
    };
}
