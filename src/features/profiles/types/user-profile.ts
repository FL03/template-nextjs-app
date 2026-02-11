/**
 * Created At: 2025.10.23:11:19:45
 * @author - @FL03
 * @directory - src/features/profiles/types
 * @file - user-profile.ts
 */
// imports
import { v4 } from 'uuid';
import { SupabaseClient } from '@supabase/supabase-js';
// project
import { createBrowserClient } from '@/lib/supabase/client';
import { logger } from '@/lib/logger';
import { Json, PublicDatabase } from '@/types/database.types';
// feature-specific
import { ProfileData, ProfileUpdate } from '.';
import { getUserProfile } from '../utils';

const defaultProfileData = (values?: Partial<ProfileData>): ProfileData => ({
  id: values?.id ?? v4(),
  username: values?.username ?? `user-${Math.floor(Math.random() * 10000)}`,
  avatar_url: values?.avatar_url ?? null,
  emails: values?.emails ?? [],
  primary_email: values?.primary_email ?? '',
  bio: values?.bio ?? null,
  department: values?.department ?? null,
  phone: values?.phone ?? [],
  role: values?.role ?? 'user',
  status: values?.status ?? 'active',
  socials: values?.socials ?? [],
  titles: values?.titles ?? [],
  website: values?.website ?? null,
  metadata: values?.metadata ?? {},
  subscription_status: values?.subscription_status ?? 'inactive',
  name_prefix: values?.name_prefix ?? null,
  name_suffix: values?.name_suffix ?? null,
  first_name: values?.first_name ?? null,
  middle_name: values?.middle_name ?? null,
  last_name: values?.last_name ?? null,
  display_name: values?.display_name ?? null,
  customer_id: values?.customer_id ?? null,
  primary_organization: values?.primary_organization ?? null,
  created_at: values?.created_at ?? new Date().toISOString(),
  updated_at: values?.updated_at ?? new Date().toISOString(),
});

/**
 * The UserProfile class represents a user profile and is used to manage user data.
 */
export class UserProfile extends Object {
  private _data: ProfileData;
  private supabase: SupabaseClient<PublicDatabase, 'public'>;

  constructor(values?: Partial<ProfileData>) {
    super();
    this.supabase = createBrowserClient<PublicDatabase, 'public'>();
    this._data = {
      id: values?.id ?? v4(),
      username: values?.username ?? `user-${Math.floor(Math.random() * 10000)}`,
      avatar_url: values?.avatar_url ?? null,
      emails: values?.emails ?? [],
      primary_email: values?.primary_email ?? '',
      bio: values?.bio ?? null,
      department: values?.department ?? null,
      phone: values?.phone ?? [],
      role: values?.role ?? 'user',
      status: values?.status ?? 'active',
      socials: values?.socials ?? [],
      titles: values?.titles ?? [],
      website: values?.website ?? null,
      metadata: values?.metadata ?? {},
      subscription_status: values?.subscription_status ?? 'inactive',
      name_prefix: values?.name_prefix ?? null,
      name_suffix: values?.name_suffix ?? null,
      first_name: values?.first_name ?? null,
      middle_name: values?.middle_name ?? null,
      last_name: values?.last_name ?? null,
      display_name: values?.display_name ?? null,
      customer_id: values?.customer_id ?? null,
      primary_organization: values?.primary_organization ?? null,
      created_at: values?.created_at ?? new Date().toISOString(),
      updated_at: values?.updated_at ?? new Date().toISOString(),
    };
  }
  /** Load the user profile from the database. */
  static async load(params?: {
    userId?: string;
    username?: string;
  }): Promise<UserProfile | null> {
    const data = await getUserProfile(params);
    return new UserProfile(data ?? undefined);
  }

  // getters

  /** The unique identifier associated with each profile. */
  get id(): string {
    return this.read('id');
  }
  /** A unique alias chosen by the user */
  get username(): string {
    return this.read('username');
  }
  /** An optional url associated with the user for use as their avatar. */
  get avatar_url(): string | null {
    return this.read('avatar_url');
  }
  /** */
  get bio(): string | null {
    return this.read('bio');
  }

  get department(): string | null {
    return this.read('department');
  }

  get primary_email(): string {
    return this.read('primary_email');
  }

  get emails(): string[] {
    return this.read('emails');
  }

  get phone(): string[] {
    return this.read('phone');
  }

  get role(): string {
    return this.read('role');
  }

  get status(): string {
    return this.read('status');
  }
  get socials(): string[] {
    return this.read('socials');
  }
  get titles(): string[] {
    return this.read('titles');
  }

  get subscription_status(): string {
    return this.read('subscription_status');
  }
  // name-related fields
  get name_prefix(): string | null {
    return this.read('name_prefix');
  }

  get name_suffix(): string | null {
    return this.read('name_suffix');
  }

  get first_name(): string | null {
    return this.read('first_name');
  }

  get middle_name(): string | null {
    return this.read('middle_name');
  }

  get last_name(): string | null {
    return this.read('last_name');
  }

  get display_name(): string | null {
    return this.read('display_name');
  }

  get metadata(): Json {
    return this.read('metadata');
  }

  get website(): string | null {
    return this.read('website');
  }

  get customer_id(): string | null {
    return this.read('customer_id');
  }

  get created_at(): string {
    return this.read('created_at');
  }

  get updated_at(): string {
    return this.read('updated_at');
  }

  // setters
  /** A partial setter for updating the contents of the stored data */
  set record(values: Partial<ProfileData>) {
    this._data = { ...this._data, ...values };
  }

  set avatar_url(value: string | null) {
    this._data.avatar_url = value;

    this.supabase
      .from('profiles')
      .update({ avatar_url: value }, { count: 'exact' })
      .eq('id', this.id)
      .then(({ error }) => {
        if (error) {
          logger.error(
            error,
            'Error updating the avatar url for the user; please try again later.',
          );
          return Promise.reject();
        }
        return Promise.resolve();
      });
  }

  set username(value: string) {
    this._data.username = value;

    this.supabase
      .from('profiles')
      .update({ username: value }, { count: 'exact' })
      .eq('id', this.id)
      .then(({ error }) => {
        if (error) {
          logger.error(error, 'Error updating username:');
          return Promise.reject();
        }
        return Promise.resolve();
      });
  }

  // methods
  /** Get the value of a particular field within the data */
  read<Key extends keyof ProfileData>(key: Key): ProfileData[Key] {
    return this._data[key];
  }

  valueOf(): ProfileData {
    return this._data;
  }

  toJSON(): ProfileData {
    return this._data;
  }
  /** Uses JSON to parse the date into a formatted string; */
  toString(): string {
    return JSON.stringify(this.valueOf(), undefined, 2);
  }
  /** Create a new instance of the user profile by merging the given values into the previous state.  */
  next<T extends ProfileData>(partial: Partial<T>): UserProfile {
    return new UserProfile({ ...this._data, ...partial });
  }

  /**
   * Create a new record in the database using the current profile data and the current user session.
   *
   * **note**: the method assumes the current user is the one inserting a new record into the database, throwing an error if the user is not authenticated and ensuring the
   * unique identifier of the `profile` is equal to the identifier of the records within the `auth.user` table.
   * @returns {Promise<ProfileData>} A promise that resolves to the profile data.
   * @throws {Error} If there is an error inserting the profile into the database or if the user is not authenticated.
   */
  async insertRecord(): Promise<UserProfile> {
    // fetch the current user from the auth client
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    // ensure the user is authenticated
    if (!user) {
      logger.error('User is not authenticated, cannot insert profile.');
      throw new Error('User is not authenticated');
    }
    // ensure the user profile id is also the same as the user id
    this._data.id = user.id;
    this._data.username ??= user.user_metadata?.username;
    // query the database to insert the profile data and return the record
    const { data, error } = await this.supabase
      .from('profiles')
      .upsert(this._data, { onConflict: 'id' })
      .select()
      .single();
    // handle any errors that occur during the insert
    if (error) {
      logger.error('Error inserting profile into database');
      throw error;
    }
    // ensure the data is not null
    if (!data) {
      logger.error('No data returned from profile insert.');
      throw new Error('No data returned from profile insert');
    }
    // log the success of the event
    logger.info('Profile inserted successfully:');
    // return the profile data
    return this.next(data);
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
      .from('profiles')
      .update(this._data)
      .eq('id', this.id);

    if (error) {
      logger.error('Error updating profile:');
      throw error;
    }

    logger.info('Profile updated successfully:');
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
      .from('profiles')
      .upsert(updatedProfile)
      .eq('id', this.id);

    if (error) {
      logger.error(error, 'Error updating profile:');
      return Promise.reject(error);
    }
    return Promise.resolve();
  }
}
