/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        domains: ["svgl-badge.vercel.app"],
    },
    async headers() {
        return [
            {
                source: "/api/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=21600",
                    },
                ],
            },
            {
                source: "/static/library/(.*)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=21600",
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
