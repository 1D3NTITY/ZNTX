import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Kein sharp im schlanken bun:1-alpine-Docker-Image (YAGNI — für die Handvoll statischer
  // Screenshots in public/screenshots/ lohnt sich die zusätzliche native Dependency nicht).
  images: { unoptimized: true },
};

export default nextConfig;
