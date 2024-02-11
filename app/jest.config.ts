/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  preset: "jest-puppeteer",
  clearMocks: true,
  coverageProvider: "v8",
  testEnvironment: "@quramy/jest-prisma/environment",
  transform: {
    ".(ts|tsx)": "ts-jest",
  },
};
