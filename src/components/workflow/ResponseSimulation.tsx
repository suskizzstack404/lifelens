import { motion } from "framer-motion";

export default function ResponseSimulation() {
  return (
    <div className="relative h-full flex flex-col justify-center px-8 gap-6">
      <div className="flex items-center justify-between font-mono text-[10px] mono-label text-ink-dim">
        <span>Incoming Transmission</span>
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute h-full w-full rounded-full bg-cyan animate-pulse-soft" />
        </span>
      </div>

      <div className="border border-line-strong p-5">
        <div className="mono-label text-[10px] text-ink-dim">Hospital</div>
        <div className="font-display uppercase text-[26px] text-ink mt-1">
          St. Mary Medical
        </div>

        {/* connection track — a traveling pulse actually crosses the full
            track (scaleX transform, not a width tween), representing the
            signal reaching the hospital rather than a bar just "filling". */}
        <div className="mt-4 relative h-px max-w-[160px] bg-line-strong overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
            style={{ transformOrigin: "left" }}
            className="absolute inset-0 bg-cyan/40"
          />
          <motion.div
            className="absolute top-1/2 left-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-cyan"
            style={{ boxShadow: "0 0 8px 2px rgba(95,212,224,0.6)" }}
            initial={{ x: 0, opacity: 0 }}
            whileInView={{ x: [0, 160, 160], opacity: [0, 1, 0] }}
            viewport={{ once: true }}
            transition={{
              duration: 1,
              times: [0, 0.9, 1],
              delay: 0.15,
              repeat: Infinity,
              repeatDelay: 2.2,
              ease: "easeOut",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.75, duration: 0.3 }}
          className="mt-4 flex items-center gap-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-red animate-pulse-soft" style={{ animationDuration: "2s" }} />
          <span className="mono-label text-[10px] text-red">Accepted</span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.95, duration: 0.3 }}
        className="font-mono text-[10px] text-ink-dim tracking-[0.06em]"
      >
        ETA <span className="text-ink">04:12</span>
      </motion.div>
    </div>
  );
}
