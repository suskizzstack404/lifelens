import { motion } from "framer-motion";
import ProfileStatus from "./ProfileStatus";
import LifeLensHeroIllustration from "./LifeLensHeroIllustration";
import EmergencyAction from "./EmergencyAction";
import type { ReportStage } from "../../incidents/useIncidents";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

/**
 * The entire top of the authenticated app as ONE composition: greeting,
 * headline, supporting copy, and the primary emergency action all live in
 * the same text column, with the illustration alongside — not a hero card
 * followed by a separate action card.
 */
export default function DashboardHero({
  firstName,
  role,
  confirmed,
  stage,
  stageError,
  onReport,
}: {
  firstName: string;
  role: string;
  confirmed: boolean;
  stage: ReportStage;
  stageError: string | null;
  onReport: () => void;
}) {
  return (
    <section className="grid lg:grid-cols-[1fr_0.78fr] gap-12 lg:gap-8 items-center py-8 md:py-14">
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item} className="mb-5">
          <ProfileStatus role={role} confirmed={confirmed} />
        </motion.div>

        <motion.p variants={item} className="text-[18px] text-slate-600 mb-2">
          Hello, {firstName} 👋
        </motion.p>

        <motion.h1
          variants={item}
          className="text-[38px] sm:text-[48px] lg:text-[44px] xl:text-[52px] leading-[1.08] font-semibold text-slate-900 text-balance"
        >
          Emergency assistance,
          <br />
          when you need it most.
        </motion.h1>

        <motion.p variants={item} className="mt-5 text-[16px] text-slate-500 max-w-md leading-relaxed">
          Report an incident and share your location with LifeLens — no
          forms, no waiting on hold.
        </motion.p>

        <motion.div variants={item} className="mt-8">
          <EmergencyAction stage={stage} stageError={stageError} onReport={onReport} />
        </motion.div>
      </motion.div>

      <LifeLensHeroIllustration />
    </section>
  );
}
