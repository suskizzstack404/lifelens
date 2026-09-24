# LifeLens AI — Landing Experience

Smart Accident Response & Emergency Assistance System — command-center style
landing page rebuilt with React, Vite, TypeScript, Tailwind CSS v4, and
Framer Motion.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build (outputs to dist/)
```

## Structure

```
src/
  components/
    Navbar.tsx              top nav with heartbeat logo
    SystemStatus.tsx        pulsing "SYSTEM ONLINE" indicator
    EmergencyTimeline.tsx   full-sequence recap strip
    Footer.tsx
    hero/
      HeroSection.tsx
      IncidentRadar.tsx     animated radar/viewport visualization
    workflow/
      WorkflowSection.tsx   shared numbered-section layout + scroll reveal
      SimulationPanel.tsx   shared "LIFELENS / 0N SIMULATION" panel chrome
      WorkflowSequence.tsx  assembles steps 01–08 in order
      AccidentSimulation.tsx
      CaptureSimulation.tsx
      AIAnalysisSimulation.tsx
      LocationSimulation.tsx
      HospitalSignalSimulation.tsx
      ResponseSimulation.tsx
      TrackSimulation.tsx
      ResolveSimulation.tsx
  lib/
    constants.ts   copy + step data for the 8-step workflow
    useRevealed.ts helper hook (available for future manual scroll-reveal needs)
```

## Design tokens

Defined in `src/index.css` under the Tailwind v4 `@theme` block:
- `--color-bg`, `--color-bg-panel` — near-black charcoal surfaces
- `--color-ink`, `--color-ink-dim`, `--color-ink-faint` — off-white text scale
- `--color-red` — emergency accent
- `--color-cyan` — system/data accent
- `--font-display` (Anton), `--font-mono` (JetBrains Mono), `--font-body` (IBM Plex Sans)

## Extending toward the full application

Each simulation component is self-contained and only receives scroll-trigger
timing from its parent `WorkflowSection` — swap in real data (GPS coords,
hospital lists, live tracking positions, Gemini Vision output) without
touching layout or motion code. `Navbar`'s "Get Started" and the footer CTA
are anchored to `#get-started` and are the intended entry points for wiring
up Supabase auth once the backend is connected.

Motion respects `prefers-reduced-motion` globally via `src/index.css`.
