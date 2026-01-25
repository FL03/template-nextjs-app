/**
 * Created At: 2025.05.23:03:52:18
 * @author - @FL03
 * @file - env.ts
 */
// project

type GetEnvOptions = {
  key?: string;
  defaultValue?: string;
};

type GetEnv<TOut = string> = (key: string, options?: GetEnvOptions) => TOut;

/** A simple callback with built-in error handling for resolving environment variables. */
export const getValueFromEnv: GetEnv<string | null> = (
  key,
  { defaultValue } = {},
) => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    console.error(`Missing the \`${key}\` environment variable`);
    return null;
  }
  return value.trim();
};
/** A simple callback with built-in error handling for resolving environment variables. */
export const getEnv: GetEnv<string> = (
  key,
  { defaultValue } = {},
) => {
  const value = getValueFromEnv(key, { defaultValue });
  if (!value) {
    throw new Error(`Missing the \`${key}\` environment variable`);
  }
  return value;
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
  console.error(
    `No environment variable matches found for: ${matches.join(", ")}`,
  );
  // throw an error to indicate that the environment variable is missing
  throw new Error(
    `No environment variable matches found for: ${matches.join(", ")}`,
  );
};


