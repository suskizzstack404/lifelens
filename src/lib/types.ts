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
  /** Real reverse-geocoded label (landmark/road), e.g. "Vartak College". Null if geocoding failed/unavailable. */
  address_line: string | null;
  /** Real reverse-geocoded area/city/state, e.g. "Vasai West, Maharashtra". Null if unavailable. */
  address_area: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
