import { motion, useReducedMotion, type TargetAndTransition, type Transition } from "framer-motion";

/* Palette locked to the LifeLens brand adaptation of the reference art. */
const NAVY = "#142442";
const NAVY_SOFT = "#263A60";
const SKIN = "#9DB4EE";
const SKIN_SHADE = "#8AA1DE";
const CLOTHING = "#F2F4F7";
const CLOTHING_LINE = "#D9E0EA";
const RED = "#F0444F";
const CYAN = "#11A8C7";
const CYAN_LIGHT = "#8EDDEB";
const CYAN_LIGHTER = "#B9ECF5";

/**
 * A young woman, hair pulled into a bun with two face-framing strands,
 * shown chest-up in an oversized light sweater, both hands holding a dark
 * phone held to her side. Above the phone, clear of her face: concentric
 * cyan location rings around a red pin, a red SOS pill, and a few
 * emergency ticks. Flat 2D editorial vector style, transparent
 * background, soft cyan/red atmospheric glow confined to the signal
 * cluster.
 */
export default function LifeLensHeroIllustration() {
  const reduceMotion = useReducedMotion();

  const loop = (animate: TargetAndTransition, transition: Transition) =>
    reduceMotion ? {} : { animate, transition };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[460px] mx-auto"
    >
      <motion.div
        {...loop(
          { y: [0, -8, 0] },
          { duration: 7, repeat: Infinity, ease: "easeInOut" }
        )}
      >
        <svg viewBox="0 0 480 560" className="w-full h-auto overflow-visible">
          <defs>
            <radialGradient id="ll-cyan-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={CYAN_LIGHT} stopOpacity="0.5" />
              <stop offset="100%" stopColor={CYAN_LIGHT} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ll-red-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={RED} stopOpacity="0.3" />
              <stop offset="100%" stopColor={RED} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ll-phone-face" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1B2C4F" />
              <stop offset="100%" stopColor={NAVY} />
            </linearGradient>
          </defs>

          {/* ================= atmospheric glow, confined to the signal cluster ================= */}
          <circle cx="352" cy="185" r="150" fill="url(#ll-cyan-glow)" />
          <circle cx="430" cy="118" r="70" fill="url(#ll-red-glow)" />

          {/* ================= sweater / body ================= */}
          <path
            d="M55,560
               C55,435 78,362 128,330
               C155,313 185,305 215,305
               C245,305 270,312 292,326
               C330,348 352,400 358,470
               C361,505 362,533 362,560 Z"
            fill={CLOTHING}
          />
          <path d="M138,340 C124,398 120,470 128,555" stroke={CLOTHING_LINE} strokeWidth="2" fill="none" opacity="0.7" />
          <path d="M248,314 C264,378 270,470 262,555" stroke={CLOTHING_LINE} strokeWidth="2" fill="none" opacity="0.7" />

          {/* left arm: sleeve reaching across the body, finger tapping the screen */}
          <path
            d="M108,558 C94,468 100,390 146,350 C172,328 208,320 244,320"
            stroke={CLOTHING}
            strokeWidth="52"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M246,323 C268,320 288,323 300,332" stroke={SKIN} strokeWidth="26" strokeLinecap="round" fill="none" />
          <path d="M300,320 C312,306 322,296 330,288" stroke={SKIN} strokeWidth="14" strokeLinecap="round" fill="none" />

          {/* right arm: sleeve cradling the phone from below */}
          <path
            d="M340,558 C359,468 366,406 358,376 C352,354 356,334 372,322"
            stroke={CLOTHING}
            strokeWidth="54"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="384" cy="398" r="23" fill={SKIN_SHADE} />

          {/* ================= phone (unrotated, so hands line up cleanly) ================= */}
          <g>
            <rect x="300" y="250" width="92" height="168" rx="16" fill="url(#ll-phone-face)" />
            <rect x="309" y="265" width="74" height="130" rx="7" fill="#F5F8FB" />
            <circle cx="300" cy="333" r="14" fill={SKIN} />
            <circle cx="386" cy="398" r="14" fill={SKIN_SHADE} />

            <motion.path
              d="M319,331 L331,331 L337,317 L345,347 L353,331 L373,331"
              fill="none"
              stroke={RED}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.6, ease: "easeOut" }}
            />
            <circle cx="346" cy="373" r="5" fill={CYAN} />
            <circle cx="346" cy="373" r="9" fill="none" stroke={CYAN} strokeWidth="1.5" opacity="0.5" />
          </g>

          {/* ================= head / face ================= */}
          <g>
            <path d="M197,244 L233,244 L233,282 C215,296 197,296 197,282 Z" fill={SKIN_SHADE} />
            <circle cx="215" cy="196" r="60" fill={SKIN} />
            <circle cx="159" cy="200" r="8" fill={SKIN} />
            <circle cx="271" cy="200" r="8" fill={SKIN} />

            <path
              d="M167,176 C151,206 147,246 159,286 C163,298 173,302 181,296 C171,262 169,226 177,188 Z"
              fill={NAVY}
            />
            <path
              d="M263,176 C279,206 283,246 271,286 C267,298 257,302 249,296 C259,262 261,226 253,188 Z"
              fill={NAVY_SOFT}
            />
            <path
              d="M155,196
                 C155,150 181,118 215,118
                 C249,118 275,150 275,196
                 C275,178 261,166 215,166
                 C169,166 155,178 155,196 Z"
              fill={NAVY}
            />
            <path
              d="M193,104 C193,86 235,86 237,104 C239,120 223,130 215,130 C207,130 191,120 193,104 Z"
              fill={NAVY_SOFT}
            />

            <path d="M193,192 q6,-6 13,0" fill="none" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
            <path d="M224,192 q6,-6 13,0" fill="none" stroke={NAVY} strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="200" cy="200" rx="3.4" ry="4.2" fill={NAVY} />
            <ellipse cx="231" cy="200" rx="3.4" ry="4.2" fill={NAVY} />
            <path d="M215,208 L212,220" fill="none" stroke={SKIN_SHADE} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M201,230 q14,10 28,0" fill="none" stroke={NAVY} strokeWidth="2.6" strokeLinecap="round" />
          </g>

          {/* ================= location signal cluster, clear of the face ================= */}
          <g>
            {[70, 46, 24].map((r, i) => (
              <motion.circle
                key={r}
                cx="352"
                cy="165"
                r={r}
                fill="none"
                stroke={CYAN_LIGHTER}
                strokeWidth="1.6"
                opacity="0.5"
                {...loop(
                  { opacity: [0.55, 0.15, 0.55], scale: [1, 1.08, 1] },
                  { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.35 }
                )}
                style={{ transformOrigin: "352px 165px" }}
              />
            ))}

            <path
              d="M352,139 C368,139 380,151 380,167 C380,187 352,211 352,211 C352,211 324,187 324,167 C324,151 336,139 352,139 Z"
              fill={RED}
            />
            <circle cx="352" cy="166" r="9" fill="#FFFFFF" />

            <rect x="406" y="100" width="68" height="34" rx="17" fill={RED} />
            <text
              x="440"
              y="122"
              textAnchor="middle"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              fontSize="15"
              fontWeight="700"
              fill="#FFFFFF"
              letterSpacing="1"
            >
              SOS
            </text>

            <motion.g
              stroke={RED}
              strokeWidth="3"
              strokeLinecap="round"
              {...loop(
                { opacity: [1, 0.35, 1] },
                { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
              )}
            >
              <line x1="414" y1="88" x2="410" y2="76" />
              <line x1="432" y1="82" x2="432" y2="68" />
              <line x1="450" y1="88" x2="454" y2="76" />
            </motion.g>
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}
