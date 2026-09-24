import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { WorkflowStep } from "../../lib/constants";
import SimulationPanel from "./SimulationPanel";

const textVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.03 } },
};

const line = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function WorkflowSection({
  step,
  visualization,
}: {
  step: WorkflowStep;
  visualization: ReactNode;
}) {
  return (
    <section
      id={step.id}
      className="border-t border-line py-20 md:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">
        <motion.div
          variants={textVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
        >
          <motion.div variants={line} className="flex items-center gap-4 mb-6">
            <span className="font-display text-red text-3xl leading-none">
              {step.index}
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              style={{ transformOrigin: "left" }}
              className="h-px w-10 bg-line-strong"
            />
            <span className="mono-label text-[11px] text-cyan">
              {step.phaseLabel}
            </span>
          </motion.div>

          <motion.h2
            variants={line}
            className="font-display uppercase leading-[0.96] text-[36px] sm:text-[44px] md:text-[46px] text-ink text-balance"
          >
            {step.headline}
          </motion.h2>

          <motion.p
            variants={line}
            className="mt-6 max-w-md text-[16px] leading-relaxed text-ink-dim"
          >
            {step.description}
          </motion.p>

          {step.note && (
            <motion.p
              variants={line}
              className="mt-6 mono-label text-[10px] text-cyan/80 leading-relaxed max-w-sm border-l border-cyan/30 pl-3"
            >
              {step.note}
            </motion.p>
          )}
        </motion.div>

        <SimulationPanel index={`${step.index} `}>{visualization}</SimulationPanel>
      </div>
    </section>
  );
}
