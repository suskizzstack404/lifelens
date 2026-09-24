import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { SYSTEM_DATE } from "../lib/constants";
import { useAuth } from "../auth/useAuth";

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer id="safety" className="border-t border-line">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-10 items-end">
          <div>
            <p className="mono-label text-[11px] text-cyan mb-5">Safety Note</p>
            <h2 className="font-display uppercase text-[32px] sm:text-[40px] leading-[0.95] max-w-lg text-balance">
              Preliminary assistance. Never a replacement for emergency services.
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink-dim">
              LifeLens accelerates the flow of information between the scene of
              an accident and the people who can help. It does not diagnose,
              treat, or dispatch on its own — always contact local emergency
              services directly for life-threatening situations.
            </p>
          </div>

          <div id="get-started" className="md:justify-self-end">
            <Link
              to={user ? "/dashboard" : "/login"}
              className="group inline-flex items-center gap-2 border border-line-strong px-6 py-3.5 mono-label text-[11px] text-ink hover:border-red hover:text-red transition-colors duration-200"
            >
              Get Started
              <ArrowUpRight
                size={14}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-line flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-mono text-[15px] tracking-[0.12em] text-ink">
            LIFELENS <span className="text-red">AI</span>
          </span>
          <span className="mono-label text-[10px] text-ink-faint">
            System Build {SYSTEM_DATE} — Simulation Environment
          </span>
        </div>
      </div>
    </footer>
  );
}
