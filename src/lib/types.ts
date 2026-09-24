export type IncidentStatus =
  | "REPORTED"
  | "LOCATED"
  | "ANALYZING"
  | "MATCHED"
  | "RESPONDING"
  | "RESOLVED"
  | "CANCELLED";

export type Incident = {
  id: string;
  reporter_id: string;
  status: IncidentStatus;
  latitude: number | null;
  longitude: number | null;
  accuracy_meters: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
