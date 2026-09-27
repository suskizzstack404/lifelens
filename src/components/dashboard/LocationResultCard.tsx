import { AnimatePresence, motion } from "framer-motion";
import { MapPin, CheckCircle2 } from "lucide-react";
import type { AddressStatus, ReportStage } from "../../incidents/useIncidents";
import type { GeocodedAddress } from "../../lib/reverseGeocode";

const VISIBLE_STAGES: ReportStage[] = [
  "location_detected",
  "address_revealed",
  "reporting",
  "success",
];

/**
 * A small, translucent floating result — never a giant dashboard card.
 * It only ever shows real data: real coordinates once GPS resolves, and
 * a real reverse-geocoded address once (and only if) that lookup
 * succeeds. If geocoding fails, it says so plainly rather than guessing.
 */
export default function LocationResultCard({
  stage,
  addressStatus,
  address,
}: {
  stage: ReportStage;
  addressStatus: AddressStatus;
  address: GeocodedAddress | null;
}) {
  const visible = VISIBLE_STAGES.includes(stage);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[460px] mx-auto mt-5 rounded-2xl bg-white/80 backdrop-blur-md px-5 py-4 shadow-[0_8px_28px_rgba(15,143,163,0.12)] ring-1 ring-cyan-900/5"
        >
          {stage === "success" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-1.5 text-[12px] font-medium text-emerald-600 mb-1.5"
            >
              <CheckCircle2 size={13} aria-hidden />
              Emergency incident recorded
            </motion.p>
          )}

          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-50">
              <MapPin size={13} className="text-cyan-600" aria-hidden />
            </span>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.14em] text-cyan-700 uppercase">
                Location detected
              </p>

              <AnimatePresence mode="wait">
                {addressStatus === "pending" && (
                  <motion.p
                    key="pending"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
                    className="text-[14px] text-slate-400 mt-0.5"
                  >
                    Matching your coordinates...
                  </motion.p>
                )}

                {addressStatus === "found" && address && (
                  <motion.div
                    key="found"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-0.5"
                  >
                    <p className="text-[15px] font-semibold text-slate-800 leading-snug truncate">
                      {address.primary}
                    </p>
                    {address.secondary && (
                      <p className="text-[13px] text-slate-500 leading-snug truncate">
                        {address.secondary}
                      </p>
                    )}
                  </motion.div>
                )}

                {addressStatus === "unavailable" && (
                  <motion.p
                    key="unavailable"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-[14px] text-slate-500 mt-0.5"
                  >
                    Coordinates captured
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
