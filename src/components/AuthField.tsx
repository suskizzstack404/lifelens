import type { InputHTMLAttributes } from "react";

export default function AuthField({
  label,
  ...inputProps
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mono-label text-[10px] text-ink-dim block mb-2">
        {label}
      </span>
      <input
        {...inputProps}
        className="w-full bg-bg border border-line-strong px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-faint focus:outline-none focus:border-cyan/60 transition-colors"
      />
    </label>
  );
}
