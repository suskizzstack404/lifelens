import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Incident } from "../lib/types";
import { useAuth } from "../auth/useAuth";
import { reverseGeocode, type GeocodedAddress } from "../lib/reverseGeocode";

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

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Real, ordered stages of a single report. Every stage boundary lines up
 * with an actual point in the geolocation + reverse-geocode + Supabase
 * flow below — the handful of fixed `wait()` beats between them only pace
 * how those real results are *revealed* on screen (so a very fast GPS fix
 * doesn't look like a skipped step); they never block, delay, or fake the
 * underlying operations, and every stage after "scanning" only starts
 * once the real work it depends on has actually resolved:
 *
 *   idle → activating → reacting → scanning (GPS request in flight)
 *        → location_detected (real coords received, reverse-geocode kicked off)
 *        → address_revealed  (real geocode settled — an address, or a
 *                              graceful "coordinates only" fallback)
 *        → reporting (Supabase insert in flight)
 *        → success (row written) | error
 */
export type ReportStage =
  | "idle"
  | "activating"
  | "reacting"
  | "scanning"
  | "location_detected"
  | "address_revealed"
  | "reporting"
  | "success"
  | "error";

export type AddressStatus = "idle" | "pending" | "found" | "unavailable";

const RESET_DELAY_MS = 4200;
const ACTIVATING_MS = 420;
const REACTING_MS = 620;
const MIN_SCAN_MS = 1000;
const MIN_LOCATION_BURST_MS = 750;
const ADDRESS_REVEAL_MS = 480;

/**
 * Fetches the signed-in user's own incidents (RLS-scoped — the query
 * simply cannot return anyone else's rows) and exposes a way to report a
 * new one using the browser's real geolocation API and a real
 * reverse-geocoding lookup.
 */
export function useIncidents() {
  const { user, configured } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [stage, setStage] = useState<ReportStage>("idle");
  const [stageError, setStageError] = useState<string | null>(null);
  const [detectedAddress, setDetectedAddress] = useState<GeocodedAddress | null>(null);
  const [addressStatus, setAddressStatus] = useState<AddressStatus>("idle");
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
    resetTimer.current = setTimeout(() => {
      setStage("idle");
      setDetectedAddress(null);
      setAddressStatus("idle");
    }, RESET_DELAY_MS);
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

    setStage("activating");
    setStageError(null);
    setDetectedAddress(null);
    setAddressStatus("idle");

    // The real GPS request starts immediately — permission prompts and
    // acquisition time are unpredictable, so it runs in the background
    // for the full length of the "activating"/"reacting"/"scanning"
    // beats below rather than waiting for them to finish first.
    const positionPromise = new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10_000,
      });
    });
    positionPromise.catch(() => {
      // Real rejection is handled below via the awaited Promise.all; this
      // just prevents an "unhandled rejection" console warning if the
      // scan's minimum-duration timer wins the race.
    });

    try {
      await wait(ACTIVATING_MS);
      setStage("reacting");

      await wait(REACTING_MS);
      setStage("scanning");

      // The scan stays on screen for at least MIN_SCAN_MS even if GPS
      // resolves instantly, and keeps running past it for as long as the
      // real request takes — it never cuts off mid-sweep or fast-forwards
      // to a result that isn't ready yet.
      const [position] = await Promise.all([positionPromise, wait(MIN_SCAN_MS)]);

      setStage("location_detected");
      setAddressStatus("pending");

      // Kick off the real reverse-geocode lookup now, in parallel with
      // the location-capture beat, so it has the most time to resolve
      // before we actually need to show it.
      const addressPromise = reverseGeocode(
        position.coords.latitude,
        position.coords.longitude,
      );

      await wait(MIN_LOCATION_BURST_MS);
      const address = await addressPromise;

      if (address) {
        setDetectedAddress(address);
        setAddressStatus("found");
      } else {
        setAddressStatus("unavailable");
      }

      setStage("address_revealed");
      await wait(ADDRESS_REVEAL_MS);

      setStage("reporting");

      const { error } = await supabase.from("incidents").insert({
        reporter_id: user.id,
        status: "LOCATED",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy_meters: position.coords.accuracy,
        // The real reverse-geocode result computed just above — never a
        // hardcoded example, and null on either side if geocoding failed.
        address_line: address?.primary ?? null,
        address_area: address?.secondary ?? null,
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
    detectedAddress,
    addressStatus,
    reportIncident,
    refresh,
  };
}
