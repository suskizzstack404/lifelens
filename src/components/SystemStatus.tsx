import { motion } from "framer-motion";
import { SYSTEM_DATE } from "../lib/constants";

export default function SystemStatus() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="flex items-center gap-2.5"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full rounded-full bg-red animate-pulse-soft" />
      </span>
      <span className="mono-label text-[11px] text-ink-dim">
        System Online / {SYSTEM_DATE}
      </span>
    </motion.div>
  );
}
