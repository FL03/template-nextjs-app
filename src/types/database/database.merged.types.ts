import { Database as PublicDb } from './database.public.types';

// import { Database as BloggerDb } from './database.blogger.types';

export type Database = {
  // blogger: BloggerDb['blogger'];
  public: PublicDb['public'];
};

export type Tables = {
  public: PublicDb['public']['Tables'] & PublicDb['public']['Views'];
};

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];