/**
 * Created At: 2025.07.19:07:58:40
 * @author - @FL03
 * @file - endpoint.ts
 */
// imports
import type { UrlObject } from "url";

/**
 * The `Endpoint` class serves as a base class for creating endpoint objects.
 */
export class Endpoint {
  private _url: URL;

  constructor(url: string | UrlObject | URL) {
    const parsedUrl = (url instanceof URL || typeof url === "string")
      ? url
      : (url as UrlObject).href ?? undefined;
    if (!parsedUrl) {
      throw new Error("Invalid URL provided to Endpoint constructor.");
    }
    // try to create a new URL object
    try {
      this._url = new URL(parsedUrl);
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  // getters
  get href(): string {
    return this._url.href;
  }
  
  get pathname(): string {
    return this._url.pathname;
  }
}
