/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        domains: ["svgl-badge.vercel.app"],
    },
    async headers() {
        return [
            {
                source: '/api/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=14400',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
