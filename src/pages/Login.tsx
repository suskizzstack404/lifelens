import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthField from "../components/AuthField";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

type LocationState = { from?: { pathname: string } } | null;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Enter both email and password.");
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setSubmitting(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    navigate(state?.from?.pathname ?? "/dashboard", { replace: true });
  }

  return (
    <AuthLayout
      subtitle="Emergency Response Access"
      title="Sign In"
      footer={
        <span className="font-mono text-[13px] text-ink-dim">
          No account?{" "}
          <Link to="/signup" className="text-cyan hover:text-ink transition-colors">
            Create one
          </Link>
        </span>
      }
    >
      {!isSupabaseConfigured && (
        <div className="mb-5 border border-red/40 px-3.5 py-2.5">
          <p className="mono-label text-[10px] text-red leading-relaxed">
            Supabase Not Configured — set VITE_SUPABASE_URL and
            VITE_SUPABASE_PUBLISHABLE_KEY in .env.local
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <AuthField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
        <AuthField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        {error && (
          <p className="mono-label text-[10px] text-red leading-relaxed">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || !isSupabaseConfigured}
          className="mt-2 border border-line-strong px-6 py-3 mono-label text-[11px] text-ink hover:border-red hover:text-red transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Verifying..." : "Sign In"}
        </button>
      </form>
    </AuthLayout>
  );
}
