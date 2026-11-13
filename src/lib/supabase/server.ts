import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const PRIMARY_SUPABASE_URL = 'https://zouixwnyhlrtkaziztsl.supabase.co';
const PRIMARY_SUPABASE_ANON_KEY = 'sb_publishable_lZy6G4bBSILZTrhFQxLJDA_A7WAEchx';

export function createClient() {
  const cookieStore = cookies();
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isOldProject = Boolean(envUrl && envUrl.includes('znkzuruudhxlivzbmfyo'));

  const supabaseUrl = !envUrl || isOldProject
    ? PRIMARY_SUPABASE_URL
    : envUrl;

  const supabaseAnonKey = isOldProject || (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    ? PRIMARY_SUPABASE_ANON_KEY
    : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || PRIMARY_SUPABASE_ANON_KEY);

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}
