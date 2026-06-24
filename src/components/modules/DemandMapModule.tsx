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
  X,
} from "lucide-react";
import {
  KAMPALA_ZOOM,
  KAMPALA_PITCH,
  KAMPALA_BEARING,
  MAPBOX_ACCESS_TOKEN,
  STYLE_OPTIONS,
} from "@/lib/map-config";
import { useSignal } from "@/providers/SignalProvider";
import { DemandSignal, Driver, Route } from "@prisma/client";



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

const BUGOLOBI_CENTER: [number, number] = [32.6106, 0.3132];

export default function DemandMapModule() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapCanvasRef = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
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
  const [currentStyle, setCurrentStyle] = useState<"DARK" | "STREETS" | "SATELLITE_STREETS" | "STANDARD">("STANDARD");
  const [signals, setSignals] = useState<DemandSignal[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [runsheets, setRunsheets] = useState<Route[]>([]);
  const [showAssignDriverModal, setShowAssignDriverModal] = useState<DemandSignal | null>(null);
  const { focusSignal, setFocusSignal } = useSignal();

  useEffect(() => {
    if (typeof window !== 'undefined' && MAPBOX_ACCESS_TOKEN && !mapboxgl.accessToken) {
      mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    }
  }, []);

  const fetchSignals = async () => {
    try {
      const res = await fetch("/api/signals");
      const data = await res.json();
      if (data.success) {
        setSignals(data.data);
      }
    } catch (error) {
      console.error("Error fetching signals:", error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await fetch("/api/drivers");
      const data = await res.json();
      if (data.success) {
        setDrivers(data.data);
      }
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  const fetchRunsheets = async () => {
    try {
      const res = await fetch("/api/runsheets");
      const data = await res.json();
      if (data.success) {
        setRunsheets(data.data);
      }
    } catch (error) {
      console.error("Error fetching runsheets:", error);
    }
  };

  const activeRunsheet = runsheets.find(r => r.isActive);

  const handleAssignDriver = async (driverId: string) => {
    if (!showAssignDriverModal) return;
    try {
      await fetch(`/api/signals/${showAssignDriverModal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId }),
      });
      setShowAssignDriverModal(null);
      fetchSignals();
    } catch (e) {
      console.error("Error assigning driver:", e);
    }
  };

  const handleAddToRunsheet = async (signal: DemandSignal) => {
    if (!activeRunsheet) return;
    try {
      await fetch(`/api/signals/${signal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routeId: activeRunsheet.id }),
      });
      fetchSignals();
    } catch (e) {
      console.error("Error adding to runsheet:", e);
    }
  };

  const addSignalMarkers = () => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    signals.forEach(signal => {
      if (signal.latitude && signal.longitude && activeLayers.signals) {
        const color = signal.urgency === "urgent" ? "#EF4444" : signal.urgency === "normal" ? "#F59E0B" : "#3B82F6";
        
        // Create custom popup with buttons
        const popup = new mapboxgl.Popup({ offset: 25 });
        
        // Use a div to render our content
        const popupContent = document.createElement('div');
        popupContent.innerHTML = `
          <div style="padding: 12px; max-width: 240px;">
            <h4 style="font-weight: bold; margin: 0 0 8px 0;">${signal.businessName || signal.signalId}</h4>
            <p style="margin: 4px 0;">${signal.productLabel} (x${signal.quantity})</p>
            <p style="margin: 4px 0; font-size: 12px; color: ${color};">${signal.urgency}</p>
            <div style="margin-top: 12px; display: flex; gap: 8px; flex-direction: column;">
              ${activeRunsheet ? `<button id="add-to-runsheet-${signal.id}" style="width:100%; padding:8px 12px; background:#FF6B35; color:white; border:none; border-radius:6px; cursor:pointer;">Add to Runsheet</button>` : ''}
              <button id="assign-driver-${signal.id}" style="width:100%; padding:8px 12px; background:#3B82F6; color:white; border:none; border-radius:6px; cursor:pointer;">Assign Driver</button>
            </div>
          </div>
        `;
        
        // Add click handlers to buttons
        const addBtn = popupContent.querySelector(`#add-to-runsheet-${signal.id}`);
        if (addBtn) {
          addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleAddToRunsheet(signal);
            popup.remove();
          });
        }
        
        const assignBtn = popupContent.querySelector(`#assign-driver-${signal.id}`);
        if (assignBtn) {
          assignBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            setShowAssignDriverModal(signal);
            popup.remove();
          });
        }
        
        popup.setDOMContent(popupContent);

        const marker = new mapboxgl.Marker({ color })
          .setLngLat([signal.longitude, signal.latitude])
          .setPopup(popup)
          .addTo(map.current!);

        markers.current.push(marker);
      }
    });

    // Mark map as ready after markers are added
    setMapReady(true);
  };

  // Nominatim search
  const handleSearch = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=10&viewbox=${BUGOLOBI_CENTER[0] - 0.5},${BUGOLOBI_CENTER[1] + 0.5},${BUGOLOBI_CENTER[0] + 0.5},${BUGOLOBI_CENTER[1] - 0.5}&bounded=1`,
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

  const switchStyle = (style: "DARK" | "STREETS" | "SATELLITE_STREETS" | "STANDARD") => {
    setCurrentStyle(style);
    if (map.current) {
      map.current.setStyle(STYLE_OPTIONS[style]);
    }
  };

  useEffect(() => {
    fetchSignals();
    fetchDrivers();
    fetchRunsheets();
  }, []);

  useEffect(() => {
    const initMap = async () => {
      if (!mapCanvasRef.current) return;

      map.current = new mapboxgl.Map({
        container: mapCanvasRef.current,
        style: STYLE_OPTIONS[currentStyle], // Use the configured style options that will use the token
        center: BUGOLOBI_CENTER,
        zoom: KAMPALA_ZOOM,
        pitch: KAMPALA_PITCH,
        bearing: KAMPALA_BEARING,
        antialias: true,
      });
    };

    initMap().then(() => {
      if (!map.current) return;

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.current.addControl(new mapboxgl.ScaleControl(), "bottom-left");
      map.current.addControl(new mapboxgl.AttributionControl(), "bottom-right");

      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      });
      map.current.addControl(geolocateControl, "top-right");

      map.current.on("style.load", () => {
        if (!map.current) return;

        // Only configure basemap properties for the STANDARD style
        if (currentStyle === "STANDARD") {
          try {
            map.current.setConfigProperty("basemap", "lightPreset", "dusk");
            map.current.setConfigProperty("basemap", "showPointOfInterestLabels", true);
            map.current.setConfigProperty("basemap", "showTransitLabels", true);
          } catch (e) {
            console.log("Could not configure Mapbox Standard:", e);
          }
        }
        addSignalMarkers();
      });

      // Set map ready after initial load
      map.current.on("load", () => {
        setMapReady(true);
      });

      map.current.on("styleimagemissing", (e) => {
        map.current?.addImage(e.id, new ImageData(1, 1));
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [currentStyle]); // Add currentStyle as a dependency since we're using it in the effect

  useEffect(() => {
    addSignalMarkers();
  }, [signals, activeLayers.signals, runsheets]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const toggleLayer = (id: string) => {
    setActiveLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Track if map is fully loaded with markers
  const [mapReady, setMapReady] = useState(false);

  // Handle focus signal
  useEffect(() => {
    if (map.current && mapReady && focusSignal && focusSignal.latitude && focusSignal.longitude) {
      map.current.flyTo({
        center: [focusSignal.longitude, focusSignal.latitude],
        zoom: 17,
        pitch: KAMPALA_PITCH,
        essential: true,
      });

      // Find and open the popup for the focus signal
      const signalMarker = markers.current.find((marker) => {
        const lngLat = marker.getLngLat();
        return lngLat.lng === focusSignal.longitude && lngLat.lat === focusSignal.latitude;
      });
      
      if (signalMarker) {
        signalMarker.togglePopup();
      }

      // Clear focus signal after user has time to see
      setTimeout(() => {
        setFocusSignal(null);
      }, 3000);
    }
  }, [focusSignal, setFocusSignal, mapReady]);

  return (
    <div className="h-[calc(100vh-64px)] relative">
      <div ref={mapContainer} className="w-full h-full relative">
        <div ref={mapCanvasRef} className="absolute inset-0" />

        {/* Search Bar (moved inside map container) */}
        <div className="absolute top-4 left-4 z-10 w-[480px] pointer-events-none">
          <div className="bg-[#1B2A4A]/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden border border-white/10 pointer-events-auto">
            <div className="flex items-center gap-3 px-5 py-4">
              <Search className="w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search all buildings, streets, and locations in Kampala..."
                className="flex-1 px-3 py-1 text-base outline-none bg-transparent text-white placeholder-gray-400 pointer-events-auto"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
              />
              <button
                onClick={handleGeolocate}
                className="p-2 hover:bg-white/10 rounded-xl pointer-events-auto"
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
                    className="w-full px-5 py-3.5 text-left hover:bg-white/10 flex items-center gap-3 border-b border-white/5 last:border-0 pointer-events-auto"
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

        {/* Style Switcher (inside map) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <div className="bg-[#1B2A4A]/95 backdrop-blur rounded-2xl shadow-xl border border-white/10 overflow-hidden flex pointer-events-auto">
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
              onClick={() => switchStyle("STANDARD")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                currentStyle === "STANDARD"
                  ? "bg-[#FF6B35] text-white"
                  : "text-gray-300 hover:bg-white/10"
              }`}
            >
              <MapIcon className="w-4 h-4" />
              Standard
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

        {/* Layer Controls (inside map) */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          <button
            onClick={() => setShowControls(!showControls)}
            className="bg-[#1B2A4A]/95 backdrop-blur rounded-xl shadow-xl p-3 mb-3 border border-white/10 pointer-events-auto"
          >
            {showControls ? (
              <EyeOff className="w-6 h-6 text-gray-200" />
            ) : (
              <Eye className="w-6 h-6 text-gray-200" />
            )}
          </button>

          {showControls && (
            <div className="bg-[#1B2A4A]/95 backdrop-blur rounded-2xl shadow-xl p-5 w-72 border border-white/10 pointer-events-auto">
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
      </div>

      {/* Assign Driver Modal */}
      {showAssignDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Assign Driver</h3>
              <button
                onClick={() => setShowAssignDriverModal(null)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4 text-sm text-gray-600">
              <p className="font-medium text-gray-900">{showAssignDriverModal.businessName}</p>
              <p>{showAssignDriverModal.productLabel} (x{showAssignDriverModal.quantity})</p>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {drivers
                .filter(d => d.status === "active")
                .map(driver => (
                  <button
                    key={driver.id}
                    onClick={() => handleAssignDriver(driver.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-orange-50 transition-colors"
                  >
                    {driver.photoUrl ? (
                      <img
                        src={driver.photoUrl}
                        alt={driver.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                        {driver.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{driver.name}</p>
                      <p className="text-sm text-gray-500">{driver.phone}</p>
                    </div>
                  </button>
                ))}
              {drivers.filter(d => d.status === "active").length === 0 && (
                <div className="text-center py-6 text-gray-500">No active drivers available</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
