/**
 * Created At: 2025.10.31:13:48:39
 * @author - @FL03
 * @directory - packages/core/src/config
 * @file - types.ts
 */

/** The `AppConfig` object is used to define the _type_ of a application settings */
export type AppConfig = {
  name: string;
  slug: string;
  url: string | URL;
  homepage?: string;
  repository?: string;
  issues?: string;
  license?: string;
  author?: string;
  metadata?: { [key: string]: any; };
};

/**
 * The `AppSettings` class defines a global configuration object for the application or platform. The primary objective of the object
 * is to provide a centralized location for storing and accessing application-specific settings and metadata.
 */
export class AppSettings extends Object implements AppConfig {
  private _config!: AppConfig;

  constructor (
    {
      name,
      slug,
      url = process.env.NEXT_PUBLIC_SITE_URL,
      ...meta
    }: Partial<AppConfig> = {},
  ) {
    super();
    this._config = {
      name: name ?? "Tip Tracker",
      slug: slug ?? "pzzld",
      url: url ? (url instanceof URL ? url : new URL(url)) : new URL("http://localhost:3000"),
      ...meta,
    };
  }

  /** returns the slug, or abbreviated, application name. */
  get name(): string {
    return this._config.name;
  }

  get slug(): string {
    return this._config.slug;
  }

  get url(): URL {
    return this._config.url instanceof URL ? this._config.url : new URL(this._config.url);
  }

  get homepage(): string | undefined {
    return this._config.homepage;
  }

  get author(): string | undefined {
    return this._config.author;
  }
  get repository(): string | undefined {
    return this._config.repository;
  }
  get issues(): string | undefined {
    return this._config.issues;
  }
  get license(): string | undefined {
    return this._config.license;
  }

  getMetaValue<T = any>(key: string): T | undefined {
    return this._config.metadata?.[key] ?? undefined;
  }

  valueOf(): AppConfig {
    return this._config;
  }

  toString(): string {
    return JSON.stringify(this.valueOf(), null, 2);
  }

  toJSON(): AppConfig {
    return this.valueOf();
  }
}
