/**
 * Created At: 2025.08.09:12:18:15
 * @author - @FL03
 * @file - server.ts
 */
"use server";
// imports
import {
  AuthOtpResponse,
  AuthTokenResponsePassword,
  OAuthResponse,
  Session,
  SignInWithOAuthCredentials,
  SignInWithPasswordCredentials,
  SignInWithPasswordlessCredentials,
  SignUpWithPasswordCredentials,
  User,
} from "@supabase/supabase-js";
// project
import { logger } from "@/lib/logger";
import { createUrl } from "@/lib/endpoint";
// local
import { createServerClient } from "../server";

interface UserRegistrationData {
  email: string;
  password: string;
  passwordConfirm: string;
  username: string;
}
export const handleRegistration = async (
  { email, password, passwordConfirm, username }: UserRegistrationData,
  options?: SignUpWithPasswordCredentials["options"],
): Promise<{
  user: User | null;
  session: Session | null;
}> => {
  if (password !== passwordConfirm) {
    throw new Error("Passwords do not match...");
  }
  const supabase = await createServerClient();

  return await supabase.auth.signUp({
    email,
    password,
    options: {
      ...options,
      // pass required metadata from the form
      data: {
        ...options?.data,
        username,
      },
      emailRedirectTo: createUrl("/auth/callback").toString(),
    },
  }).then(({ data, error }) => {
    // check for errors
    if (error) {
      logger.error({ error }, "Error registering the user...");
      throw new Error(error.message);
    }

    // check for data
    if (!data.user || !data.session) {
      logger.warn("No data returned from sign up");
    }

    return data;
  });
};

/**
 * Authenticate a user with an email / password combination.
 * @param {SignInWithPasswordCredentials} credentials - the credentials to authenticate with
 * @returns {Promise<AuthTokenResponsePassword["data"]>} - the authentication token response
 */
export const loginWithEmailPassword = async (
  credentials: SignInWithPasswordCredentials,
): Promise<AuthTokenResponsePassword["data"]> => {
  // create a new supabase client
  const supabase = await createServerClient();
  // sign in with the email and password
  const { data, error } = await supabase.auth.signInWithPassword(credentials);
  // check for errors
  if (error) {
    logger.error(error, "Failed to authenticate with email and password");
    throw new Error(error.message);
  }

  return data;
};

/**
 * A handler for authenticating a user with an OAuth provider.
 * @param {SignInWithOAuthCredentials} values : the information needed for the oauth flow
 */
export const loginWithOAuth = async (
  values: SignInWithOAuthCredentials,
): Promise<OAuthResponse["data"]> => {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.signInWithOAuth(values);
  // check for errors
  if (error) {
    logger.error(error, "Error authenticating with OAuth provider");
    throw new Error(error.message);
  }
  return data;
};
/**
 * A simple wrapper for handling the passwordless login flow
 * @param {SignInWithPasswordlessCredentials} values - the values needed for the passwordless login
 */
export const loginWithoutPassword = async (
  values: SignInWithPasswordlessCredentials,
): Promise<AuthOtpResponse["data"]> => {
  const supabase = await createServerClient();

  const { data, error } = await supabase.auth.signInWithOtp(values);
  // check for errors
  if (error) {
    logger.error(
      error,
      "Error authenticating using the passwordless flow; please try again.",
    );
    throw new Error(error.message);
  }
  // check for data
  if (!data) {
    logger.error("No data returned from passwordless sign in");
    throw new Error("No data returned from passwordless sign in");
  }
  return data;
};
