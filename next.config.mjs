import withSerwistInit from "@serwist/next";

/** @type {import("@serwist/next").NextConfig} */
const withSerwist = withSerwistInit({
  swSrc: "src/app/service-worker.ts",
  swDest: "public/sw.js",
});

/** @type {import("next").NextConfig} */
const nextConfig = {};

export default withSerwist(nextConfig);
