import { motion } from "framer-motion";
import SystemStatus from "../SystemStatus";
import IncidentRadar from "./IncidentRadar";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function HeroSection() {
  return (
    <section id="top" className="relative pt-[72px] grid-overlay">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24 grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">
        <div>
          <SystemStatus />

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-10"
          >
            <motion.p
              variants={item}
              className="mono-label text-[12px] text-cyan mb-6 leading-relaxed max-w-xs"
            >
              Smart Accident Response
              <br />& Emergency Assistance
            </motion.p>

            <h1 className="font-display uppercase leading-[0.92] text-[15vw] sm:text-[68px] md:text-[76px] lg:text-[64px] xl:text-[76px]">
              <motion.span variants={item} className="block text-ink">
                When Every
              </motion.span>
              <motion.span variants={item} className="block text-red">
                Second
              </motion.span>
              <motion.span variants={item} className="block text-ink">
                Matters.
              </motion.span>
            </h1>

            <motion.p
              variants={item}
              className="mt-8 max-w-md text-[16px] leading-relaxed text-ink-dim"
            >
              AI-powered emergency assistance that helps transform accident
              information into actionable emergency support.
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <IncidentRadar />
        </motion.div>
      </div>
    </section>
  );
}
