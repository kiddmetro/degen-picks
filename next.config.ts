import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apiv2.allsportsapi.com",
        pathname: "/logo/**", // Optional: restricts to logo paths
      },
    ],
  },
};

export default nextConfig;