import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.dicebear.com",
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                port: "",
                pathname: "/qa-coders-academy.firebasestorage.app/**",
            },
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
                port: "",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
