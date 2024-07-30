import withSerwistInit from "@serwist/next";
import { readFileSync } from "fs";
import { getGitCommitId } from "./src/utils/config.mjs";

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

/**
 * Function to read the GraphQL schema from a source file. Requires node's `fs`.
 * @returns UTF8 string containing entire GraphQL schema file.
 */
function getGraphqlTypedefs() {
  return readFileSync("./src/services/graphql/schema.graphql", {
    encoding: "utf8",
  });
}

/**
 * Function to get the `DEPLOY_URL` environment variable, which is provided by the Netlify runtime environment
 * to check what URL a build is deployed on, so we can embed it in the bundle for client or server access.
 * NOTE: the current way this function is used causes the DEPLOY_URL at *build time* to be baked into the build,
 * even if that build end's up deployed on a different URL.
 * @returns URL string.
 */
function getBaseUrl() {
  return process.env.DEPLOY_URL ?? "";
}

/**
 * Gets the current time in UTC in a readable string format.
 * @return ISO formatted timestamp string.
 */
function getIsoTimestamp() {
  return new Date(Date.now()).toISOString();
}
