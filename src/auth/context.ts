import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";

export type ProfileRole = "USER" | "BYSTANDER" | "HOSPITAL_STAFF" | "ADMIN";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string;
  role: ProfileRole;
  created_at: string;
  updated_at: string;
};

export type AuthContextValue = {
  /** True once Supabase env vars are present — see src/lib/supabase.ts. */
  configured: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  /** True while the initial session is being resolved on load/refresh. */
  loading: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
