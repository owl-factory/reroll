import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  cacheOnFrontEndNav: true,
  swSrc: "src/app/service-worker.ts",
  swDest: "public/sw.js",
  injectionPoint: "self.__SW_MANIFEST",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import("next").NextConfig} */
const nextConfig = {};

export default withSerwist(nextConfig);
