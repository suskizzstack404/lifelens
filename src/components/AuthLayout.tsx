import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg text-ink grid-overlay flex flex-col">
      <header className="border-b border-line">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-[72px] flex items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 shrink-0 rounded-full border border-red/50 flex items-center justify-center">
              <svg
                viewBox="0 0 32 32"
                className="h-4 w-4 text-red"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 17h5l2.5-7 4 14 3-11 2 4h11.5" />
              </svg>
              <span className="absolute inset-0 rounded-full border border-red/30 animate-pulse-soft" />
            </div>
            <span className="font-mono text-[15px] tracking-[0.12em] text-ink">
              LIFELENS <span className="text-red">AI</span>
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[420px]">
          <p className="mono-label text-[11px] text-cyan mb-3">{subtitle}</p>
          <h1 className="font-display uppercase text-[32px] sm:text-[38px] leading-[0.95] mb-8 text-balance">
            {title}
          </h1>

          <div className="border border-line-strong bg-bg-panel/60 p-6 sm:p-8">
            {children}
          </div>

          <div className="mt-6 text-center">{footer}</div>
        </div>
      </main>
    </div>
  );
}
