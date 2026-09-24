import { motion } from "framer-motion";

export default function IncidentRadar() {
  return (
    <div className="relative border border-line rounded-sm bg-bg-panel/60 grid-overlay overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-line font-mono text-[11px]">
        <span className="text-ink-dim tracking-[0.08em]">INCIDENT VIEWPORT</span>
        <div className="text-right leading-tight text-cyan/80 tracking-[0.06em]">
          <div>LAT 40.7128&deg; N</div>
          <div>LNG 74.0060&deg; W</div>
        </div>
      </div>

      {/* Radar field — single relative coordinate system, everything below
          is positioned against this one box. */}
      <div className="relative h-[340px] sm:h-[400px] overflow-hidden">
        {/* Horizontal scan — independent from the radar sweep. Travels the
            complete viewport width, left-right-left, continuously. */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-y-0 left-0 w-full animate-scan-x">
            <div
              className="absolute inset-y-0 left-0 w-[2px]"
              style={{
                background:
                  "linear-gradient(180deg, transparent, rgba(95,212,224,0.9), transparent)",
                boxShadow: "0 0 14px 3px rgba(95,212,224,0.45)",
              }}
            />
          </div>
        </div>

        {/* Signal label — sits to the left of the radar, vertically centered
            with it, but does not participate in the radar's own geometry. */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="absolute left-6 top-1/2 -translate-y-1/2 font-mono text-[11px] text-cyan/80 tracking-[0.08em] animate-flicker"
        >
          SIGNAL / 01
        </motion.div>

        {/* ============ RADAR CORE ============
            Single source of truth for the center. Every radar element
            (rings, sweep, reticle) is positioned relative to this exact
            box, so they share one geometric center by construction. */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[220px] w-[220px] sm:h-[260px] sm:w-[260px]">
          {/* outer ring */}
          <div
            className="absolute inset-0 rounded-full border border-cyan/25 animate-breathe"
            style={{ animationDuration: "4.8s" }}
          />

          {/* inner ring — concentric via percentage inset on the same box */}
          <div
            className="absolute inset-[24%] rounded-full border border-red/30 animate-glow-shift"
            style={{ animationDuration: "3.6s" }}
          />

          {/* rotating radar beam — a wedge + hand, both anchored to this
              box's own center via transform-origin, so rotation never
              drifts away from the rings or the reticle. */}
          <div className="absolute inset-0 rounded-full overflow-hidden animate-spin-slow">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(95,212,224,0.28), transparent 28%, transparent 100%)",
              }}
            />
          </div>
          <div className="absolute inset-0 animate-spin-slow">
            <div
              className="absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2"
              style={{
                background:
                  "linear-gradient(to top, rgba(95,212,224,0.85), transparent)",
                transformOrigin: "bottom center",
              }}
            />
          </div>

          {/* center reticle — exact center of the radar core, position
              never animates, only scale / opacity / glow do */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full border-2 border-red flex items-center justify-center"
          >
            <div
              className="absolute inset-0 rounded-full border-2 border-red animate-breathe-fast"
              style={{ animationDuration: "2.3s" }}
            />
            <div className="absolute h-full w-px bg-red/50" />
            <div className="absolute w-full h-px bg-red/50" />
            <div className="h-1.5 w-1.5 rounded-full bg-red" />
          </motion.div>
        </div>

        {/* bottom divider + ready */}
        <div className="absolute bottom-0 inset-x-0 border-t border-cyan/40 flex items-center justify-end px-6 py-3">
          <span className="font-mono text-[11px] text-red tracking-[0.08em] animate-flicker">
            READY
          </span>
        </div>
      </div>
    </div>
  );
}
