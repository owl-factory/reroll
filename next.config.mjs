import withSerwistInit from "@serwist/next";
import { getGitCommitId, getBaseUrl, getGraphqlTypedefs, getIsoTimestamp } from "./src/utils/config.mjs";

/** @type {import("next").NextConfig} */
const nextConfig = {
  env: {
    GRAPHQL_TYPEDEFS: getGraphqlTypedefs(),
    NEXT_PUBLIC_BASE_URL: getBaseUrl(),
    NEXT_PUBLIC_BUILD_GIT_COMMIT: getGitCommitId(),
    NEXT_PUBLIC_BUILD_TIMESTAMP: getIsoTimestamp(),
  },
};

/**
 * Initialize Serwist (service worker library) for generating an offline capable service worker for the site.
 */
const withSerwist = withSerwistInit({
  swSrc: "src/app/service-worker.ts",
  swDest: "public/sw.js",
  injectionPoint: "self.__SW_MANIFEST",
  cacheOnNavigation: true,
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist(nextConfig);
