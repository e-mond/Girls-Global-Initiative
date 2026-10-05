import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker image uses standalone; Cloudflare OpenNext uses default Next output.
  ...(process.env.DOCKER_BUILD === "1" ? { output: "standalone" as const } : {}),
};

export default nextConfig;

// Bindings for local `next dev` only — never during Docker/CI production builds.
if (
  process.env.NODE_ENV !== "production" &&
  process.env.DOCKER_BUILD !== "1" &&
  process.env.CI !== "true"
) {
  void import("@opennextjs/cloudflare").then(({ initOpenNextCloudflareForDev }) => {
    initOpenNextCloudflareForDev();
  });
}
