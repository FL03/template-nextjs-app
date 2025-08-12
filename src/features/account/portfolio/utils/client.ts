/**
 * Created At: 2025.07.22:20:21:08
 * @author - @FL03
 * @file - utils/client.ts
 */
"use client";
// project
import { logger } from "@/lib/logger";
import { createEndpointUrl } from "@/lib/endpoint";
// feature-specific
import { PortfolioData } from "../types";

const USER_ENDPOINT = "/api/portfolio";

const profilesEndpoint = (path?: string) => createEndpointUrl(USER_ENDPOINT, path);


/** Fetch the user profile from the database using the dedicated api.  */
export const fetchUserPortfolio = async (
  params?: { userId?: string; username?: string },
  init?: RequestInit,
): Promise<PortfolioData | null> => {
  // check if params is an object and has keys
  if (typeof params !== "object" || Object.keys(params).length === 0) {
    logger.warn(params, "Missing search params");
  }
  // ensure undefined or null params are not passed to the URL
  const _params = Object.fromEntries(
    Object.entries(params ?? {}).filter(
      ([_, value]) => value !== undefined && value !== null,
    ),
  );
  // transform params to URLSearchParams
  const searchParams = new URLSearchParams(_params);
  // construct the url object
  const url = profilesEndpoint("user");
  // set the search params
  url.search = searchParams.toString();
  // fetch the data from the url
  const res = await fetch(url, init);
  // handle any response errors
  if (!res.ok) {
    logger.error(res, "Failed to fetch data from the database...");
    throw new Error("Failed to fetch the user profile");
  }
  // parse json
  const data = await res.json();
  // return the data or default to null
  return data ?? null;
};

export const deleteUserPortfolio = async (
  params?: Record<string, string>,
  init?: Omit<RequestInit, "method">,
): Promise<PortfolioData | null> => {
  if (!params) {
    throw new Error("No params provided");
  }
  const url = profilesEndpoint("user");
  url.search = new URLSearchParams(params).toString();
  return await fetch(url, { method: "DELETE", ...init }).then((res) =>
    res.json()
  );
};
