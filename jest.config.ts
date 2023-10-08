/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
import { pathsToModuleNameMapper } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";
process.env = Object.assign(process.env, {
  JWT_SECRET: 'dev',
});

export default {
  bail: true,
  clearMocks: true,
  coverageProvider: "v8",
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/*.spec.ts"]
};
