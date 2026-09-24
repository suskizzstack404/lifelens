import { useRef } from "react";
import { useInView } from "framer-motion";

export function useRevealed(amount: number = 0.4) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount });
  return { ref, inView };
}
