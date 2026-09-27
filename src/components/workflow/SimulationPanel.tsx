import type { ReactNode } from "react";
import { motion } from "framer-motion";

export default function SimulationPanel({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative border border-line rounded-sm bg-bg-panel/60 grid-overlay overflow-hidden"
    >
      <div className="flex items-center gap-2 px-5 py-4 border-b border-line font-mono text-[11px] tracking-[0.08em]">
        <span className="text-ink-dim">LIFELENS / {index}</span>
        <span className="text-cyan">SIMULATION</span>
      </div>
      <div className="relative h-[360px] sm:h-[420px]">{children}</div>
    </motion.div>
  );
}
