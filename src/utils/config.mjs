import { readFileSync } from "fs";

/**
 * Gets the most recent Git commit ID from the local Lantern repo on disk, then trims it to the length
 * usually seen on Git frontends such as Github.
 * @returns trimmed Git commit ID,.
 */
export function getGitCommitId() {
  const revision = readFileSync(".git/HEAD").toString().trim();
  if (revision.indexOf(":") === -1) {
    return revision;
  } else {
    return readFileSync(".git/" + revision.substring(5))
      .toString()
      .trim();
  }
}

/**
 * Function to get the `DEPLOY_URL` environment variable, which is provided by the Netlify runtime environment
 * to check what URL a build is deployed on, so we can embed it in the bundle for client or server access.
 * NOTE: the current way this function is used causes the DEPLOY_URL at *build time* to be baked into the build,
 * even if that build end's up deployed on a different URL.
 * @returns URL string.
 */
export function getBaseUrl() {
  return process.env.DEPLOY_URL ?? "";
}

/**
 * Function to read the GraphQL schema from a source file. Requires node's `fs`.
 * @returns UTF8 string containing entire GraphQL schema file.
 */
export function getGraphqlTypedefs() {
  return readFileSync("./src/services/graphql/schema.graphql", {
    encoding: "utf8",
  });
}

/**
 * Gets the current time in UTC in a readable string format.
 * @return ISO formatted timestamp string.
 */
export function getIsoTimestamp() {
  return new Date(Date.now()).toISOString();
}
