import { motion } from "framer-motion";

export default function LocationSimulation() {
  return (
    <div className="relative h-full flex items-center justify-center">
      <div className="absolute top-5 left-5 font-mono text-[10px] text-ink-dim leading-relaxed">
        <div>LAT 40.7128&deg; N</div>
        <div>LNG 74.0060&deg; W</div>
      </div>

      <div className="relative h-[220px] w-[220px]">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: [0, 0.4, 0] }}
            viewport={{ once: true }}
            transition={{
              duration: 2.4,
              delay: i * 0.6,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full border border-cyan/50"
          />
        ))}
        <div className="absolute inset-0 rounded-full border border-line-strong" />
        <div className="absolute inset-[35%] rounded-full border border-red/30" />

        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.35, ease: "easeOut" }}
          className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red animate-pulse-soft"
          style={{ boxShadow: "0 0 18px 4px rgba(255,59,48,0.5)", animationDuration: "2.2s" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.35 }}
        className="absolute bottom-5 right-5 border border-cyan/40 px-2.5 py-1"
      >
        <span className="mono-label text-[10px] text-cyan/80">Location Locked</span>
      </motion.div>
    </div>
  );
}
