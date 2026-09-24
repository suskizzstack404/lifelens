import { motion } from "framer-motion";

export default function AccidentSimulation() {
  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute top-5 right-5 border border-red/50 px-2.5 py-1 z-10"
      >
        <span className="mono-label text-[10px] text-red animate-flicker">
          Time Matters
        </span>
      </motion.div>

      {/* ============ INCIDENT CORE ============
          One box, one center — rings, glow and silhouette are all
          positioned against this single box so they share the exact
          same center point. */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[220px] w-[220px]">
        {/* one-time expanding shockwave ring on entry */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.5 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border border-red/40"
        />

        {/* continuous layered rings — offset periods for organic feel */}
        <div
          className="absolute inset-0 rounded-full border border-red/20 animate-breathe"
          style={{ animationDuration: "3.8s" }}
        />
        <div
          className="absolute inset-[16%] rounded-full border border-red/15 animate-breathe-fast"
          style={{ animationDuration: "2.6s", animationDelay: "0.4s" }}
        />

        {/* breathing red incident glow, same center as the rings */}
        <div
          className="absolute inset-[12%] rounded-full animate-glow-shift"
          style={{
            background:
              "radial-gradient(circle, rgba(255,59,48,0.35), transparent 70%)",
            animationDuration: "3.2s",
          }}
        />

        {/* silhouette — stable, centered in the same core box, does not move */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="absolute inset-0 flex flex-col items-center justify-center"
        >
          <div
            className="h-16 w-16 rounded-full bg-ink-faint/40"
            style={{ filter: "drop-shadow(0 0 24px rgba(255,59,48,0.35))" }}
          />
          <div
            className="mt-1 h-28 w-24 rounded-t-[48px] bg-ink-faint/40"
            style={{ filter: "drop-shadow(0 0 30px rgba(255,59,48,0.3))" }}
          />
        </motion.div>
      </div>

      {/* continuous technical scan lines — each wrapper is sized to the
          FULL panel (inset-0), so translateY percentages resolve against
          the complete panel height and the band genuinely travels the
          whole top-to-bottom distance rather than stalling partway. */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 animate-scan-tb" style={{ animationDuration: "4.4s" }}>
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan/8 to-transparent" />
        </div>
        <div
          className="absolute inset-0 animate-scan-tb"
          style={{ animationDuration: "6s", animationDelay: "1.4s" }}
        >
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-red/6 to-transparent" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="absolute bottom-5 left-5 border border-cyan/40 px-2.5 py-1 z-10"
      >
        <span
          className="mono-label text-[10px] text-cyan/80 animate-pulse-soft"
          style={{ animationDuration: "3.4s" }}
        >
          Data Incomplete
        </span>
      </motion.div>
    </div>
  );
}
