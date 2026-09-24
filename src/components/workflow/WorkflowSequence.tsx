import type { ReactElement } from "react";
import { WORKFLOW_STEPS } from "../../lib/constants";
import WorkflowSection from "./WorkflowSection";
import AccidentSimulation from "./AccidentSimulation";
import CaptureSimulation from "./CaptureSimulation";
import AIAnalysisSimulation from "./AIAnalysisSimulation";
import LocationSimulation from "./LocationSimulation";
import HospitalSignalSimulation from "./HospitalSignalSimulation";
import ResponseSimulation from "./ResponseSimulation";
import TrackSimulation from "./TrackSimulation";
import ResolveSimulation from "./ResolveSimulation";

const visualizationById: Record<string, () => ReactElement> = {
  accident: () => <AccidentSimulation />,
  capture: () => <CaptureSimulation />,
  analyze: () => <AIAnalysisSimulation />,
  locate: () => <LocationSimulation />,
  connect: () => <HospitalSignalSimulation />,
  respond: () => <ResponseSimulation />,
  track: () => <TrackSimulation />,
  resolve: () => <ResolveSimulation />,
};

export default function WorkflowSequence() {
  return (
    <div id="how-it-works">
      {WORKFLOW_STEPS.map((step) => (
        <WorkflowSection key={step.id} step={step} visualization={visualizationById[step.id]()} />
      ))}
    </div>
  );
}
