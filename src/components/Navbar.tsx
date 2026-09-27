import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { NAV_LINKS } from "../lib/constants";
import { useAuth } from "../auth/useAuth";

function HeartbeatLogo() {
  return (
    <div className="relative h-9 w-9 shrink-0 rounded-full border border-red/50 flex items-center justify-center">
      <svg
        viewBox="0 0 32 32"
        className="h-4 w-4 text-red"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 17h5l2.5-7 4 14 3-11 2 4h11.5" />
      </svg>
      <span className="absolute inset-0 rounded-full border border-red/30 animate-pulse-soft" />
    </div>
  );
}

export default function Navbar() {
  const { user } = useAuth();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 inset-x-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 h-[72px] flex items-center justify-between">
        <a href="#top" className="flex items-center gap-3 group">
          <HeartbeatLogo />
          <span className="font-mono text-[15px] tracking-[0.12em] text-ink">
            LIFELENS <span className="text-red">AI</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="mono-label text-[11px] text-ink-dim hover:text-ink transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <Link
          to={user ? "/dashboard" : "/login"}
          className="group flex items-center gap-1.5 mono-label text-[11px] text-ink hover:text-cyan transition-colors duration-200"
        >
          Get Started
          <ArrowUpRight
            size={14}
            className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </motion.header>
  );
}
