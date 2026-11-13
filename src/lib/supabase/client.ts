import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const PRIMARY_SUPABASE_URL = 'https://zouixwnyhlrtkaziztsl.supabase.co';
const PRIMARY_SUPABASE_ANON_KEY = 'sb_publishable_lZy6G4bBSILZTrhFQxLJDA_A7WAEchx';

let client: SupabaseClient | null = null;

export function createClient() {
  if (client) {
    return client;
  }

  // Guard against outdated deployment configuration pointing to the old znkz project
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isOldProject = Boolean(envUrl && envUrl.includes('znkzuruudhxlivzbmfyo'));

  const supabaseUrl = !envUrl || isOldProject
    ? PRIMARY_SUPABASE_URL
    : envUrl;

  const supabaseAnonKey = isOldProject || (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    ? PRIMARY_SUPABASE_ANON_KEY
    : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || PRIMARY_SUPABASE_ANON_KEY);

  if (typeof window !== 'undefined') {
    try {
      const projectHost = supabaseUrl ? new URL(supabaseUrl).host : 'UNDEFINED';
      console.log('[CrackwithX] Supabase Browser Client initialized -> Host:', projectHost);
    } catch {
      // Safe fallback if URL parsing fails
    }
  }

  client = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return client;
}
