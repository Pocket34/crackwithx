// Supabase Edge Function: send-recovery-email
// Serves as a secure alternative to native SMTP when Resend API direct integration is preferred.
// Deploy via: supabase functions deploy send-recovery-email --no-verify-jwt

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Student email is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? '';
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') ?? 'CRACKWITHX <onboarding@resend.dev>';
    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://crackwithx.vercel.app';

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Generate secure recovery link without relying on SMTP
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email.trim().toLowerCase(),
      options: {
        redirectTo: `${siteUrl}/auth/callback?next=/auth/reset-password`,
      },
    });

    if (linkError) {
      return new Response(
        JSON.stringify({ error: linkError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const actionLink = linkData?.properties?.action_link;
    const emailOtp = linkData?.properties?.email_otp;

    // Send email using Resend REST API
    if (resendApiKey && actionLink) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: 'Reset your CrackwithX password',
          html: `
            <h2>Reset your CrackwithX password</h2>
            <p>Click the link below to set a new password:</p>
            <p><a href="${actionLink}" style="background:#06b6d4;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">Reset Password</a></p>
            ${emailOtp ? `<p>Or enter this 6-digit recovery code: <strong>${emailOtp}</strong></p>` : ''}
          `,
        }),
      });

      const resendJson = await resendRes.json();
      if (!resendRes.ok) {
        return new Response(
          JSON.stringify({ error: resendJson.message || 'Resend delivery rejected' }),
          { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Password recovery email sent successfully.' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
