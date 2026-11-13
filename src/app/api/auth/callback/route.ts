import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const type = searchParams.get('type');
  const next = searchParams.get('next');

  if (code) {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        if (type === 'recovery' || next?.includes('reset-password')) {
          return NextResponse.redirect(`${origin}/auth/reset-password`);
        }
        if (next && next.startsWith('/') && !next.startsWith('//')) {
          return NextResponse.redirect(`${origin}${next}`);
        }
        return NextResponse.redirect(`${origin}/app`);
      }
    } catch (err) {
      console.warn('Server code exchange error:', err);
    }
  }

  // Fallback to client-side callback page
  const url = request.nextUrl.clone();
  url.pathname = '/auth/callback';
  return NextResponse.redirect(url);
}
