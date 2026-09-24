export const SYSTEM_DATE = "2026.09.04";

export const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Technology", href: "#technology" },
  { label: "Safety", href: "#safety" },
];

export type WorkflowStep = {
  index: string;
  id: string;
  phaseLabel: string;
  headline: string;
  description: string;
  note?: string;
};

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    index: "01",
    id: "accident",
    phaseLabel: "ACCIDENT / 00:01",
    headline: "An accident can happen in seconds.",
    description:
      "In the first moments, a clear picture can be hard to form. LifeLens helps turn uncertainty into a signal others can act on.",
  },
  {
    index: "02",
    id: "capture",
    phaseLabel: "CAPTURE / 00:04",
    headline: "Capture the situation.",
    description:
      "Frame what matters with a guided capture flow. No graphic imagery — just a structured starting point for communication.",
  },
  {
    index: "03",
    id: "analyze",
    phaseLabel: "ANALYZE / 00:08",
    headline: "AI sees what matters.",
    description:
      "Computer vision organizes visible indicators into preliminary observations, helping an emergency report become easier to understand.",
    note: "PRELIMINARY AI-ASSISTED OBSERVATIONS. NOT MEDICAL DIAGNOSIS.",
  },
  {
    index: "04",
    id: "locate",
    phaseLabel: "LOCATE / 00:11",
    headline: "Every report needs a place.",
    description:
      "Precise coordinates are locked the moment a report is filed, anchoring the incident so responders know exactly where to go.",
  },
  {
    index: "05",
    id: "connect",
    phaseLabel: "CONNECT / 00:15",
    headline: "Nearby providers enter range.",
    description:
      "Registered hospitals and emergency providers within range are identified and ranked, ready to receive the incoming report.",
  },
  {
    index: "06",
    id: "respond",
    phaseLabel: "RESPOND / 00:22",
    headline: "A hospital takes the call.",
    description:
      "The report and live location reach a responding hospital in real time, starting the countdown to physical arrival.",
  },
  {
    index: "07",
    id: "track",
    phaseLabel: "TRACK / 04:37",
    headline: "Every movement, visible.",
    description:
      "The incident stays live on both ends — reporter and responder see the same position, the same status, the same timeline.",
  },
  {
    index: "08",
    id: "resolve",
    phaseLabel: "RESOLVE / 11:52",
    headline: "Signal received. Case closed.",
    description:
      "Once care is confirmed, the incident is marked resolved and archived to the emergency timeline for full traceability.",
  },
];
