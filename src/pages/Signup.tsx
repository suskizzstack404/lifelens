import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import AuthField from "../components/AuthField";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  function validate(): string | null {
    if (!fullName.trim()) return "Full name is required.";
    if (!EMAIL_RE.test(email)) return "Enter a valid email address.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Read by the handle_new_user() trigger (see the migration) so the
        // profile row created on signup already has a full name.
        data: { full_name: fullName.trim() },
      },
    });
    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // If email confirmation is required (the Supabase project default),
    // signUp succeeds but returns no session yet — the user must confirm
    // via email before they can sign in.
    if (data.user && !data.session) {
      setConfirmationSent(true);
      return;
    }

    navigate("/dashboard", { replace: true });
  }

  if (confirmationSent) {
    return (
      <AuthLayout
        subtitle="Emergency Response Access"
        title="Check Your Email"
        footer={
          <Link to="/login" className="font-mono text-[13px] text-cyan hover:text-ink transition-colors">
            Back to sign in
          </Link>
        }
      >
        <p className="text-[14px] leading-relaxed text-ink-dim">
          We sent a confirmation link to <span className="text-ink">{email}</span>.
          Confirm your address, then sign in to continue.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      subtitle="Emergency Response Access"
      title="Create Account"
      footer={
        <span className="font-mono text-[13px] text-ink-dim">
          Already registered?{" "}
          <Link to="/login" className="text-cyan hover:text-ink transition-colors">
            Sign in
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
          label="Full Name"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Jane Doe"
          required
        />
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
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
        />
        <AuthField
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
          {submitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </AuthLayout>
  );
}
