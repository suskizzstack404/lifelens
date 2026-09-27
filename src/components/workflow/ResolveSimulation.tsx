import { motion } from "framer-motion";

export default function ResolveSimulation() {
  return (
    <div className="relative h-full flex flex-col items-center justify-center gap-6">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative h-24 w-24 rounded-full border border-cyan/50 flex items-center justify-center"
      >
        <div className="absolute inset-0 rounded-full border border-cyan/20 animate-breathe" />
        <motion.svg
          viewBox="0 0 24 24"
          className="h-9 w-9 text-cyan"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M4 12.5l5 5L20 6"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.55, duration: 0.3 }}
        className="text-center"
      >
        <div className="mono-label text-[11px] text-cyan">Incident Resolved</div>
        <div className="mt-1 font-mono text-[10px] text-ink-dim">
          Archived / Case #LX-0412
        </div>
      </motion.div>
    </div>
  );
}
