import Navbar from "../components/Navbar";
import HeroSection from "../components/hero/HeroSection";
import WorkflowSequence from "../components/workflow/WorkflowSequence";
import EmergencyTimeline from "../components/EmergencyTimeline";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-ink noise">
      <Navbar />
      <main>
        <HeroSection />
        <WorkflowSequence />
        <EmergencyTimeline />
      </main>
      <Footer />
    </div>
  );
}
