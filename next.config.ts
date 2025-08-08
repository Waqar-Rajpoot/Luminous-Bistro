import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // serverActions: {
  //   bodySizeLimit: "100mb",
  // },
  images: {
    domains: ['ik.imagekit.io'], // Add your ImageKit domain here
  },
  // api: {
  //   bodyParser: {
  //     sizeLimit: "100mb", // Set the body size limit for API routes
  //   },
  // },
};

export default nextConfig;
