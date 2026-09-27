import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { ReportStage } from "../../incidents/useIncidents";

const ILLUSTRATION_SRC = "/images/lifelens-hero-illustration.png";
// The asset's real pixel dimensions — locks the "camera window" to the
// artwork's own aspect ratio so scale=1 shows it with zero cropping.
const ART_ASPECT = "900 / 1010";

const DIAGNOSTIC_LABEL: Partial<Record<ReportStage, string>> = {
  activating: "Activating LifeLens",
  reacting: "Preparing emergency system",
  scanning: "Scanning for GPS signal",
  location_detected: "Location detected",
  address_revealed: "Confirming address",
  reporting: "Transmitting to LifeLens",
};

const LOCATION_ACTIVE_STAGES: ReportStage[] = [
  "location_detected",
  "address_revealed",
  "reporting",
  "success",
];

// Where the "camera" holds at each beat, read directly off the artwork's
// own pixels (see the grid-overlay pass used to find these): her face is
// roughly centered around (35%, 25%); the phone sits at about (70%, 58%);
// the pin/SOS cluster sits at about (78%, 35%). transformOrigin drives
// the pan — scale drives the push-in — both applied to the real image.
const CAMERA: Record<ReportStage, { scale: number; origin: string }> = {
  idle: { scale: 1, origin: "50% 38%" },
  activating: { scale: 1.04, origin: "58% 45%" },
  reacting: { scale: 1.16, origin: "68% 58%" },
  scanning: { scale: 1.16, origin: "68% 58%" },
  location_detected: { scale: 1.13, origin: "76% 35%" },
  address_revealed: { scale: 1.08, origin: "74% 38%" },
  reporting: { scale: 1.03, origin: "58% 45%" },
  success: { scale: 1, origin: "50% 38%" },
  error: { scale: 1, origin: "50% 38%" },
};

/**
 * The approved LifeLens illustration — pixel-for-pixel unchanged, never
 * redrawn or distorted. What changes per stage is which real part of it
 * the "camera" is holding on (a genuine reframe of the actual pixels,
 * not the whole PNG floating) and a light highlight clipped to the real
 * phone screen. Scene-level effects (glow, scan sweep, decorative arcs,
 * the diagnostic label) live in an outer layer and never move the art.
 */
export default function LifeLensHeroIllustration({ stage }: { stage: ReportStage }) {
  const reduceMotion = useReducedMotion();
  const prevStage = useRef<ReportStage>(stage);
  const [sequenceId, setSequenceId] = useState(0);

  const engaged = stage !== "idle";
  const reacting = stage === "reacting";
  const deviceLit = stage === "reacting" || stage === "scanning";
  const emergencyActive = stage === "reporting" || stage === "success";
  const locationActive = LOCATION_ACTIVE_STAGES.includes(stage);
  const diagnosticLabel = DIAGNOSTIC_LABEL[stage] ?? null;
  const camera = reduceMotion ? CAMERA.idle : CAMERA[stage];

  useEffect(() => {
    const wasIdle = prevStage.current === "idle";
    prevStage.current = stage;
    if (wasIdle && stage !== "idle") setSequenceId((n) => n + 1);
  }, [stage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[520px] mx-auto"
    >
      <div className="relative">
        {/* ================= depth layer — baseline calm glow ================= */}
        <div
          aria-hidden
          className="absolute inset-[-12%] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(closest-side, rgba(142,221,235,0.28), rgba(142,221,235,0.08) 55%, transparent 75%)",
            filter: "blur(6px)",
          }}
        />

        {/* activation glow — brightens only while a report is in flight */}
        <motion.div
          aria-hidden
          className="absolute inset-[-12%] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(closest-side, rgba(103,211,227,0.42), transparent 72%)",
            filter: "blur(10px)",
          }}
          animate={{ opacity: engaged ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* one soft, wide light pass during "reacting" — environment
            responding to her, separate from the camera reframe below */}
        {!reduceMotion && (
          <div aria-hidden className="absolute inset-[2%] overflow-hidden rounded-[32px] pointer-events-none z-[6]">
            <AnimatePresence>
              {reacting && (
                <motion.div
                  key={`reaction-sweep-${sequenceId}`}
                  className="absolute top-0 bottom-0 w-[38%]"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(142,221,235,0.28) 50%, transparent)",
                    filter: "blur(6px)",
                  }}
                  initial={{ left: "-40%", opacity: 0 }}
                  animate={{ left: "100%", opacity: [0, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.62, ease: "easeInOut" }}
                />
              )}
            </AnimatePresence>
          </div>
        )}

        {/* faint decorative arcs — technical markers, always present, never a border */}
        <svg
          aria-hidden
          viewBox="0 0 100 100"
          className="absolute inset-[-6%] w-[112%] h-[112%] pointer-events-none opacity-[0.12] z-[1]"
        >
          <circle cx="50" cy="50" r="46" fill="none" stroke="#0f8fa3" strokeWidth="0.4" strokeDasharray="1 3" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="#0f8fa3" strokeWidth="0.3" strokeDasharray="0.5 4" />
        </svg>

        {/* thin boundary line — draws in once around the emergency-system
            area (phone + radar + SOS) as LifeLens activates */}
        <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-[2]">
          <motion.rect
            key={`boundary-${sequenceId}`}
            x="54"
            y="14"
            width="40"
            height="60"
            rx="9"
            fill="none"
            stroke="#22b8d6"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: engaged ? 1 : 0, opacity: engaged ? 0.45 : 0 }}
            transition={{ duration: reduceMotion ? 0.3 : 0.55, ease: "easeOut" }}
          />
        </svg>

        {/* ================= diagnostic label — one line, never on the artwork ================= */}
        <div className="absolute left-1/2 top-[1%] -translate-x-1/2 z-20 pointer-events-none">
          <AnimatePresence mode="wait">
            {diagnosticLabel && (
              <motion.div
                key={diagnosticLabel}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/75 backdrop-blur px-3 py-1 text-[10px] font-medium tracking-[0.14em] text-cyan-700 uppercase shadow-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
                {diagnosticLabel}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ================= scanning beam — sweeps top to bottom while GPS is in flight ================= */}
        {!reduceMotion && (
          <div aria-hidden className="absolute inset-[2%] overflow-hidden rounded-[32px] pointer-events-none z-10">
            <AnimatePresence>
              {stage === "scanning" && (
                <motion.div
                  key="scan-beam"
                  className="absolute left-0 right-0 h-[16%]"
                  style={{
                    background:
                      "linear-gradient(to bottom, transparent, rgba(103,211,227,0.32) 45%, rgba(103,211,227,0.55) 50%, rgba(103,211,227,0.32) 55%, transparent)",
                    filter: "blur(2px)",
                  }}
                  initial={{ top: "-20%", opacity: 0 }}
                  animate={{ top: ["-20%", "108%"], opacity: [0, 1, 1, 0] }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.25 }}
                />
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ================================================================
            THE "CAMERA WINDOW" — a fixed box (the artwork's own aspect
            ratio, so nothing crops at rest) that clips a moving, scaling
            copy of the real artwork underneath. This is what makes the
            character herself — not just the effects around her — visibly
            participate: the frame pans toward the phone as she reacts,
            and toward the pin/SOS as location is detected.
        ================================================================= */}
        <div
          className="relative z-10 w-full overflow-hidden rounded-[32px]"
          style={{ aspectRatio: ART_ASPECT }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ transformOrigin: camera.origin }}
            animate={{ scale: camera.scale }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={ILLUSTRATION_SRC}
              alt="A woman calmly using the LifeLens app on her phone, sharing her live location during an emergency"
              className="absolute inset-0 w-full h-full object-cover select-none"
              draggable={false}
            />

            {/* location cluster — pixel-anchored to the pin drawn in the
                artwork, so it pans/zooms together with it */}
            <div
              aria-hidden
              className="absolute pointer-events-none"
              style={{ left: "56%", top: "23%", width: "30%", aspectRatio: "1 / 1" }}
            >
              {stage === "idle" &&
                [0, 1].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute inset-0 rounded-full"
                    style={{ border: "1px solid #67D3E3" }}
                    initial={{ opacity: 0.35, scale: 0.6 }}
                    animate={
                      reduceMotion
                        ? { opacity: 0.2, scale: 0.85 }
                        : { opacity: [0.35, 0], scale: [0.6, 1.5] }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { duration: 3.2, repeat: Infinity, ease: "easeOut", delay: i * 1.1 + 0.6 }
                    }
                  />
                ))}

              <AnimatePresence>
                {stage === "location_detected" && (
                  <motion.div key="location-burst" className="absolute inset-0">
                    <motion.span
                      className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-cyan-400"
                      initial={{ scale: 0, opacity: 0.9 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    />
                    {!reduceMotion &&
                      [0, 1].map((i) => (
                        <motion.span
                          key={i}
                          className="absolute inset-0 rounded-full"
                          style={{ border: "1.5px solid #22b8d6" }}
                          initial={{ scale: 0.3, opacity: 0.7 }}
                          animate={{ scale: 1.6, opacity: 0 }}
                          transition={{ duration: 0.7, delay: i * 0.18, ease: "easeOut" }}
                        />
                      ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {locationActive && stage !== "location_detected" && (
                <motion.span
                  className="absolute inset-0 m-auto h-2 w-2 rounded-full bg-cyan-400"
                  initial={{ opacity: 0.9 }}
                  animate={reduceMotion ? { opacity: 0.9 } : { opacity: [0.7, 1, 0.7] }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </div>

            {/* SOS ambient halo — pixel-anchored to the SOS pill in the artwork */}
            <motion.div
              aria-hidden
              className="absolute rounded-full pointer-events-none"
              style={{
                left: "65%",
                top: "16%",
                width: "34%",
                aspectRatio: "1 / 1",
                background: "radial-gradient(closest-side, rgba(240,68,79,0.35), transparent 70%)",
                filter: "blur(4px)",
              }}
              animate={
                reduceMotion
                  ? { opacity: emergencyActive ? 0.3 : 0.18 }
                  : { opacity: emergencyActive ? [0.22, 0.4, 0.22] : [0.15, 0.25, 0.15] }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: emergencyActive ? 2.6 : 5, repeat: Infinity, ease: "easeInOut" }
              }
            />

            {/* device highlight — clipped precisely to the real phone
                screen's pixel bounds, a genuine reflection sweeping
                across the actual device in her hands, not a glow behind
                her */}
            {!reduceMotion && (
              <div
                aria-hidden
                className="absolute overflow-hidden pointer-events-none rounded-[10%]"
                style={{
                  left: "63%",
                  top: "47%",
                  width: "15%",
                  height: "17%",
                  mixBlendMode: "screen",
                }}
              >
                <AnimatePresence>
                  {deviceLit && (
                    <motion.div
                      key={`device-highlight-${sequenceId}`}
                      className="absolute inset-y-0 w-[60%]"
                      style={{
                        background:
                          "linear-gradient(115deg, transparent, rgba(190,235,245,0.9) 45%, rgba(103,211,227,0.9) 55%, transparent)",
                      }}
                      initial={{ left: "-70%", opacity: 0 }}
                      animate={{ left: "110%", opacity: [0, 1, 1, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4 }}
                    />
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
