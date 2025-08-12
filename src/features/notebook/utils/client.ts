/**
 * Created At: 2025.08.11:20:08:51
 * @author - @FL03
 * @file - client.ts
 */
"use client";
// imports
import { resolveOrigin } from "@/lib/endpoint";
import { BookData, NoteData } from "../types";

/** The endpoint to the notebook api */
const NOTEBOOK_API_ENDPOINT = "/api/notebook";

/** Returns a list of notebooks the user has created / manages using the platform api. */
export const fetchNoteBooks = async (
  userId: string,
  init?: Omit<RequestInit, "method">,
): Promise<BookData[]> => {
  // construct the url
  const url = new URL(NOTEBOOK_API_ENDPOINT, resolveOrigin());
  // setup the search parameters
  url.searchParams.append("userId", userId);
  // fetch the notes
  const { data } = await fetch(url, {
    method: "GET",
    ...init,
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch the notebooks");
    }
    return res.json();
  });
  // return the data
  return data;
};

/** Fetch the notes for the user using the configured api route. */
export const fetchNote = async (
  id: string,
  init?: Omit<RequestInit, "method">,
): Promise<NoteData[]> => {
  // construct the url
  const url = new URL(`${NOTEBOOK_API_ENDPOINT}/notes`, resolveOrigin());
  // setup the search parameters
  url.searchParams.append("id", id);
  // fetch the notes
  const { data } = await fetch(url, {
    method: "GET",
    ...init,
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch notes");
    }
    return res.json();
  });
  // return the data
  return data;
};

/** Fetch the notes for the user using the configured api route. */
export const fetchNotes = async (
  userId: string,
  init?: Omit<RequestInit, "method">,
): Promise<NoteData[]> => {
  // construct the url
  const url = new URL(`${NOTEBOOK_API_ENDPOINT}/notes`, resolveOrigin());
  // setup the search parameters
  url.searchParams.append("userId", userId);
  // fetch the notes
  const { data } = await fetch(url, {
    method: "GET",
    ...init,
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch notes");
    }
    return res.json();
  });
  // return the data
  return data;
};

/** Given a valid note id, use the `fetch` function with the `DELETE` method to remove the item from the database using the configured api route. */
export const deleteNote = async (
  id: string,
  init?: Omit<RequestInit, "method">,
) => {
  // construct the url
  const url = new URL(`${NOTEBOOK_API_ENDPOINT}/notes`, resolveOrigin());
  // setup the search parameters
  url.searchParams.append("id", id);
  // delete the note
  const { data } = await fetch(url, {
    method: "DELETE",
    ...init,
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to delete the note");
    }
    return res.json();
  });
  // return the data
  return data;
};

/** Given a valid note id, use the `fetch` function with the `DELETE` method to remove the item from the database using the configured api route. */
export const deleteNoteBook = async (
  id: string,
  init?: Omit<RequestInit, "method">,
) => {
  // construct the url
  const url = new URL(NOTEBOOK_API_ENDPOINT, resolveOrigin());
  // setup the search parameters
  url.searchParams.append("id", id);
  // delete the note
  const { data } = await fetch(url, {
    method: "DELETE",
    ...init,
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to delete the notebook");
    }
    return res.json();
  });
  // return the data
  return data;
};
