import { motion } from "framer-motion";

const PATH = "M10,100 C 70,100 60,20 140,20 S 220,90 270,30";

export default function TrackSimulation() {
  return (
    <div className="relative h-full flex items-center justify-center px-10">
      <div className="relative w-full max-w-[280px]">
        <svg viewBox="0 0 280 120" className="w-full overflow-visible">
          <path d={PATH} fill="none" stroke="rgba(16,21,31,0.14)" strokeWidth={1} />
          <motion.path
            d={PATH}
            fill="none"
            stroke="#5fd4e0"
            strokeWidth={1.5}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
          />
          <circle cx="10" cy="100" r="4" fill="#ff3b30" />
          <circle cx="270" cy="30" r="4" fill="#5fd4e0" />

          {/* the tracking dot rides the exact same path via native SVG
              motion — it never drifts from the drawn line, and reaches
              both endpoints on every pass. */}
          <circle r="3.5" fill="#ff3b30" filter="url(#track-glow)">
            <animateMotion dur="3.4s" repeatCount="indefinite" path={PATH} rotate="auto" />
          </circle>
          <defs>
            <filter id="track-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ff3b30" floodOpacity="0.7" />
            </filter>
          </defs>
        </svg>
      </div>

      <div className="absolute bottom-5 left-5 font-mono text-[10px] text-ink-dim">
        Status <span className="text-cyan">/ En Route</span>
      </div>
      <div className="absolute top-5 right-5 font-mono text-[10px] text-ink-dim">
        ETA <span className="text-ink">02:48</span>
      </div>
    </div>
  );
}
