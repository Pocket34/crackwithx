import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = body?.email;

    if (!rawEmail || typeof rawEmail !== 'string') {
      return NextResponse.json(
        { error: 'A valid student email address is required.' },
        { status: 400 }
      );
    }

    const email = rawEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid student email format.' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendFrom =
      process.env.RESEND_FROM_EMAIL ||
      process.env.MAIL_FROM ||
      'CRACKWITHX <onboarding@resend.dev>';

    // Determine base URL
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const origin =
      request.headers.get('origin') ||
      (host ? `${proto}://${host}` : 'https://crackwithx.vercel.app');

    const redirectTo = `${origin}/auth/callback?next=/auth/reset-password`;

    // If Supabase Service Role Key is available, use Supabase Admin generateLink
    if (supabaseUrl && serviceRoleKey) {
      const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: {
          redirectTo,
        },
      });

      if (linkError) {
        // Clear message if user is not registered
        if (
          linkError.message.toLowerCase().includes('not found') ||
          linkError.message.toLowerCase().includes('user does not exist')
        ) {
          return NextResponse.json(
            {
              error: 'No student account found with this email address. Please sign up first.',
              code: 'user_not_found',
            },
            { status: 404 }
          );
        }

        return NextResponse.json(
          { error: linkError.message || 'Failed to generate password recovery link.' },
          { status: 400 }
        );
      }

      const actionLink = linkData?.properties?.action_link;
      const emailOtp = linkData?.properties?.email_otp;

      // If Resend API key is configured, send the recovery email directly via Resend REST API
      if (resendApiKey && actionLink) {
        try {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: resendFrom,
              to: [email],
              subject: 'Reset your CrackwithX student password',
              html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <style>
                      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #06080e; color: #f1f5f9; margin: 0; padding: 32px 16px; }
                      .container { max-width: 520px; margin: 0 auto; background-color: #0a0e1c; border: 1px solid #1e293b; border-radius: 20px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
                      .badge { display: inline-block; background-color: rgba(6, 182, 212, 0.1); border: 1px solid rgba(6, 182, 212, 0.3); color: #22d3ee; font-size: 11px; font-weight: bold; letter-spacing: 0.1em; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 16px; }
                      h1 { font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 12px 0; }
                      p { font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 0 0 20px 0; }
                      .btn { display: inline-block; background: linear-gradient(135deg, #06b6d4, #4f46e5); color: #ffffff !important; font-weight: 700; font-size: 13px; text-decoration: none; padding: 14px 28px; border-radius: 12px; margin: 12px 0 24px 0; letter-spacing: 0.05em; text-align: center; }
                      .otp-box { background-color: #0f172a; border: 1px dashed #334155; border-radius: 12px; padding: 16px; text-align: center; margin: 16px 0 24px 0; }
                      .otp-code { font-family: monospace; font-size: 24px; font-weight: 900; letter-spacing: 6px; color: #38bdf8; }
                      .footer { font-size: 11px; color: #64748b; line-height: 1.5; border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 24px; }
                      .footer a { color: #38bdf8; text-decoration: none; }
                    </style>
                  </head>
                  <body>
                    <div class="container">
                      <div class="badge">Password Recovery</div>
                      <h1>Reset your CrackwithX password</h1>
                      <p>We received a request to reset the password for your student intelligence account (<strong>${email}</strong>). Click the button below to choose a new password:</p>
                      
                      <div style="text-align: center;">
                        <a href="${actionLink}" class="btn">RESET PASSWORD NOW</a>
                      </div>

                      ${
                        emailOtp
                          ? `
                        <div class="otp-box">
                          <p style="margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">Or enter this 6-digit recovery code:</p>
                          <div class="otp-code">${emailOtp}</div>
                        </div>
                      `
                          : ''
                      }

                      <p style="font-size: 12px; color: #64748b;">If the button does not work, copy and paste this link into your browser:</p>
                      <p style="font-size: 11px; word-break: break-all; color: #38bdf8;"><a href="${actionLink}" style="color: #38bdf8;">${actionLink}</a></p>

                      <div class="footer">
                        <p style="margin: 0;">This link is valid for 1 hour. If you did not request a password reset, you can safely ignore this email — your account remains fully secure.</p>
                        <p style="margin: 8px 0 0 0;">© 2026 CrackwithX — Student Intelligence System</p>
                      </div>
                    </div>
                  </body>
                </html>
              `,
            }),
          });

          const resendData = await resendResponse.json().catch(() => ({}));

          if (!resendResponse.ok) {
            console.error('Resend API error:', resendData);
            // Catch sandbox domain restrictions explicitly
            const errMsg = resendData?.message || 'Email delivery service rejected the request.';
            return NextResponse.json(
              {
                error: `Resend delivery notice: ${errMsg}`,
                resendError: resendData,
              },
              { status: 502 }
            );
          }

          return NextResponse.json({
            success: true,
            deliveryMethod: 'resend_api',
            message: 'Password recovery email dispatched successfully via Resend API.',
          });
        } catch (fetchErr: any) {
          console.error('Resend fetch exception:', fetchErr);
          return NextResponse.json(
            { error: fetchErr.message || 'Failed to dispatch email via Resend API.' },
            { status: 502 }
          );
        }
      }

      // If Resend API key is not configured, we return success with fallback instruction
      return NextResponse.json({
        success: true,
        deliveryMethod: 'supabase_admin',
        message: 'Recovery link generated. Please verify delivery.',
      });
    }

    // If Service Role Key is not configured on server, signal client to use supabase.auth.resetPasswordForEmail
    return NextResponse.json({
      fallbackToClient: true,
      message: 'Server keys not configured; use client-side Supabase auth recovery.',
    });
  } catch (err: any) {
    console.error('Recover route exception:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error while processing recovery request.' },
      { status: 500 }
    );
  }
}
