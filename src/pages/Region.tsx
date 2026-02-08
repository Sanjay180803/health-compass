import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  regionData,
  countryMapConfigs,
  detectCountryFromCoords,
  type RegionStats,
} from "@/data/healthcareData";
import { usePersistedLocation } from "@/hooks/usePersistedLocation";
import RegionFilterDropdown, { type FilterType } from "@/components/region/RegionFilterDropdown";
import RegionInfoPanel from "@/components/region/RegionInfoPanel";
import RegionBarChart from "@/components/region/RegionBarChart";
import { getRedShadeMap } from "@/utils/redShadeMap";

// Fix Leaflet default marker icons for Vite bundler
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const Region = () => {
  const { locationGranted, requesting, userLat, userLng, requestLocation } =
    usePersistedLocation();

  const [country, setCountry] = useState("United States");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterType[]>(["healthcareIndex"]);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  // Detect country from stored coords
  useEffect(() => {
    if (locationGranted) {
      setCountry(detectCountryFromCoords(userLat, userLng));
    }
  }, [locationGranted, userLat, userLng]);

  const states = country ? regionData[country] : null;
  const currentStats: RegionStats | null =
    selectedState && states ? states[selectedState] : null;
  const mapConfig = countryMapConfigs[country] ?? {
    center: [39.83, -98.58] as [number, number],
    zoom: 4,
  };

  const showBarChart = filters.length >= 2;

  // Red shade map based on the first selected filter
  const redShades = useMemo(() => {
    if (!states) return {};
    return getRedShadeMap(states, filters[0]);
  }, [states, filters]);

  // Initialize map
  useEffect(() => {
    if (!locationGranted || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [mapConfig.center[0], mapConfig.center[1]],
      zoom: mapConfig.zoom,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationGranted]);

  // Update markers when country/filter changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !states) return;

    map.flyTo([mapConfig.center[0], mapConfig.center[1]], mapConfig.zoom, {
      duration: 1.5,
    });

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
        map.removeLayer(layer);
      }
    });

    // User location blue dot
    L.circleMarker([userLat, userLng], {
      radius: 10,
      color: "hsl(200, 70%, 50%)",
      fillColor: "hsl(200, 70%, 50%)",
      fillOpacity: 0.6,
      weight: 3,
    })
      .bindPopup(
        '<span class="font-semibold text-sm">📍 Your location</span>'
      )
      .addTo(map);

    // State markers – circle markers colored in red shades
    Object.entries(states).forEach(([key, stats]) => {
      const color = redShades[key] ?? "hsl(0, 70%, 60%)";

      const circle = L.circleMarker([stats.lat, stats.lng], {
        radius: 14,
        color: color,
        fillColor: color,
        fillOpacity: 0.75,
        weight: 2,
      })
        .bindPopup(
          `<div class="text-sm font-semibold">${stats.name}</div>` +
            `<div class="text-xs">Index: ${stats.healthcareIndex}/100</div>`
        )
        .addTo(map);

      circle.on("click", () => {
        setSelectedState(key);
      });
    });
  }, [locationGranted, country, filters, states, mapConfig, userLat, userLng, redShades]);

  // Invalidate map size when layout changes (bar chart toggle)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const timer = setTimeout(() => map.invalidateSize(), 350);
    return () => clearTimeout(timer);
  }, [showBarChart]);

  // ─── Permission screen ─────────────────────────────────────────
  if (!locationGranted) {
    return (
      <div
        className="flex flex-col items-center justify-center text-center gap-6"
        style={{ height: "calc(100vh - 56px)" }}
      >
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center pulse-ring">
          <MapPin className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Enable Location Access
        </h1>
        <p className="text-muted-foreground max-w-md text-sm">
          We need your location to display healthcare statistics for your region
          on an interactive map. Your data stays private.
        </p>
        <Button onClick={requestLocation} disabled={requesting} size="lg">
          {requesting ? "Requesting…" : "Allow Location Access"}
        </Button>
      </div>
    );
  }

  // ─── Map + optional bar chart view ─────────────────────────────
  return (
    <div
      className="relative flex flex-col"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* Map section */}
      <div
        className="relative w-full"
        style={{ height: showBarChart ? "55%" : "100%", transition: "height 0.3s ease" }}
      >
        <div ref={mapContainerRef} className="h-full w-full z-0" />

        {/* Filter dropdown overlay (top-right) */}
        <div className="absolute top-4 right-4 z-[1000]">
          <RegionFilterDropdown selected={filters} onChange={setFilters} />
        </div>

        {/* Country label (top-left) */}
        <div className="absolute top-4 left-4 z-[1000] glass-panel rounded-xl px-4 py-2">
          <p className="text-sm font-bold text-foreground">{country}</p>
          <p className="text-xs text-muted-foreground">
            Click a marker to view details
          </p>
        </div>

        {/* Legend color scale (bottom-left) */}
        <div className="absolute bottom-4 left-4 z-[1000] glass-panel rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Least severe</span>
          <div
            className="h-3 w-24 rounded-full"
            style={{
              background: "linear-gradient(to right, hsl(0,70%,85%), hsl(0,70%,35%))",
            }}
          />
          <span className="text-xs text-muted-foreground">Most severe</span>
        </div>

        {/* Info panel */}
        {currentStats && (
          <RegionInfoPanel
            stats={currentStats}
            onClose={() => setSelectedState(null)}
          />
        )}
      </div>

      {/* Bar chart section (only when 2+ filters) */}
      {showBarChart && states && (
        <div
          className="w-full bg-card border-t border-border px-4 py-3"
          style={{ height: "45%" }}
        >
          <p className="text-sm font-semibold text-foreground mb-1">
            Comparison across states
          </p>
          <div style={{ height: "calc(100% - 28px)" }}>
            <RegionBarChart states={states} filters={filters} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Region;
