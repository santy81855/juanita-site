import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: false,
    images: {
        domains: ["cdn.sanity.io"],
    },
    /* config options here */
};

export default nextConfig;
