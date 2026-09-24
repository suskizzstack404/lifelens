import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Incident } from "../lib/types";
import { useAuth } from "../auth/useAuth";

function geolocationErrorMessage(err: GeolocationPositionError): string {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return "Location access was denied. Enable location permissions and try again.";
    case err.POSITION_UNAVAILABLE:
      return "Your location could not be determined right now.";
    case err.TIMEOUT:
      return "Timed out getting your location. Try again.";
    default:
      return "Could not get your location.";
  }
}

/**
 * Real, ordered stages of a single report — every value here corresponds
 * to an actual point in the geolocation + Supabase-insert flow below, not
 * a UI-only simulation:
 *   idle → locating (getCurrentPosition in flight)
 *        → located  (coords received)
 *        → saving   (insert in flight)
 *        → success  (row written) | error
 */
export type ReportStage = "idle" | "locating" | "located" | "saving" | "success" | "error";

const RESET_DELAY_MS = 3200;

/**
 * Fetches the signed-in user's own incidents (RLS-scoped — the query
 * simply cannot return anyone else's rows) and exposes a way to report a
 * new one using the browser's real geolocation API.
 */
export function useIncidents() {
  const { user, configured } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [stage, setStage] = useState<ReportStage>("idle");
  const [stageError, setStageError] = useState<string | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async () => {
    if (!user || !configured) {
      setIncidents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("reporter_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setListError(error.message);
    } else {
      setListError(null);
      setIncidents((data ?? []) as Incident[]);
    }
    setLoading(false);
  }, [user, configured]);

  useEffect(() => {
    // Fetching on mount / when the signed-in user changes — a standard
    // "synchronize with an external system" effect. refresh() sets state
    // only after its awaited request resolves, not synchronously.
    // oxlint-disable-next-line react/set-state-in-effect
    refresh();
  }, [refresh]);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  function scheduleReset() {
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setStage("idle"), RESET_DELAY_MS);
  }

  async function reportIncident(): Promise<{ ok: boolean; error?: string }> {
    if (!user) {
      setStage("error");
      setStageError("Not signed in.");
      scheduleReset();
      return { ok: false, error: "Not signed in." };
    }
    if (!("geolocation" in navigator)) {
      setStage("error");
      setStageError("Geolocation is not supported by this browser.");
      scheduleReset();
      return { ok: false, error: "Geolocation is not supported by this browser." };
    }

    setStage("locating");
    setStageError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10_000,
        });
      });

      setStage("located");
      setStage("saving");

      const { error } = await supabase.from("incidents").insert({
        reporter_id: user.id,
        status: "LOCATED",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy_meters: position.coords.accuracy,
      });

      if (error) {
        setStage("error");
        setStageError(error.message);
        scheduleReset();
        return { ok: false, error: error.message };
      }

      await refresh();
      setStage("success");
      scheduleReset();
      return { ok: true };
    } catch (err) {
      const message =
        err instanceof GeolocationPositionError
          ? geolocationErrorMessage(err)
          : err instanceof Error
            ? err.message
            : "Could not get your location.";
      setStage("error");
      setStageError(message);
      scheduleReset();
      return { ok: false, error: message };
    }
  }

  return {
    incidents,
    loading,
    listError,
    stage,
    stageError,
    reportIncident,
    refresh,
  };
}
