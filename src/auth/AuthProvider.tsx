import { useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { AuthContext, type Profile } from "./context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  // Without real credentials there is nothing to resolve on load, so start
  // "not loading" instead of flipping it off a moment later from an effect.
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Supabase's client persists the session in localStorage and restores
    // it here, which is what makes the session survive a page refresh.
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Single subscription for the lifetime of the app — this is the one
    // real-time listener for auth state, per the "don't create multiple
    // independent listeners" requirement.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId || !isSupabaseConfigured) {
      // Resetting derived state when its source (the session) changes —
      // e.g. clearing the previous user's profile on logout.
      // oxlint-disable-next-line react/set-state-in-effect
      setProfile(null);
      return;
    }

    let cancelled = false;
    supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          // Expected transiently right after signup, before the
          // handle_new_user() trigger's row has replicated to this read.
          console.warn("[LifeLens] Could not load profile:", error.message);
          setProfile(null);
          return;
        }
        setProfile(data as Profile);
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  async function signOut() {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        configured: isSupabaseConfigured,
        session,
        user: session?.user ?? null,
        profile,
        loading,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
