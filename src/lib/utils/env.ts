/**
 * Created At: 2025.05.23:03:52:18
 * @author - @FL03
 * @file - env.ts
 */
// project
import { logger } from "@/lib/logger";

/** A simple callback with built-in error handling for resolving environment variables. */
export const getEnvironmentVariable = (key: string): string => {
  // fetch the environment variable for the Supabase URL
  const value = process.env[key];
  // handle the case where no value was found
  if (!value) {
    // then throw an error
    throw new Error(`Missing the \`${key}\` environment variable`);
  }
  // return the parsed value
  return value.trim();
};

/** A convenience method for fetching the `SUPABASE_URL` environment variable. */
export const resolveEnvFrom = (...matches: string[]): string => {
  // capitalize each match to ensure consistency and collect them into an array
  const vars = Array.from(matches.map((v) => v.toUpperCase()));
  // iterate over the accepted variables and return the first one that is defined
  for (const envVar of vars) {
    const url = process.env[envVar];
    if (url) {
      return url;
    }
  }
  // handle the case where no environment variable matches were found
  logger.error(
    `No environment variable matches found for: ${matches.join(", ")}`,
  );
  // throw an error to indicate that the environment variable is missing
  throw new Error(
    `No environment variable matches found for: ${matches.join(", ")}`,
  );
};

/**
 * This method concats the variable key with the `NEXT_PUBLIC_` prefix.
 * @param {string} varName - The variable name to be concatenated.
 */
export const createNextPublicVar = (varName: string): string => `NEXT_PUBLIC_${varName.toUpperCase()}`;

/**
 * This method attempts to resolve a particular environment variable. The method is useful in that every variable name passed is also prefixed with additional patterns such as:
 *
 * -  `NEXT_PUBLIC_*`
 *
 * @param {string} varName - The variable name to be resolved.
 * @returns {string} - The resolved variable name.
 * @throws {Error} - If the variable is not defined, an error is thrown.
 */
export const nextPublicEnv = (varName: string): string => {
  return resolveEnvFrom(varName, `NEXT_PUBLIC_${varName.toUpperCase()}`);
};

export const nextBuildOutput = (): "export" | "standalone" | undefined => {
  const value = createNextPublicVar("build_output");
  return value === "export" || value === "standalone" ? value : undefined;
};
