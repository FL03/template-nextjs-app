/**
 * Created At: 2025.05.23:03:52:18
 * @author - @FL03
 * @file - env.ts
 */

/** 
 * This method concats the variable key with the `NEXT_PUBLIC_` prefix.
 * @param {string} varname - The variable name to be concatenated.
 */
export const getNextPublicFromEnv = (varname: string): string | undefined => {
  return process.env[['next', 'public', varname].join('_').toUpperCase()];
}

/** 
 * This method attempts to resolve a particular environment variable. The method is useful in that every variable name passed is also prefixed with additional patterns such as:
 * 
 * -  `NEXT_PUBLIC_*` 
 * 
 * @param {string} varname - The variable name to be resolved.
 * @returns {string} - The resolved variable name.
 * @throws {Error} - If the variable is not defined, an error is thrown.
 */
export const resolveEnv = (varname: string): string => {
  const res = process.env[varname.toUpperCase()] || process.env[['next', 'public', varname].join('_').toUpperCase()];
  if (!res) {
    throw new Error(`Environment variable ${varname} is not defined`);
  }
  return res;
}

export const nextBuildOutput = (): "export" | "standalone" | undefined => {
  const value = process.env['NEXT_PUBLIC_BUILD_OUTPUT'];
  return value === 'export' || value === 'standalone' ? value : undefined;
}