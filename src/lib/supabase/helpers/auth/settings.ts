/*
  Appellation: settings <auth-helpers>
  Contrib: @FL03
*/

export type AuthViews =
  | 'login'
  | 'email_signin'
  | 'email_password'
  | 'password_signin'
  | 'forgot_password'
  | 'update_password'
  | 'reset_password'
  | 'sign-in'
  | 'signup';

// Boolean toggles to determine which auth types are allowed
const allowOauth = true;
const allowEmail = true;
const allowPassword = true;

// Boolean toggle to determine whether auth interface should route through server or client
// (Currently set to false because screen sometimes flickers with server redirects)
const allowServerRedirect = false;

// Check that at least one of allowPassword and allowEmail is true
if (!allowPassword && !allowEmail)
  throw new Error('At least one of allowPassword and allowEmail must be true');

export const views = {
  login: {
    passwordless: ['passwordless'],
    with_password: ['login', 'email_password', 'password_signin', 'sign-in'],
  },
};

export const getAuthTypes = () => {
  return { allowOauth, allowEmail, allowPassword };
};

export const getViewTypes = () => {
  // Define the valid view types
  let viewTypes: string[] = [];
  if (allowEmail) {
    viewTypes = [...viewTypes, 'email_signin'];
  }
  if (allowPassword) {
    viewTypes = [
      ...viewTypes,
      'login',
      'email_password',
      'password_signin',
      'forgot_password',
      'update_password',
      'reset_password',
      'sign-in',
      'signup',
    ];
  }

  return viewTypes;
};

export const getDefaultSignInView = (preferredSignInView: string | null) => {
  // Define the default sign in view
  let defaultView = allowPassword ? 'login' : 'passwordless';

  if (preferredSignInView && getViewTypes().includes(preferredSignInView)) {
    defaultView = preferredSignInView;
  }

  return defaultView;
};

export const getRedirectMethod = () => {
  return allowServerRedirect ? 'server' : 'client';
};
