export interface Coord {
  lat: number;
  lon: number;
}

const EARTH_RADIUS_KM = 6371;

/** Great-circle distance in km between two coordinates (Haversine formula). */
export function haversine(a: Coord, b: Coord): number {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.asin(Math.sqrt(h));
}

/** Legacy positional signature kept for existing call sites. */
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  return haversine({ lat: lat1, lon: lon1 }, { lat: lat2, lon: lon2 });
}
