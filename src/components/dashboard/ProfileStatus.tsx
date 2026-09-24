export default function ProfileStatus({
  role,
  confirmed,
}: {
  role: string;
  confirmed: boolean;
}) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-slate-500">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500" />
      </span>
      <span>Session active</span>
      <span className="text-slate-300">•</span>
      <span className="text-cyan-700 font-medium">{role}</span>
      {!confirmed && (
        <>
          <span className="text-slate-300">•</span>
          <span className="text-amber-600">Verify your email</span>
        </>
      )}
    </div>
  );
}
