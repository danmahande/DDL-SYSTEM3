"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Search,
  Layers,
  MapPin,
  Package,
  Truck,
  TrendingUp,
  Eye,
  EyeOff,
  Target,
  Image as ImageIcon,
  Map as MapIcon,
} from "lucide-react";
import {
  KAMPALA_CENTER,
  KAMPALA_ZOOM,
  KAMPALA_PITCH,
  KAMPALA_BEARING,
  STYLE_OPTIONS,
} from "@/lib/map-config";

const layers = [
  { id: "heatmap", label: "Heatmap", icon: TrendingUp, color: "text-red-400" },
  { id: "clusters", label: "Clusters", icon: MapPin, color: "text-orange-400" },
  { id: "geofences", label: "Geofences", icon: MapPin, color: "text-blue-400" },
  { id: "signals", label: "Signals", icon: Package, color: "text-purple-400" },
  { id: "buying", label: "Buying Power", icon: TrendingUp, color: "text-green-400" },
  { id: "drivers", label: "Drivers", icon: Truck, color: "text-amber-400" },
];

interface SearchResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function DemandMapModule() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    heatmap: true,
    clusters: true,
    geofences: true,
    signals: true,
    buying: false,
    drivers: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [currentStyle, setCurrentStyle] = useState("osm"); // osm or imagery

  // Nominatim search
  const handleSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=10&viewbox=${KAMPALA_CENTER[0] - 0.5},${KAMPALA_CENTER[1] + 0.5},${KAMPALA_CENTER[0] + 0.5},${KAMPALA_CENTER[1] - 0.5}&bounded=1`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await response.json();
      setSearchResults(data);
      setShowSearchResults(true);
    } catch (error) {
      console.log("Search error:", error);
    }
  };

  const handleSelectLocation = (result: SearchResult) => {
    if (map.current) {
      map.current.flyTo({
        center: [parseFloat(result.lon), parseFloat(result.lat)],
        zoom: 17,
        pitch: 60,
        essential: true,
      });

      new maplibregl.Marker({ color: "#FF6B35" })
        .setLngLat([parseFloat(result.lon), parseFloat(result.lat)])
        .addTo(map.current);
    }

    setSearchQuery(result.display_name);
    setShowSearchResults(false);
    setSearchResults([]);
  };

  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (map.current) {
            const { latitude, longitude } = position.coords;
            map.current.flyTo({
              center: [longitude, latitude],
              zoom: 17,
              pitch: 60,
              essential: true,
            });

            new maplibregl.Marker({ color: "#1d4ed8" })
              .setLngLat([longitude, latitude])
              .addTo(map.current);
          }
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    }
  };

  const switchStyle = (style: "osm" | "imagery") => {
    setCurrentStyle(style);
    if (map.current) {
      if (style === "osm") {
        map.current.setStyle(STYLE_OPTIONS.OSM_DARK);
      } else {
        map.current.setStyle({
          version: 8,
          sources: {
            "esri-world-imagery": {
              type: "raster",
              tiles: [
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
              ],
              tileSize: 256,
              attribution: "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AeroGRID, GeoEye, Earthstar Geographics, CNES/Airbus DS, GeoEye, USDA FSA, USGS, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community",
            },
          },
          layers: [
            {
              id: "esri-world-imagery",
              type: "raster",
              source: "esri-world-imagery",
              minzoom: 0,
              maxzoom: 22,
            },
          ],
        });
      }
    }
  };

  const enhanceRoads = () => {
    if (!map.current) return;

    const style = map.current.getStyle();
    if (!style || !style.layers) return;

    // Realistic, dark road color palette (matching your London reference)
    const roadColors = {
      highway: "#4a4a48",
      primary: "#3a3a38",
      secondary: "#30302e",
      tertiary: "#2a2a28",
      residential: "#222220",
      service: "#1a1a18",
    };

    // Find all road-related layers and enhance them
    style.layers.forEach((layer) => {
      const layerId = layer.id.toLowerCase();

      if (layer.type === "line" && (layerId.includes("road") || layerId.includes("highway") || layerId.includes("street"))) {
        try {
          // Enhance road width based on zoom and type
          let baseWidth = 2;
          if (layerId.includes("highway") && layerId.includes("motorway")) baseWidth = 6;
          else if (layerId.includes("highway") || layerId.includes("primary")) baseWidth = 5;
          else if (layerId.includes("secondary")) baseWidth = 4;
          else if (layerId.includes("tertiary")) baseWidth = 3;
          else if (layerId.includes("residential")) baseWidth = 2;

          map.current!.setPaintProperty(layer.id, "line-width", [
            "interpolate",
            ["linear"],
            ["zoom"],
            12, baseWidth,
            16, baseWidth * 2,
            19, baseWidth * 4,
          ]);

          // Set color based on road type
          let lineColor = roadColors.residential;
          if (layerId.includes("motorway")) lineColor = roadColors.highway;
          else if (layerId.includes("highway") || layerId.includes("primary")) lineColor = roadColors.primary;
          else if (layerId.includes("secondary")) lineColor = roadColors.secondary;
          else if (layerId.includes("tertiary")) lineColor = roadColors.tertiary;
          else if (layerId.includes("service")) lineColor = roadColors.service;

          map.current!.setPaintProperty(layer.id, "line-color", lineColor);

          // Add slight opacity
          map.current!.setPaintProperty(layer.id, "line-opacity", 0.95);

          // Make lines smoother
          map.current!.setPaintProperty(layer.id, "line-join", "round");
          map.current!.setPaintProperty(layer.id, "line-cap", "round");

        } catch (e) {
          console.log("Could not enhance road layer:", layer.id, e);
        }
      }
    });
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: STYLE_OPTIONS.OSM_DARK,
      center: KAMPALA_CENTER,
      zoom: KAMPALA_ZOOM,
      pitch: KAMPALA_PITCH,
      bearing: KAMPALA_BEARING,
      antialias: true,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "top-right");
    map.current.addControl(new maplibregl.ScaleControl(), "bottom-left");
    map.current.addControl(new maplibregl.AttributionControl(), "bottom-right");

    const geolocateControl = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    });
    map.current.addControl(geolocateControl, "top-right");

    // Add layers and enhancements after map loads
    map.current.on("load", () => {
      if (!map.current) return;

      // First enhance roads
      enhanceRoads();

      // Enhance 3D buildings
      const style = map.current.getStyle();
      
      let buildingLayerFound = false;
      style.layers.forEach((layer) => {
        if (layer.type === "fill-extrusion" && layer.id.includes("building")) {
          try {
            map.current!.setPaintProperty(layer.id, "fill-extrusion-height", [
              "interpolate",
              ["linear"],
              ["zoom"],
              14, 0,
              15, ["coalesce", ["get", "render_height"], ["get", "height"], ["*", ["get", "building:levels"], 3.2], 8],
            ]);
            map.current!.setPaintProperty(layer.id, "fill-extrusion-color", [
              "interpolate",
              ["linear"],
              ["coalesce", ["get", "render_height"], ["get", "height"], 8],
              8, "#1e1d1c",
              15, "#282623",
              25, "#33302c",
              40, "#3d3834",
            ]);
            map.current!.setPaintProperty(layer.id, "fill-extrusion-opacity", 0.95);
            map.current!.setPaintProperty(layer.id, "fill-extrusion-vertical-gradient", true);
            buildingLayerFound = true;
          } catch (e) {
            console.log("Could not enhance building layer:", layer.id, e);
          }
        }
      });

      if (!buildingLayerFound) {
        const vectorSource = Object.keys(style.sources || {}).find(
          (id) => style.sources?.[id].type === "vector"
        );

        if (vectorSource) {
          try {
            map.current.addLayer({
              id: "ddl-buildings-3d",
              type: "fill-extrusion",
              source: vectorSource,
              "source-layer": "building",
              minzoom: 14,
              paint: {
                "fill-extrusion-color": [
                  "interpolate",
                  ["linear"],
                  ["coalesce", ["get", "render_height"], ["get", "height"], 8],
                  8, "#1e1d1c",
                  15, "#282623",
                  25, "#33302c",
                  40, "#3d3834",
                ],
                "fill-extrusion-height": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  14, 0,
                  15, ["coalesce", ["get", "render_height"], ["get", "height"], ["*", ["get", "building:levels"], 3.2], 8],
                ],
                "fill-extrusion-base": [
                  "interpolate",
                  ["linear"],
                  ["zoom"],
                  14, 0,
                  15, ["get", "min_height"],
                ],
                "fill-extrusion-opacity": 0.95,
                "fill-extrusion-vertical-gradient": true,
              },
            });
          } catch (e) {
            console.log("Could not add 3D buildings:", e);
          }
        }
      }

      if ("setFog" in map.current) {
        (map.current as any).setFog({
          range: [0.5, 10],
          color: "#1a1a1a",
          "horizon-blend": 0.1,
        });
      }
    });

    map.current.on("styleimagemissing", (e) => {
      map.current?.addImage(e.id, new ImageData(1, 1));
    });

    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const toggleLayer = (id: string) => {
    setActiveLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="h-[calc(100vh-64px)] relative">
      <div ref={mapContainer} className="w-full h-full" />

      <div className="absolute top-4 left-4 z-10 w-[480px]">
        <div className="bg-[#1B2A4A]/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden border border-white/10">
          <div className="flex items-center gap-3 px-5 py-4">
            <Search className="w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search all buildings, streets, and locations in Kampala..."
              className="flex-1 px-3 py-1 text-base outline-none bg-transparent text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
            />
            <button
              onClick={handleGeolocate}
              className="p-2 hover:bg-white/10 rounded-xl"
              title="Use my location"
            >
              <Target className="w-6 h-6 text-gray-300" />
            </button>
          </div>

          {showSearchResults && searchResults.length > 0 && (
            <div className="border-t border-white/10 max-h-[400px] overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectLocation(result)}
                  className="w-full px-5 py-3.5 text-left hover:bg-white/10 flex items-center gap-3 border-b border-white/5 last:border-0"
                >
                  <MapPin className="w-4.5 h-4.5 text-[#FF6B35] flex-shrink-0" />
                  <span className="text-sm text-gray-200 truncate flex-1">
                    {result.display_name}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-[#1B2A4A]/95 backdrop-blur rounded-2xl shadow-xl border border-white/10 overflow-hidden flex">
          <button
            onClick={() => switchStyle("osm")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              currentStyle === "osm"
                ? "bg-[#FF6B35] text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <MapIcon className="w-4 h-4" />
            OSM Dark
          </button>
          <button
            onClick={() => switchStyle("imagery")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              currentStyle === "imagery"
                ? "bg-[#FF6B35] text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            ESRI Imagery
          </button>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={() => setShowControls(!showControls)}
          className="bg-[#1B2A4A]/95 backdrop-blur rounded-xl shadow-xl p-3 mb-3 border border-white/10"
        >
          {showControls ? (
            <EyeOff className="w-6 h-6 text-gray-200" />
          ) : (
            <Eye className="w-6 h-6 text-gray-200" />
          )}
        </button>

        {showControls && (
          <div className="bg-[#1B2A4A]/95 backdrop-blur rounded-2xl shadow-xl p-5 w-72 border border-white/10">
            <h3 className="font-bold text-gray-100 mb-4 flex items-center gap-2 text-lg">
              <Layers className="w-5 h-5" /> Map Layers
            </h3>
            <div className="space-y-2.5">
              {layers.map((layer) => {
                const Icon = layer.icon;
                return (
                  <label
                    key={layer.id}
                    className="flex items-center gap-3 cursor-pointer group py-1"
                  >
                    <input
                      type="checkbox"
                      checked={activeLayers[layer.id]}
                      onChange={() => toggleLayer(layer.id)}
                      className="w-4.5 h-4.5 rounded border-white/30 text-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                    <Icon className={`w-5 h-5 ${layer.color}`} />
                    <span className="text-sm text-gray-300 group-hover:text-white">
                      {layer.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-88">
        <div className="bg-[#1B2A4A]/95 backdrop-blur rounded-2xl shadow-xl p-5 border border-white/10">
          <h3 className="font-bold text-gray-100 mb-4 text-lg">Active Route</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Route ID</span>
              <span className="font-mono text-gray-200">RTE-20260602-001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Driver</span>
              <span className="text-gray-200">John Doe</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Stops</span>
              <span className="font-medium text-gray-200">4 / 12</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5 mt-2">
              <div
                className="bg-[#FF6B35] h-2.5 rounded-full"
                style={{ width: "33%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
