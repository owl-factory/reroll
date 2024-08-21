import nextJest from "next/jest.js";

/**
 * TODO remove 'dotenv' by loading env file using native NodeJs feature
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import { config as env } from "dotenv";
import { getBaseUrl } from "./src/utils/config.mjs";
env({ path: "./.env.development" });
process.env.NEXT_PUBLIC_BASE_URL = getBaseUrl();

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

/** @type {import("jest").Config} */
// Add any custom config to be passed to Jest
const config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleDirectories: ["src", "node_modules"],
  modulePathIgnorePatterns: ["src/app", "src/components", "archive"],
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
