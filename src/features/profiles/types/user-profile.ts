// imports
import { v4 } from "uuid";
import { SupabaseClient } from "@supabase/supabase-js";
// project
import { createBrowserClient } from "@/lib/supabase/client";
import { logger } from "@/lib/logger";
import { Json, PublicDatabase } from "@/types/database.types";
// feature-specific
import { ProfileData, ProfileUpdate } from "../types";

/**
 * The UserProfile class represents a user profile and is used to manage user data.
 */
export class UserProfile implements ProfileData {
  private _data: ProfileData;
  private supabase: SupabaseClient<PublicDatabase, "public">;

  constructor(values?: Partial<ProfileData>) {
    this.supabase = createBrowserClient<any, "public">();
    this._data = {
      id: values?.id ?? v4(),
      username: values?.username ?? "",
      avatar_url: values?.avatar_url ?? null,
      email: values?.email ?? [],
      created_at: values?.created_at ?? new Date().toISOString(),
      updated_at: values?.updated_at ?? new Date().toISOString(),
      bio: values?.bio ?? null,
      department: values?.department ?? null,
      phone: values?.phone ?? [],
      role: values?.role ?? null,
      status: values?.status ?? null,
      socials: values?.socials ?? [],
      titles: values?.titles ?? [],
      name_prefix: values?.name_prefix ?? null,
      name_suffix: values?.name_suffix ?? null,
      first_name: values?.first_name ?? null,
      middle_name: values?.middle_name ?? null,
      last_name: values?.last_name ?? null,
      display_name: values?.display_name ?? null,
      metadata: values?.metadata ?? {},
      website: values?.website ?? null,
      customer_id: values?.customer_id ?? null,
    };
  }

  // getters

  /** The unique identifier associated with each profile. */
  get id(): string {
    return this._data.id;
  }
  /** A unique alias chosen by the user */
  get username(): string {
    return this._data.username;
  }
  /** An optional url associated with the user for use as their avatar. */
  get avatar_url(): string | null {
    return this._data.avatar_url;
  }
  /** */
  get bio(): string | null {
    return this._data.bio;
  }

  get department(): string | null {
    return this._data.department;
  }

  get email(): string[] | null {
    return this._data.email;
  }

  get phone(): string[] | null {
    return this._data.phone;
  }

  get role(): string | null {
    return this._data.role;
  }

  get status(): string | null {
    return this._data.status;
  }
  get socials(): string[] | null {
    return this._data.socials;
  }
  get titles(): string[] | null {
    return this._data.titles;
  }
  // name-related fields
  get name_prefix(): string | null {
    return this._data.name_prefix;
  }

  get name_suffix(): string | null {
    return this._data.name_suffix;
  }

  get first_name(): string | null {
    return this._data.first_name;
  }

  get middle_name(): string | null {
    return this._data.middle_name;
  }

  get last_name(): string | null {
    return this._data.last_name;
  }

  get display_name(): string | null {
    return this._data.display_name;
  }

  get metadata(): Json {
    return this._data.metadata ?? {};
  }

  get website(): string | null {
    return this._data.website;
  }

  get customer_id(): string | null {
    return this._data.customer_id;
  }

  get created_at(): string {
    return this._data.created_at;
  }

  get updated_at(): string {
    return this._data.updated_at;
  }

  // setters
  /** A partial setter for updating the contents of the stored data */
  set record(values: Partial<ProfileData>) {
    this._data = { ...this._data, ...values };
  }

  set avatar_url(value: string | null) {
    this._data.avatar_url = value;

    this.supabase.from("profiles")
      .update({ avatar_url: value }, { count: "exact" })
      .eq("id", this.id)
      .then(({ error }) => {
        if (error) {
          logger.error(
            error,
            "Error updating the avatar url for the user; please try again later.",
          );
          return Promise.reject();
        }
        return Promise.resolve();
      });
  }

  set username(value: string) {
    this._data.username = value;

    this.supabase.from("profiles")
      .update({ username: value }, { count: "exact" })
      .eq("id", this.id)
      .then(({ error }) => {
        if (error) {
          logger.error(error, "Error updating username:");
          return Promise.reject();
        }
        return Promise.resolve();
      });
  }

  // methods

  /**
   * Create a new record in the database using the current profile data and the current user session.
   *
   * **note**: the method assumes the current user is the one inserting a new record into the database, throwing an error if the user is not authenticated and ensuring the
   * unique identifier of the `profile` is equal to the identifier of the records within the `auth.user` table.
   * @returns {Promise<ProfileData>} A promise that resolves to the profile data.
   * @throws {Error} If there is an error inserting the profile into the database or if the user is not authenticated.
   */
  async insertRecord(): Promise<ProfileData> {
    // fetch the current user from the auth client
    const { data: { user } } = await this.supabase.auth.getUser();
    // ensure the user is authenticated
    if (!user) {
      logger.error("User is not authenticated, cannot insert profile.");
      throw new Error("User is not authenticated");
    }
    // ensure the user profile id is also the same as the user id
    this._data.id = user.id;
    // query the database to insert the profile data and return the record
    const { data, error } = await this.supabase
      .from("profiles")
      .insert(this._data)
      .select("*")
      .single();
    // handle any errors that occur during the insert
    if (error) {
      logger.error("Error inserting profile into database");
      throw error;
    }
    // ensure the data is not null
    if (!data) {
      logger.error("No data returned from profile insert.");
      throw new Error("No data returned from profile insert");
    }
    // log the success of the event
    logger.info("Profile inserted successfully:");
    // ensure the local data is updated to match the external record
    this._data = data;
    // return the profile data
    return this._data;
  }

  /**
   * A method for updating the user profile with some new values.
   * @param {Partial<ProfileData>} values - The values to update the profile with.
   * @throws {Error} If there is an error updating the profile.
   * @returns {Promise<void>} A promise that resolves when the profile is updated.
   */
  async updateRecord(values: ProfileUpdate): Promise<void> {
    this.record = values;

    const { data, error } = await this.supabase
      .from("profiles")
      .update(this._data)
      .eq("id", this.id);

    if (error) {
      logger.error("Error updating profile:");
      throw error;
    }

    logger.info("Profile updated successfully:");
  }

  /**
   * A method for _**upserting**_ a record into the `public.profiles` table in the database.
   *
   * @param {Partial<ProfileData>} values - The values to update the profile with.
   * @throws {Error} If there is an error updating the profile.
   * @returns {Promise<void>} A promise that resolves when the profile is updated.
   */
  async upsertRecord(values: Partial<ProfileData>): Promise<void> {
    const updatedProfile = { ...this._data, ...values };
    this._data = updatedProfile;

    const { error } = await this.supabase
      .from("profiles")
      .upsert(updatedProfile)
      .eq("id", this.id);

    if (error) {
      logger.error(error, "Error updating profile:");
      return Promise.reject(error);
    }
    return Promise.resolve();
  }
}
