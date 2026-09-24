export default function DashboardNav({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="px-6 md:px-10 py-5">
      <div className="mx-auto max-w-[1100px] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 shrink-0 rounded-full border border-red-200 flex items-center justify-center">
            <svg
              viewBox="0 0 32 32"
              className="h-3.5 w-3.5 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2 17h5l2.5-7 4 14 3-11 2 4h11.5" />
            </svg>
          </div>
          <span className="font-mono text-[13px] tracking-[0.1em] text-slate-800">
            LIFELENS <span className="text-red-600">AI</span>
          </span>
        </div>

        <button
          onClick={onLogout}
          className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors duration-200"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
