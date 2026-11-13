import { redirect } from 'next/navigation';

export default function ResetPasswordAliasPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const query = new URLSearchParams(searchParams as Record<string, string>).toString();
  redirect(`/auth/reset-password${query ? `?${query}` : ''}`);
}
