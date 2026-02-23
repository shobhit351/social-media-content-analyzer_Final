import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas", "pdfjs-dist", "tesseract.js"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
