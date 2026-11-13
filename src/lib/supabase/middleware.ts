import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PRIMARY_SUPABASE_URL = 'https://zouixwnyhlrtkaziztsl.supabase.co';
const PRIMARY_SUPABASE_ANON_KEY = 'sb_publishable_lZy6G4bBSILZTrhFQxLJDA_A7WAEchx';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isOldProject = Boolean(envUrl && envUrl.includes('znkzuruudhxlivzbmfyo'));

  const supabaseUrl = !envUrl || isOldProject
    ? PRIMARY_SUPABASE_URL
    : envUrl;

  const supabaseAnonKey = isOldProject || (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY && !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
    ? PRIMARY_SUPABASE_ANON_KEY
    : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || PRIMARY_SUPABASE_ANON_KEY);

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const pathname = request.nextUrl.pathname;

  // Never block auth callback, recovery, or verification routes
  if (pathname.startsWith('/auth') || pathname.startsWith('/reset-password')) {
    return response;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthPage = pathname === '/' || pathname === '/login' || pathname === '/verify';
  const isProtectedRoute = pathname.startsWith('/app') || pathname.startsWith('/x-arena');

  // If user is not authenticated and attempts to access protected routes, redirect to login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    const redirectResponse = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // If user is authenticated but email is NOT verified, redirect to /verify
  if (user && isProtectedRoute && !user.email_confirmed_at) {
    const url = request.nextUrl.clone();
    url.pathname = '/verify';
    if (user.email) {
      url.searchParams.set('email', user.email);
    }
    const redirectResponse = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // If user is already authenticated with confirmed email and opens an auth page, redirect to dashboard
  if (user && user.email_confirmed_at && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/app';
    const redirectResponse = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  return response;
}
