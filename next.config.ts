import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow all devices on the local network to load dev resources
  allowedDevOrigins: ["10.0.0.12", "10.0.0.*", "192.168.*"],
};

export default nextConfig;
