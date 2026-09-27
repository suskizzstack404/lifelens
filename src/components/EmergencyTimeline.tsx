import { motion } from "framer-motion";
import { WORKFLOW_STEPS } from "../lib/constants";

export default function EmergencyTimeline() {
  return (
    <section id="technology" className="border-t border-line py-20 md:py-28 grid-overlay">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <p className="mono-label text-[11px] text-cyan mb-4">Emergency Timeline</p>
          <h2 className="font-display uppercase text-[32px] sm:text-[40px] leading-[0.95] max-w-2xl text-balance">
            One incident. One continuous signal, start to resolve.
          </h2>
        </motion.div>

        <div className="relative overflow-x-auto pb-4">
          <div className="relative flex min-w-[880px] md:min-w-0 justify-between">
            <div className="absolute top-[7px] left-0 right-0 h-px bg-line-strong" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
              style={{ transformOrigin: "left" }}
              className="absolute top-[7px] left-0 right-0 h-px bg-cyan/60"
            />
            {WORKFLOW_STEPS.map((step, i) => (
              <motion.a
                href={`#${step.id}`}
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="relative flex flex-col items-start gap-3 pr-4 group"
              >
                <span className="relative h-3.5 w-3.5 rounded-full border border-cyan/60 bg-bg flex items-center justify-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan group-hover:bg-red transition-colors" />
                </span>
                <div>
                  <div className="font-mono text-[10px] text-red">{step.index}</div>
                  <div className="mono-label text-[9px] text-ink-dim mt-1 whitespace-nowrap">
                    {step.phaseLabel.split(" / ")[0]}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
