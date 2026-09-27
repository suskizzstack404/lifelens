/**
 * Turns real GPS coordinates into a short, human-readable address using
 * OpenStreetMap's public Nominatim reverse-geocoding endpoint (free, no
 * API key). This never fabricates a location: if the network request
 * fails, times out, or Nominatim has nothing for these coordinates, it
 * resolves to `null` and the caller falls back to showing the raw
 * coordinates instead.
 */

export type GeocodedAddress = {
  /** The most specific line: a landmark, building, or road name. */
  primary: string;
  /** Area / city / state, joined — may be absent if Nominatim has nothing more specific. */
  secondary: string | null;
};

type NominatimAddress = {
  amenity?: string;
  building?: string;
  shop?: string;
  office?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state?: string;
};

type NominatimResponse = {
  display_name?: string;
  address?: NominatimAddress;
};

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse";
const TIMEOUT_MS = 6000;

function formatAddress(data: NominatimResponse): GeocodedAddress | null {
  const a = data.address;
  if (!a) {
    return data.display_name ? { primary: data.display_name, secondary: null } : null;
  }

  const primary = a.amenity || a.building || a.shop || a.office || a.road || a.neighbourhood;

  const secondaryParts = [
    a.suburb && a.suburb !== primary ? a.suburb : null,
    a.city || a.town || a.village || a.county,
    a.state,
  ].filter((part): part is string => Boolean(part));
  const secondary = secondaryParts.length > 0 ? secondaryParts.join(", ") : null;

  if (primary) return { primary, secondary };
  if (secondary) return { primary: secondary, secondary: null };
  return data.display_name ? { primary: data.display_name, secondary: null } : null;
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<GeocodedAddress | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const url = `${NOMINATIM_URL}?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=17&addressdetails=1`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as NominatimResponse;
    return formatAddress(data);
  } catch {
    // Network failure, timeout, or malformed response — the caller shows
    // a graceful "coordinates only" fallback rather than guessing.
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
