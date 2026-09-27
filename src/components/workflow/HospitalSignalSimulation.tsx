import { motion } from "framer-motion";

const hospitals = [
  { name: "ST. MARY MEDICAL", distance: "0.6 KM" },
  { name: "NORTHVIEW GENERAL", distance: "1.4 KM" },
  { name: "UNION TRAUMA CENTER", distance: "2.1 KM" },
];

export default function HospitalSignalSimulation() {
  return (
    <div className="relative h-full flex items-center justify-center">
      <div className="relative h-[200px] w-[200px]">
        <div className="absolute inset-0 rounded-full border border-line-strong" />
        <div className="absolute inset-[20%] rounded-full border border-cyan/20" />
        <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red animate-pulse-soft" />

        {hospitals.map((h, i) => {
          const angle = (i / hospitals.length) * 2 * Math.PI - Math.PI / 2;
          const angleDeg = (angle * 180) / Math.PI;
          const r = 92;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          return (
            <div key={h.name} className="absolute left-1/2 top-1/2 h-0 w-0">
              {/* faint static connection path, incident → hospital */}
              <div
                className="absolute h-px bg-cyan/15 origin-left"
                style={{ width: r, transform: `rotate(${angleDeg}deg)` }}
              />

              {/* traveling signal — actually moves the full incident→hospital
                  distance (r px, computed exactly) rather than an
                  approximate percentage, so it reliably reaches the
                  hospital blip before fading and restarting. */}
              <motion.div
                className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan"
                style={{ boxShadow: "0 0 6px 2px rgba(95,212,224,0.6)" }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                whileInView={{
                  x: [0, x, x],
                  y: [0, y, y],
                  opacity: [0, 1, 0],
                }}
                viewport={{ once: true }}
                transition={{
                  duration: 1.8,
                  times: [0, 0.85, 1],
                  repeat: Infinity,
                  repeatDelay: 1.2 + i * 0.3,
                  delay: 0.6 + i * 0.5,
                  ease: "easeOut",
                }}
              />

              {/* hospital signal blip — endpoint of the connection */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 + i * 0.18, duration: 0.35, ease: "easeOut" }}
                className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan animate-pulse-soft"
                style={{
                  left: x,
                  top: y,
                  animationDuration: `${2.4 + i * 0.4}s`,
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="absolute right-5 top-5 flex flex-col gap-2.5">
        {hospitals.map((h, i) => (
          <motion.div
            key={h.name}
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.35 }}
            className="font-mono text-[9px] text-right leading-tight"
          >
            <div className="text-ink-dim tracking-[0.05em]">{h.name}</div>
            <div className="text-cyan/70">{h.distance}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
