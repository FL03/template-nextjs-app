/**
 * Created At: 2025.10.24:22:58:16
 * @author - @FL03
 * @directory - src/features/orgs/utils
 * @file - api.ts
 */
// project
import { parseSearchParams, resolveOrigin } from "@/lib/utils";
import { logger } from "@/lib/logger";
// local
import {
  OrganizationData,
  OrganizationInsert,
  OrganizationUpdate,
  OrganizationUpsert,
} from "../types";

const ENDPOINT = "/api/orgs";

export const orgEndpoint = (path?: string): string => (
  path ? `${ENDPOINT}/${path}` : ENDPOINT
);

export const fetchOrganizations = async (
  params?: { filterBy?: string; limit?: string | number; sortBy?: string },
  init?: Omit<RequestInit, "body" | "method">,
): Promise<OrganizationData[]> => {
  const url = new URL(ENDPOINT, resolveOrigin());
  url.search = parseSearchParams(params).toString();
  // fetch the data using the configured endpoint
  const res = await fetch(url, {
    ...init,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    body: params ? JSON.stringify(params) : undefined,
  });

  if (!res.ok) {
    logger.warn(
      res.status,
      `The request for fetching the organizations is not okay: ${res.statusText}`,
    );
  }

  const { data, error } = await res.json();
  if (error) {
    logger.error(
      `Failed to fetch the organizations from the database: ${error}`,
    );
    return [];
  }
  return data;
};

export async function fetchOrganization(
  id: string,
  init?: Omit<RequestInit, "method">,
): Promise<OrganizationData | null> {
  const res = await fetch(orgEndpoint(id), {
    ...init,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  // parse the response as json
  const { data, error } = await res.json();
  // hande any errors
  if (error) {
    logger.error(
      `Failed to delete the organization (${id}): ${error}`,
    );
    return null;
  }
  return data;
};

export const deleteOrganization = async (
  id?: string | null,
  init?: Omit<RequestInit, "method">,
): Promise<OrganizationData | null> => {
  if (!id) {
    throw new Error("Organization ID is required to delete organization.");
  }
  const res = await fetch(orgEndpoint(id), {
    ...init,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { data, error } = await res.json();

  if (error || !res.ok) {
    logger.error(
      `Failed to delete the organization (${id}): ${error ?? res.statusText}`,
    );
    return null;
  }
  return data;
};

export const createOrganization = async (
  org: OrganizationInsert,
  init?: Omit<RequestInit, "body" | "method">,
): Promise<OrganizationData | null> => {
  const res = await fetch(ENDPOINT, {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    body: JSON.stringify(org),
  });
  if (!res.ok) {
    logger.error(
      `Failed to create the organization: ${res.status} - ${res.statusText}`,
    );
    return null;
  }

  const { data, error } = await res.json();

  if (error) {
    logger.error(`Failed to create the organization: ${error}`);
    return null;
  }
  return data;
};
/** Update an existing organization */
export async function updateOrganization(
  { id, ...values }: OrganizationUpdate,
  init?: Omit<RequestInit, "body" | "method">,
): Promise<OrganizationData | null> {
  if (!id) {
    logger.error("Organization ID is required to update an organization.");
    return null;
  }
  const res = await fetch(orgEndpoint(id), {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    logger.error(
      `Failed to save the organization: ${res.status} - ${res.statusText}`,
    );
    return null;
  }

  const { data, error } = await res.json();

  if (error) {
    logger.error(error, `Failed to update the organization: ${error}`);
    return data;
  }
  return data;
}
/** Insert or update an organization using the given data */
export async function upsertOrganization(
  { id, ...values }: OrganizationUpsert,
  init?: Omit<RequestInit, "body" | "method">,
): Promise<OrganizationData | null> {

  const res = await fetch(orgEndpoint(id), {
    ...init,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    body: JSON.stringify(values),
  });
  if (!res.ok) {
    logger.error(
      `Failed to save the organization: ${res.status} - ${res.statusText}`,
    );
    return null;
  }

  const { data, error } = await res.json();

  if (error) {
    logger.error(`Failed to create the organization: ${error}`);
    return null;
  }
  return data;
}
