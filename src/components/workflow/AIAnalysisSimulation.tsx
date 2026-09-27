import { motion } from "framer-motion";

export default function AIAnalysisSimulation() {
  return (
    <div className="relative h-full grid grid-cols-[1fr_150px]">
      <div className="relative overflow-hidden border-r border-line">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-faint/15"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="absolute left-[24%] top-[30%] w-16 h-14 border border-red"
        >
          <span className="absolute -top-5 left-0 mono-label text-[9px] text-red">
            Region 01
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="absolute left-[52%] top-[52%] w-16 h-16 border border-line-strong"
        >
          <span className="absolute -top-5 left-0 mono-label text-[9px] text-ink-dim">
            Region 02
          </span>
        </motion.div>

        {/* scan pass — wrapper spans the full analysis pane (inset-0) so
            the beam travels the complete width edge-to-edge instead of
            the ~1px it moved before (percentage transform was resolving
            against the 1px-wide line itself, not the pane). */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute inset-0 animate-scan-x-loop"
            style={{ animationDuration: "3.2s" }}
          >
            <div
              className="absolute inset-y-0 left-0 w-px"
              style={{
                background: "rgba(95,212,224,0.8)",
                boxShadow: "0 0 10px 2px rgba(95,212,224,0.4)",
              }}
            />
          </div>
        </div>

        {/* active-monitoring corner blip on the flagged region */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, duration: 0.3 }}
          className="absolute left-[24%] top-[30%] -translate-y-1"
          style={{ marginLeft: "3.7rem" }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full rounded-full bg-red animate-pulse-soft" style={{ animationDuration: "1.4s" }} />
          </span>
        </motion.div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="mono-label text-[10px] text-cyan/80 leading-relaxed"
        >
          Analyzing Image
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="mono-label text-[10px] text-ink leading-relaxed"
        >
          Preliminary Observations
        </motion.p>

        <div className="mt-2">
          <div className="h-px w-full bg-line-strong overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              style={{ transformOrigin: "left", width: "78%" }}
              className="h-px bg-cyan"
            />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.85, duration: 0.3 }}
            className="mt-2 mono-label text-[10px] text-ink-dim"
          >
            Confidence
            <br />
            <span className="text-ink">78%</span>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.3 }}
          className="mt-auto mono-label text-[9px] text-ink-faint leading-relaxed"
        >
          Assessing Visible Indicators
        </motion.p>
      </div>
    </div>
  );
}
