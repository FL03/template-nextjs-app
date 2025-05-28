// project
import { logger } from '@/lib/logger';
import {
  createBrowserClient,
  handleRealtimeSubscription,
} from '@/lib/supabase';
// feature-specific
import { ProfileData } from '../types';

type ChannelHandlerProps = {
  filter?: { key?: keyof ProfileData; value?: string };
  supabaseClient?: ReturnType<typeof createBrowserClient>;
  onDataChange?(values?: ProfileData | null): void;
};

export const profileChannel = (
  username: string,
  { filter, supabaseClient, onDataChange }: ChannelHandlerProps = { filter: { key: 'username' } }
) => {
  return (supabaseClient ?? createBrowserClient())
    .channel(`users:${username}`, { config: { private: true } })
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `username=eq.${username}`,
      },
      (payload) => {
        logger.trace(
          {
            event: payload.eventType,
          },
          'changes detected within the scope of the filter on the profiles table',
        );
        // parse the payload data;
        const data = payload.new as ProfileData;
        // if passed, use the onDataChange callback
        if (onDataChange) onDataChange(data);
      }
    )
    .subscribe(handleRealtimeSubscription);
};
