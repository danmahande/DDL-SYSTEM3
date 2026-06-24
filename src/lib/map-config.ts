export const KAMPALA_CENTER: [number, number] = [32.5825, 0.3476];
export const KAMPALA_ZOOM = 15.5;
export const KAMPALA_MIN_ZOOM = 9;
export const KAMPALA_MAX_ZOOM = 20;
export const KAMPALA_PITCH = 60;
export const KAMPALA_BEARING = -25;
export const KAMPALA_BOUNDS: [[number, number], [number, number]] = [
  [32.2, 0.0],
  [33.0, 0.7],
];

// Mapbox Configuration - GET YOUR TOKEN AT https://account.mapbox.com/
// Add your token to .env.local file as NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
export const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

if (!MAPBOX_ACCESS_TOKEN) {
  console.warn('Mapbox access token is not set. The map may not load properly.');
}

// Mapbox Style URLs - Using the newer Standard style which shows more geographic features
export const STYLE_OPTIONS = {
  DARK: "mapbox://styles/mapbox/dark-v11",
  STREETS: "mapbox://styles/mapbox/streets-v12",
  STANDARD: "mapbox://styles/mapbox/standard",
  SATELLITE_STREETS: "mapbox://styles/mapbox/satellite-streets-v12",
};