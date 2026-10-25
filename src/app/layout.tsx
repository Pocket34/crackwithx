import type { Metadata } from 'next';
import './globals.css';
import { StudentProvider } from '@/context/StudentContext';

export const metadata: Metadata = {
  title: 'CrackwithX — Understand. Prepare. Prove. Crack It.',
  description: 'AI-Powered Student Intelligence & Academic Survival System for College & University Students.',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#06080e] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <div className="ambient-bg" />
        <StudentProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            {children}
          </div>
        </StudentProvider>
      </body>
    </html>
  );
}
