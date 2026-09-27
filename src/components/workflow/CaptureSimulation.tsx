import { motion } from "framer-motion";

function CornerGuide({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const posClass = {
    tl: "top-3 left-3",
    tr: "top-3 right-3",
    bl: "bottom-3 left-3",
    br: "bottom-3 right-3",
  }[position];
  const isRight = position === "tr" || position === "br";
  const isBottom = position === "bl" || position === "br";
  return (
    <div
      className={`absolute h-5 w-5 ${posClass} animate-pulse-soft`}
      style={{ animationDuration: "3.6s" }}
    >
      <div
        className={`absolute inset-x-0 h-px bg-cyan/60 ${isBottom ? "bottom-0" : "top-0"}`}
      />
      <div
        className={`absolute inset-y-0 w-px bg-cyan/60 ${isRight ? "right-0" : "left-0"}`}
      />
    </div>
  );
}

export default function CaptureSimulation() {
  return (
    <div className="relative h-full flex items-center justify-center p-6">
      <div className="relative w-full max-w-[280px] aspect-[4/5] rounded-2xl border border-line-strong bg-bg/60 p-4">
        {/* status bar */}
        <div className="flex items-center justify-between font-mono text-[10px] mono-label">
          <span className="text-ink-dim">Capture / Live</span>
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute h-full w-full rounded-full bg-red animate-pulse-soft" style={{ animationDuration: "1.6s" }} />
          </span>
        </div>

        {/* viewport */}
        <div className="relative mt-3 h-[calc(100%-56px)] rounded-md border border-line overflow-hidden bg-bg-raised/40">
          <CornerGuide position="tl" />
          <CornerGuide position="tr" />
          <CornerGuide position="bl" />
          <CornerGuide position="br" />

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative h-24 w-20 rounded-[50%] bg-ink-faint/25 flex items-center justify-center">
              <div
                className="h-3 w-3 rounded-full bg-ink-faint/50 animate-breathe-fast"
                style={{ animationDuration: "2.8s" }}
              />
            </div>
          </motion.div>

          {/* continuous active scan pass — the wrapper is inset-0 (full
              viewport height), so translateY resolves against the whole
              camera frame and the line genuinely reaches the bottom
              edge before looping, instead of crawling a few pixels. */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 animate-scan-tb-loop">
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                  background: "rgba(95,212,224,0.8)",
                  boxShadow: "0 0 10px 2px rgba(95,212,224,0.5)",
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[9px] mono-label">
          <span className="text-cyan/70 animate-pulse-soft" style={{ animationDuration: "4s" }}>
            Guide Frame Active
          </span>
          <span className="text-ink-dim animate-flicker">Processing...</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="absolute bottom-5 left-5 border border-cyan/40 px-2.5 py-1"
      >
        <span className="mono-label text-[10px] text-cyan/80">Image Captured</span>
      </motion.div>
    </div>
  );
}
