import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import type { ReportStage } from "../../incidents/useIncidents";

const STAGE_COPY: Record<ReportStage, { label: string; sub?: string }> = {
  idle: { label: "Report an Incident" },
  activating: { label: "Activating LifeLens...", sub: "Waking up the emergency system." },
  reacting: { label: "Activating LifeLens...", sub: "Preparing your emergency channel." },
  scanning: { label: "Scanning...", sub: "Requesting your device's GPS position." },
  location_detected: { label: "Location detected", sub: "Coordinates received." },
  address_revealed: { label: "Confirming location...", sub: "Matching coordinates to an address." },
  reporting: { label: "Reporting incident...", sub: "Saving to LifeLens." },
  success: { label: "Incident reported", sub: "Your location has been recorded." },
  error: { label: "Couldn't complete that", sub: "See the message below." },
};

const BUSY_STAGES: ReportStage[] = [
  "activating",
  "reacting",
  "scanning",
  "location_detected",
  "address_revealed",
  "reporting",
];

/**
 * Just the call-to-action itself — no surrounding card. It's meant to sit
 * directly in the hero's text column, one element in a single composition
 * rather than a separate boxed section.
 */
export default function EmergencyAction({
  stage,
  stageError,
  onReport,
}: {
  stage: ReportStage;
  stageError: string | null;
  onReport: () => void;
}) {
  const busy = BUSY_STAGES.includes(stage);
  const copy = STAGE_COPY[stage];

  return (
    <div>
      <div className="relative inline-block">
        {stage === "idle" && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-red-500/25"
            animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <motion.button
          type="button"
          onClick={onReport}
          disabled={busy}
          aria-label={copy.label}
          whileHover={busy ? undefined : { scale: 1.01 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.18 }}
          className="relative whitespace-nowrap rounded-full bg-red-600 px-8 py-4 text-[15px] font-semibold text-white shadow-[0_10px_28px_rgba(220,38,38,0.28)] transition-colors duration-200 hover:bg-red-700 active:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {busy && <Loader2 size={18} className="animate-spin" aria-hidden />}
          {stage === "success" && <CheckCircle2 size={18} aria-hidden />}
          {stage === "idle" ? "Report an Incident" : copy.label}
        </motion.button>
      </div>

      {/* Announced to assistive tech as the stage changes, without relying
          on color alone to carry the status. */}
      <div aria-live="polite" className="min-h-[20px] mt-3">
        <AnimatePresence mode="wait">
          {stage !== "idle" && stage !== "error" && (
            <motion.p
              key={stage}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className="text-[13px] text-slate-500 flex items-center gap-1.5"
            >
              {copy.sub}
            </motion.p>
          )}
        </AnimatePresence>

        {stage === "error" && stageError && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="text-[13px] text-red-600 flex items-center gap-1.5"
          >
            <AlertTriangle size={14} aria-hidden />
            {stageError}
          </motion.p>
        )}
      </div>
    </div>
  );
}
