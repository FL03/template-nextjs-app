/**
 * Created At: 2025.07.15:11:39:51
 * @author - @FL03
 * @file - auth/constants.ts
 */
// imports
import { RouteBuilderOptions } from "@/lib/endpoint";
// local
import { AuthView } from "./types";

export const ENDPOINT_AUTH = "/auth";
export const ENDPOINT_AUTH_LOGIN = "/auth/login"; // "/auth?view=login";

type RouteParamsT = {
  view?: AuthView;
};

/** A simple method for creating dynamic endpoints for the `/auth` prefix */
export const authEndpoint = (
  { params }: RouteBuilderOptions<RouteParamsT>,
) => {
  // deconstruct the params object
  let { view } = params;
  // set the default view
  view ??= "login";
  // return the endpoint
  return `/auth/${view}`; // /auth&view=${view}
};
