import { useState, useEffect, useRef, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  regionData,
  countryMapConfigs,
  detectCountryFromCoords,
  type RegionStats,
} from "@/data/healthcareData";
import { usePersistedLocation } from "@/hooks/usePersistedLocation";
import { useGeoJSON } from "@/hooks/useGeoJSON";
import { useSpecializationData } from "@/hooks/useSpecializationData";
import RegionFilterDropdown, { type FilterType } from "@/components/region/RegionFilterDropdown";
import RegionInfoPanel from "@/components/region/RegionInfoPanel";
import RegionBarChart from "@/components/region/RegionBarChart";
import { getRedShadeMap, getFilterGradient } from "@/utils/redShadeMap";

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
  const [chartExpanded, setChartExpanded] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoLayerRef = useRef<L.GeoJSON | null>(null);

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
    geojsonSource: "/geojson/us-states.json",
    nameProperty: "name",
  };

  const showBarChart = filters.length >= 2;

  // Fetch GeoJSON boundaries
  const { data: geojsonData, loading: geojsonLoading } = useGeoJSON(
    mapConfig.geojsonSource
  );

  // Fetch specialization breakdowns (US-only for now)
  const isUS = country === "United States";
  const { data: hospitalSpecData } = useSpecializationData(
    isUS ? "/geojson/states_dept_hospitals.json" : undefined
  );
  const { data: doctorSpecData } = useSpecializationData(
    isUS ? "/geojson/states_dept_doctors.json" : undefined
  );

  // Red shade map based on the first selected filter
  const redShades = useMemo(() => {
    if (!states) return {};
    return getRedShadeMap(states, filters[0]);
  }, [states, filters]);

  // Build a lookup: lowercase state name → red shade + stats
  // Includes aliases for GeoJSON name mismatches
  const stateLookup = useMemo(() => {
    if (!states) return {};
    const lookup: Record<string, { color: string; stats: RegionStats; key: string }> = {};

    // Aliases: GeoJSON name → our data name
    const aliases: Record<string, string> = {
      "nct of delhi": "delhi",
      "dadra and nagar haveli": "dadra and nagar haveli and daman and diu",
      "daman and diu": "dadra and nagar haveli and daman and diu",
      "jammu & kashmir": "jammu and kashmir",
      "orissa": "odisha",
      "uttaranchal": "uttarakhand",
      "pondicherry": "puducherry",
    };

    Object.entries(states).forEach(([key, stats]) => {
      const entry = {
        color: redShades[key] ?? "hsl(0, 70%, 60%)",
        stats,
        key,
      };
      lookup[stats.name.toLowerCase()] = entry;
    });

    // Add alias entries pointing to the same data
    Object.entries(aliases).forEach(([alias, canonical]) => {
      if (lookup[canonical]) {
        lookup[alias] = lookup[canonical];
      }
    });

    return lookup;
  }, [states, redShades]);

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

  // Render GeoJSON polygons when data/filter/country changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !states || !geojsonData) return;

    map.flyTo([mapConfig.center[0], mapConfig.center[1]], mapConfig.zoom, {
      duration: 1.5,
    });

    // Remove previous GeoJSON layer
    if (geoLayerRef.current) {
      map.removeLayer(geoLayerRef.current);
      geoLayerRef.current = null;
    }

    // Remove any existing circle markers (user dot)
    map.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
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

    // Add GeoJSON layer with color-coded polygons
    const nameProperty = mapConfig.nameProperty;

    const layer = L.geoJSON(geojsonData, {
      style: (feature) => {
        if (!feature) return {};
        const featureName = (
          feature.properties?.[nameProperty] ?? ""
        ).toLowerCase();

        const match = stateLookup[featureName];
        if (match) {
          return {
            fillColor: match.color,
            fillOpacity: 0.6,
            color: "hsl(0, 0%, 40%)",
            weight: 1.5,
          };
        }

        // Unmatched features: light gray
        return {
          fillColor: "hsl(0, 0%, 90%)",
          fillOpacity: 0.3,
          color: "hsl(0, 0%, 60%)",
          weight: 1,
        };
      },
      onEachFeature: (feature, featureLayer) => {
        const featureName = (
          feature.properties?.[nameProperty] ?? ""
        ).toLowerCase();
        const match = stateLookup[featureName];

        if (match) {
          featureLayer.bindPopup(
            `<div class="text-sm font-semibold">${match.stats.name}</div>` +
              `<div class="text-xs">Index: ${match.stats.healthcareIndex}/100</div>`
          );
          featureLayer.on("click", () => {
            setSelectedState(match.key);
          });
          featureLayer.on("mouseover", (e: any) => {
            e.target.setStyle({ fillOpacity: 0.85, weight: 2.5 });
          });
          featureLayer.on("mouseout", (e: any) => {
            layer.resetStyle(e.target);
          });
        }
      },
    }).addTo(map);

    geoLayerRef.current = layer;
  }, [locationGranted, country, filters, states, mapConfig, userLat, userLng, geojsonData, stateLookup]);

  // Invalidate map size when layout changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const timer = setTimeout(() => map.invalidateSize(), 350);
    return () => clearTimeout(timer);
  }, [showBarChart, chartExpanded]);

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
        style={{
          height: showBarChart
            ? chartExpanded
              ? "25%"
              : "55%"
            : "100%",
          transition: "height 0.3s ease",
        }}
      >
        <div ref={mapContainerRef} className="h-full w-full z-0" />

        {/* Loading indicator */}
        {geojsonLoading && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] glass-panel rounded-xl px-4 py-2">
            <p className="text-sm text-muted-foreground animate-pulse">Loading boundaries…</p>
          </div>
        )}

        {/* Filter dropdown overlay (top-right) */}
        <div className="absolute top-4 right-4 z-[1000]">
          <RegionFilterDropdown selected={filters} onChange={setFilters} />
        </div>

        {/* Country label (top-left) */}
        <div className="absolute top-4 left-4 z-[1000] glass-panel rounded-xl px-4 py-2">
          <p className="text-sm font-bold text-foreground">{country}</p>
          <p className="text-xs text-muted-foreground">
            Click a state to view details
          </p>
        </div>

        {/* Legend color scale (bottom-left) */}
        <div className="absolute bottom-4 left-4 z-[1000] glass-panel rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {filters[0] === "hospitals" || filters[0] === "doctors"
              ? "Min"
              : filters[0] === "healthcareIndex"
              ? "High"
              : "Low severity"}
          </span>
          <div
            className="h-3 w-24 rounded-full"
            style={{
              background: getFilterGradient(filters[0]),
            }}
          />
          <span className="text-xs text-muted-foreground">
            {filters[0] === "hospitals" || filters[0] === "doctors"
              ? "Max"
              : filters[0] === "healthcareIndex"
              ? "Low"
              : "High severity"}
          </span>
        </div>

        {/* Info panel */}
        {currentStats && (
          <RegionInfoPanel
            stats={currentStats}
            onClose={() => setSelectedState(null)}
            activeFilters={filters}
            hospitalSpecializations={
              selectedState && hospitalSpecData
                ? hospitalSpecData[currentStats.name] ?? null
                : null
            }
            doctorSpecializations={
              selectedState && doctorSpecData
                ? doctorSpecData[currentStats.name] ?? null
                : null
            }
          />
        )}
      </div>

      {/* Bar chart section (only when 2+ filters) */}
      {showBarChart && states && (
        <div
          className="w-full bg-card border-t border-border px-4 py-3"
          style={{
            height: chartExpanded ? "75%" : "45%",
            transition: "height 0.3s ease",
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-foreground">
              Comparison across states (top 10)
            </p>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setChartExpanded((prev) => !prev)}
              title={chartExpanded ? "Minimize chart" : "Maximize chart"}
            >
              {chartExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div style={{ height: "calc(100% - 32px)" }}>
            <RegionBarChart states={states} filters={filters} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Region;
