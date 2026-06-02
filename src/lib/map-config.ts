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

// Style options
export const STYLE_OPTIONS = {
  OSM_DARK: "https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json",
  ESRI_IMAGERY: "https://tiles.stadiamaps.com/styles/osm_bright.json", // We'll use a hybrid approach for ESRI
};

// Stadia Maps Alidade Smooth Dark - free, beautiful, Mapbox-like dark vector style!
export const MAP_STYLE = STYLE_OPTIONS.OSM_DARK;
