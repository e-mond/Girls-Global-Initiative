import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker image uses standalone; Cloudflare OpenNext uses default Next output.
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();
