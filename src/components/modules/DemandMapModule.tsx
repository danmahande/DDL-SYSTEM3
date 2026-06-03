"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
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
  MAPBOX_ACCESS_TOKEN,
  STYLE_OPTIONS,
} from "@/lib/map-config";

// Set Mapbox access token
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

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
  const map = useRef<mapboxgl.Map | null>(null);
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
  const [currentStyle, setCurrentStyle] = useState<"DARK" | "STREETS" | "SATELLITE_STREETS">("STREETS");

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
        pitch: KAMPALA_PITCH,
        essential: true,
      });

      new mapboxgl.Marker({ color: "#FF6B35" })
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
              pitch: KAMPALA_PITCH,
              essential: true,
            });

            new mapboxgl.Marker({ color: "#1d4ed8" })
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

  const switchStyle = (style: "DARK" | "STREETS" | "SATELLITE_STREETS") => {
    setCurrentStyle(style);
    if (map.current) {
      map.current.setStyle(STYLE_OPTIONS[style]);
    }
  };

  // Helper function to configure style, terrain, and fog
  const configureMapStyle = () => {
    if (!map.current) return;

    try {
      // Try to set Mapbox Standard config properties (only works with Standard style)
      try {
        map.current.setConfigProperty("basemap", "lightPreset", "dusk");
        map.current.setConfigProperty("basemap", "showPointOfInterestLabels", true);
        map.current.setConfigProperty("basemap", "showTransitLabels", true);
      } catch (configError) {
        // Ignore if style doesn't support these config properties
      }

      // Add terrain source if it doesn't exist yet
      if (!map.current.getSource("mapbox-dem")) {
        map.current.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
      }

      // Now set terrain
      map.current.setTerrain({
        source: "mapbox-dem",
        exaggeration: 1.5,
      });

      // Add fog
      map.current.setFog({
        range: [0.5, 10],
        color: "#e0e7ff",
        "horizon-blend": 0.15,
      });

      console.log("Map style configured with terrain!");
    } catch (e) {
      console.log("Could not configure map style:", e);
    }
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: STYLE_OPTIONS.STREETS,
      center: KAMPALA_CENTER,
      zoom: KAMPALA_ZOOM,
      pitch: KAMPALA_PITCH,
      bearing: KAMPALA_BEARING,
      antialias: true,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.ScaleControl(), "bottom-left");
    map.current.addControl(new mapboxgl.AttributionControl(), "bottom-right");

    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    });
    map.current.addControl(geolocateControl, "top-right");

    // Configure style on load
    map.current.on("style.load", configureMapStyle);

    map.current.on("styleimagemissing", (e) => {
      map.current?.addImage(e.id, new ImageData(1, 1));
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Reconfigure terrain when switching styles
  useEffect(() => {
    if (map.current) {
      // Wait for style to load, then configure
      if (map.current.isStyleLoaded()) {
        configureMapStyle();
      } else {
        map.current.once("style.load", configureMapStyle);
      }
    }
  }, [currentStyle]);

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

      {/* Search Bar */}
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

      {/* Style Switcher */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-[#1B2A4A]/95 backdrop-blur rounded-2xl shadow-xl border border-white/10 overflow-hidden flex">
          <button
            onClick={() => switchStyle("DARK")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              currentStyle === "DARK"
                ? "bg-[#FF6B35] text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Dark
          </button>
          <button
            onClick={() => switchStyle("STREETS")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              currentStyle === "STREETS"
                ? "bg-[#FF6B35] text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Streets
          </button>
          <button
            onClick={() => switchStyle("SATELLITE_STREETS")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              currentStyle === "SATELLITE_STREETS"
                ? "bg-[#FF6B35] text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Satellite
          </button>
        </div>
      </div>

      {/* Layer Controls */}
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

      {/* Route Info Panel */}
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
