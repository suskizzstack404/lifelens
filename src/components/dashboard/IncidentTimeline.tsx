import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { Incident } from "../../lib/types";

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function statusDetail(status: Incident["status"]) {
  switch (status) {
    case "LOCATED":
      return "Location captured";
    case "REPORTED":
      return "Awaiting location";
    case "RESOLVED":
      return "Resolved";
    case "CANCELLED":
      return "Cancelled";
    default:
      return status.charAt(0) + status.slice(1).toLowerCase();
  }
}

export default function IncidentTimeline({
  incidents,
  loading,
  listError,
}: {
  incidents: Incident[];
  loading: boolean;
  listError: string | null;
}) {
  return (
    <section className="py-10">
      <h2 className="text-[13px] font-semibold tracking-wide text-slate-400 uppercase mb-6">
        Recent Activity
      </h2>

      {loading && (
        <p className="text-[14px] text-slate-400">Loading your activity...</p>
      )}

      {!loading && listError && (
        <p className="text-[14px] text-red-600" role="alert">
          {listError}
        </p>
      )}

      {!loading && !listError && incidents.length === 0 && (
        <div className="flex flex-col items-start gap-3 py-6">
          <div className="h-10 w-10 rounded-full bg-cyan-50 flex items-center justify-center">
            <MapPin size={18} className="text-cyan-600" />
          </div>
          <p className="text-[15px] font-medium text-slate-700">No incidents yet</p>
          <p className="text-[14px] text-slate-400 max-w-sm">
            When you report an emergency, your incident activity will appear
            here.
          </p>
        </div>
      )}

      {!loading && incidents.length > 0 && (
        <ol className="relative">
          {incidents.map((incident, i) => (
            <motion.li
              key={incident.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="relative pl-8 pb-8 last:pb-0"
            >
              {i < incidents.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-[7px] top-4 bottom-0 w-px bg-slate-200"
                />
              )}
              <span
                aria-hidden
                className={`absolute left-0 top-1 h-3.5 w-3.5 rounded-full border-2 ${
                  incident.status === "RESOLVED"
                    ? "bg-emerald-500 border-emerald-500"
                    : "bg-white border-red-500"
                }`}
              />
              <p className="text-[15px] font-medium text-slate-800">
                Incident reported
              </p>
              <p className="text-[13px] text-slate-500 mt-0.5">
                {statusDetail(incident.status)}
              </p>
              {incident.latitude !== null && incident.longitude !== null && (
                <p className="text-[13px] text-cyan-700 mt-0.5">
                  {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
                </p>
              )}
              <p className="text-[13px] text-slate-400 mt-1">
                {relativeTime(incident.created_at)}
              </p>
            </motion.li>
          ))}
        </ol>
      )}
    </section>
  );
}
