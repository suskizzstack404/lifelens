import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useIncidents } from "../incidents/useIncidents";
import DashboardNav from "../components/dashboard/DashboardNav";
import DashboardHero from "../components/dashboard/DashboardHero";
import IncidentTimeline from "../components/dashboard/IncidentTimeline";

export default function Dashboard() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { incidents, loading, listError, stage, stageError, reportIncident } =
    useIncidents();

  async function handleLogout() {
    await signOut();
    navigate("/", { replace: true });
  }

  const firstName = profile?.full_name?.trim().split(/\s+/)[0] || "there";
  const confirmed = Boolean(user?.email_confirmed_at);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <DashboardNav onLogout={handleLogout} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto max-w-[1100px] px-6 md:px-10 pb-24"
      >
        <DashboardHero
          firstName={firstName}
          role={profile?.role ?? "USER"}
          confirmed={confirmed}
          stage={stage}
          stageError={stageError}
          onReport={reportIncident}
        />

        <IncidentTimeline incidents={incidents} loading={loading} listError={listError} />
      </motion.main>
    </div>
  );
}
