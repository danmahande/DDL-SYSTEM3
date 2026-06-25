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

const BUGOLOBI_CENTER: [number, number] = [32.6106, 0.3132];

export default function DemandMapModule() {
  const mapContainer = useRef<HTMLDivElement>(null);
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

    // Prepare data for advanced layers (clustering/heatmap)
    if (map.current.isStyleLoaded()) {
      // Create or update the signals data source
      const sourceId = 'signals-data';
      if (map.current.getSource(sourceId)) {
        (map.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: signals
            .filter(signal => signal.latitude && signal.longitude)
            .map(signal => ({
              type: 'Feature',
              properties: {
                id: signal.id,
                signalId: signal.signalId,
                businessName: signal.businessName || signal.shopkeeperId,
                productLabel: signal.productLabel,
                quantity: signal.quantity,
                urgency: signal.urgency,
                urgencyValue: signal.urgency === 'urgent' ? 3 : signal.urgency === 'normal' ? 2 : 1,
                shopkeeperId: signal.shopkeeperId,
                productCategory: signal.productCategory,
                packageSize: signal.packageSize,
                source: signal.source,
                status: signal.status,
                createdAt: signal.createdAt?.toISOString(),
                updatedAt: signal.updatedAt?.toISOString(),
                neighborhood: signal.neighborhood,
                driverId: signal.driverId,
                routeId: signal.routeId,
                latitude: signal.latitude,
                longitude: signal.longitude
              },
              geometry: {
                type: 'Point',
                coordinates: [signal.longitude!, signal.latitude!]
              }
            }))
        });
      } else {
        map.current.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: signals
              .filter(signal => signal.latitude && signal.longitude)
              .map(signal => ({
                type: 'Feature',
                properties: {
                  id: signal.id,
                  signalId: signal.signalId,
                  businessName: signal.businessName || signal.shopkeeperId,
                  productLabel: signal.productLabel,
                  quantity: signal.quantity,
                  urgency: signal.urgency,
                  urgencyValue: signal.urgency === 'urgent' ? 3 : signal.urgency === 'normal' ? 2 : 1,
                  shopkeeperId: signal.shopkeeperId,
                  productCategory: signal.productCategory,
                  packageSize: signal.packageSize,
                  source: signal.source,
                  status: signal.status,
                  createdAt: signal.createdAt?.toISOString(),
                  updatedAt: signal.updatedAt?.toISOString(),
                  neighborhood: signal.neighborhood,
                  driverId: signal.driverId,
                  routeId: signal.routeId,
                  latitude: signal.latitude,
                  longitude: signal.longitude
                },
                geometry: {
                  type: 'Point',
                  coordinates: [signal.longitude!, signal.latitude!]
                }
              }))
          },
          cluster: true,
          clusterMaxZoom: 14, // Max zoom to cluster points on
          clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
        });
      }
    }

    // Add individual markers for signals if clustering is not active
    if (activeLayers.signals && (!map.current.getLayer('signals-cluster') || map.current.getZoom() > 14)) {
      signals.forEach(signal => {
        if (signal.latitude && signal.longitude) {
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
    }

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
    if (!mapContainer.current) return;

    // Ensure the container allows pointer events
    if (mapContainer.current) {
      mapContainer.current.style.pointerEvents = "auto";
      mapContainer.current.style.touchAction = "auto";
      // Ensure the container has proper dimensions and positioning
      mapContainer.current.style.position = "relative";
    }

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: STYLE_OPTIONS[currentStyle], // Use the configured style options that will use the token
      center: BUGOLOBI_CENTER,
      zoom: KAMPALA_ZOOM,
      pitch: KAMPALA_PITCH,
      bearing: KAMPALA_BEARING,
      antialias: true,
      // Explicitly enable user interactions so mouse drag/scroll/touch work
      dragPan: true,
      dragRotate: true,
      scrollZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      touchZoomRotate: true,
      keyboard: true,
      interactive: true,
      // Make sure to disable attribution control if it's causing issues
      attributionControl: true,
    });

    // Disable default double click zoom and handle it separately if needed
    map.current.doubleClickZoom.disable();

    // Add custom controls and advanced features
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.ScaleControl(), "bottom-left");
    map.current.addControl(new mapboxgl.AttributionControl(), "bottom-right");

    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserHeading: true,
    });
    map.current.addControl(geolocateControl, "top-right");

    // Add fullscreen control
    map.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

    // Add custom draw control for drawing areas/geofences
    // Note: This would require installing @mapbox/mapbox-gl-draw
    // const Draw = new MapboxDraw();
    // map.current.addControl(Draw, 'top-left');

    // Add measure control for distance measurement
    // Note: This would require a custom implementation or third-party plugin
    // const measureControl = new MeasureControl();
    // map.current.addControl(measureControl, 'top-left');

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
      
      // Add terrain and water features if the style supports it
      addTerrainAndWaterFeatures();
      
      // Add additional layers for advanced visualization
      addAdvancedLayers();
      addSignalMarkers();
    });

    // Ensure common interaction handlers are enabled after style loads
    map.current.on('load', () => {
      // Check if map instance is valid and interactions are properly set
      if (map.current) {
        // Re-enable interactions in case they were disabled during style changes
        if (map.current.dragPan) {
          map.current.dragPan.enable();
        } else {
          // If dragPan is not available as a method, ensure it's enabled via options
          console.log("DragPan is not available as a method, relying on initialization option");
        }
        if (map.current.dragRotate) {
          map.current.dragRotate.enable();
        }
        if (map.current.scrollZoom) {
          map.current.scrollZoom.enable();
        }
        if (map.current.doubleClickZoom) {
          map.current.doubleClickZoom.enable();
        }
        if (map.current.boxZoom) {
          map.current.boxZoom.enable();
        }
        if (map.current.touchZoomRotate) {
          map.current.touchZoomRotate.enable();
        }
        if (map.current.keyboard) {
          map.current.keyboard.enable();
        }
        
        // Add additional event listeners for enhanced user experience
        map.current.on('zoomend', handleZoomEnd);
        
        map.current.on('rotateend', handleRotateEnd);
        
        map.current.on('pitchend', handlePitchEnd);
      }
    });

    // Set map ready after initial load
    map.current.on("load", () => {
      setMapReady(true);
    });

    map.current.on("styleimagemissing", (e) => {
      map.current?.addImage(e.id, new ImageData(1, 1));
    });

    // Additional event listeners to debug panning issues
    const handleMouseDown = () => {
      console.log('Map received mousedown event');
    };

    const handleMoveStart = () => {
      console.log('Map move started');
    };

    const handleMoveEnd = () => {
      console.log('Map move ended');
    };

    map.current.on('mousedown', handleMouseDown);
    map.current.on('movestart', handleMoveStart);
    map.current.on('moveend', handleMoveEnd);

    return () => {
      if (map.current) {
        // Remove event listeners to prevent memory leaks
        map.current.off('mousedown', handleMouseDown);
        map.current.off('movestart', handleMoveStart);
        map.current.off('moveend', handleMoveEnd);
        map.current.off('zoomend', handleZoomEnd);
        map.current.off('rotateend', handleRotateEnd);
        map.current.off('pitchend', handlePitchEnd);
        map.current.remove();
      }
    };
  }, [currentStyle]); // Add currentStyle as a dependency since we're using it in the effect

  // Define event handlers for enhanced user experience
  const handleZoomEnd = () => {
    console.log('Zoom level:', map.current?.getZoom());
  };
  
  const handleRotateEnd = () => {
    console.log('Bearing:', map.current?.getBearing());
  };
  
  const handlePitchEnd = () => {
    console.log('Pitch:', map.current?.getPitch());
  };

  // Add advanced visualization layers (heatmap, clusters, etc.)
  const addAdvancedLayers = () => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Add heatmap layer for signal density
    if (!map.current.getLayer('signals-heat')) {
      map.current.addLayer({
        'id': 'signals-heat',
        'type': 'heatmap',
        'source': 'signals-data',
        'maxzoom': 15,
        'paint': {
          // Increase the heatmap weight based on urgency - urgent signals are more prominent
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'urgencyValue'], // Assuming you add this property to your data
            0, 0,
            3, 1
          ],
          // Increase intensity as zoom level increases
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 1,
            15, 3
          ],
          // Color ramp for heatmap. Domain is 0 (low) to 1 (high).
          // Begin color ramp at 0-stop with a 0-transparancy color
          // to create a blur-like effect.
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33, 102, 172, 0)',
            0.2, 'rgb(103, 169, 207)',
            0.4, 'rgb(209, 229, 240)',
            0.6, 'rgb(253, 219, 199)',
            0.8, 'rgb(239, 138, 98)',
            1, 'rgb(178, 24, 43)'
          ],
          // Adjust the heatmap radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 2,
            9, 20
          ],
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 1,
            9, 0.3
          ]
        }
      }, 'waterway-label'); // Try to place before water labels
    }

    // Add cluster layer for grouping nearby signals
    if (!map.current.getLayer('signals-cluster')) {
      map.current.addLayer({
        id: 'signals-cluster',
        type: 'circle',
        source: 'signals-data',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      // Add cluster count labels
      if (!map.current.getLayer('signals-cluster-count')) {
        map.current.addLayer({
          id: 'signals-cluster-count',
          type: 'symbol',
          source: 'signals-data',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 12
          }
        });
      }
    }

    // Add circle layer for unclustered points
    if (!map.current.getLayer('signals-unclustered')) {
      map.current.addLayer({
        id: 'signals-unclustered',
        type: 'circle',
        source: 'signals-data',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'urgency'],
            'urgent', '#EF4444',
            'normal', '#F59E0B',
            'low', '#3B82F6',
            '#9CA3AF' // default color
          ],
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });
    }
  };

  // Add terrain and water features
  const addTerrainAndWaterFeatures = () => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    // Add terrain if the style supports it
    if (map.current.getStyle().terrain) {
      console.log('Terrain already configured in style');
    } else {
      // For styles that don't have built-in terrain, we can add hillshading
      if (!map.current.getLayer('hillshading')) {
        map.current.addLayer({
          'id': 'hillshading',
          'type': 'hillshade',
          'source': {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.terrain-rgb',
            'tileSize': 512
          },
          'paint': {
            'hillshade-shadow-color': '#473B24'
          }
        }, 'waterway-label'); // Insert before labels
      }
    }

    // Enhance water features with custom styling
    if (map.current.getLayer('water')) {
      map.current.setPaintProperty('water', 'fill-color', [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        '#2a4ba9', // Highlight color when hovered
        '#2a7fcb'  // Normal water color
      ]);
      map.current.setPaintProperty('water', 'fill-opacity', 0.7);
    }

    // Add water depth contours if available
    if (!map.current.getLayer('water-depth')) {
      // This layer would require custom bathymetry data
      // For demonstration purposes, we'll skip this unless you have depth data
    }

    // Add custom water features if not already present
    if (!map.current.getLayer('custom-water-features')) {
      map.current.addLayer({
        'id': 'custom-water-features',
        'type': 'line',
        'source': 'composite',
        'source-layer': 'waterway',
        'filter': ['in', '$type', 'LineString'],
        'paint': {
          'line-color': '#2a7fcb',
          'line-width': [
            'interpolate',
            ['exponential', 1.2],
            ['zoom'],
            8.5, ['case',
              ['==', ['get', 'class'], 'river'], 1,
              ['==', ['get', 'class'], 'canal'], 0.8,
              0.5
            ],
            20, ['case',
              ['==', ['get', 'class'], 'river'], 8,
              ['==', ['get', 'class'], 'canal'], 6,
              4
            ]
          ],
          'line-opacity': 0.8
        }
      }, 'water');
    }

    // Add elevation contour lines if the style supports it
    if (!map.current.getLayer('contour-lines')) {
      // Add contour lines layer (requires contour data source)
      // For now, we'll add it conditionally if the data exists
      if (map.current.getSource('contours')) {
        map.current.addLayer({
          'id': 'contour-lines',
          'type': 'line',
          'source': 'contours',
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#888',
            'line-width': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 1,
              16, 1.5
            ],
            'line-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              10, 0.3,
              16, 0.6
            ]
          }
        }, 'water');
      }
    }
  };

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
    
    // Update visibility of advanced layers based on toggles
    if (map.current && map.current.isStyleLoaded()) {
      switch(id) {
        case 'heatmap':
          if (map.current.getLayer('signals-heat')) {
            map.current.setLayoutProperty('signals-heat', 'visibility', 
              activeLayers.heatmap ? 'visible' : 'none');
          }
          break;
        case 'clusters':
          if (map.current.getLayer('signals-cluster')) {
            map.current.setLayoutProperty('signals-cluster', 'visibility', 
              activeLayers.clusters ? 'visible' : 'none');
          }
          if (map.current.getLayer('signals-cluster-count')) {
            map.current.setLayoutProperty('signals-cluster-count', 'visibility', 
              activeLayers.clusters ? 'visible' : 'none');
          }
          if (map.current.getLayer('signals-unclustered')) {
            map.current.setLayoutProperty('signals-unclustered', 'visibility', 
              activeLayers.clusters ? 'visible' : 'none');
          }
          break;
        case 'signals':
          // Hide/show individual signal markers based on this layer
          // Individual markers will be handled in addSignalMarkers function
          break;
      }
    }
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
