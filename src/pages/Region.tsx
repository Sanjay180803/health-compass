import { useState, useEffect, useRef, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Hospital, Stethoscope, Cloud, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  regionData,
  countryMapConfigs,
  detectCountryFromCoords,
  getHealthcareColor,
  type RegionStats,
} from "@/data/healthcareData";

// Fix Leaflet default marker icons for Vite bundler
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type FilterType = "all" | "hospitals" | "doctors" | "climate" | "alerts";

const Region = () => {
  const [locationGranted, setLocationGranted] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [userLat, setUserLat] = useState(39.83);
  const [userLng, setUserLng] = useState(-98.58);
  const [country, setCountry] = useState("United States");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  const requestLocation = () => {
    setRequesting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLat(latitude);
          setUserLng(longitude);
          setCountry(detectCountryFromCoords(latitude, longitude));
          setLocationGranted(true);
          setRequesting(false);
        },
        () => {
          setLocationGranted(true);
          setRequesting(false);
        },
      );
    } else {
      setLocationGranted(true);
      setRequesting(false);
    }
  };

  const states = country ? regionData[country] : null;
  const currentStats: RegionStats | null =
    selectedState && states ? states[selectedState] : null;
  const mapConfig = countryMapConfigs[country] ?? { center: [39.83, -98.58] as [number, number], zoom: 4 };

  const getFilterLabel = useCallback((stats: RegionStats): string => {
    switch (filter) {
      case "hospitals":
        return `🏥 ${stats.hospitals.toLocaleString()} hospitals`;
      case "doctors":
        return `🩺 ${stats.doctors.toLocaleString()} doctors`;
      case "climate":
        return `🌤 ${stats.climate}`;
      case "alerts":
        return stats.healthAlerts.length > 0
          ? `⚠ ${stats.healthAlerts[0]}`
          : "✓ No alerts";
      default:
        return `Index: ${stats.healthcareIndex}/100`;
    }
  }, [filter]);

  // Initialize map
  useEffect(() => {
    if (!locationGranted || !mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [mapConfig.center[0], mapConfig.center[1]],
      zoom: mapConfig.zoom,
      zoomControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // Only run once when location is granted
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationGranted]);

  // Fly to country center & update markers when country/filter changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !states) return;

    map.flyTo([mapConfig.center[0], mapConfig.center[1]], mapConfig.zoom, { duration: 1.5 });

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
      .bindPopup('<span class="font-semibold text-sm">📍 Your location</span>')
      .addTo(map);

    // State markers
    Object.entries(states).forEach(([key, stats]) => {
      const marker = L.marker([stats.lat, stats.lng])
        .bindPopup(
          `<div class="text-sm font-semibold">${stats.name}</div>` +
          `<div class="text-xs">${getFilterLabel(stats)}</div>`
        )
        .addTo(map);

      marker.on("click", () => {
        setSelectedState(key);
      });
    });
  }, [locationGranted, country, filter, states, mapConfig, userLat, userLng, getFilterLabel]);

  // ─── Permission screen ─────────────────────────────────────────
  if (!locationGranted) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-6" style={{ height: "calc(100vh - 56px)" }}>
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center pulse-ring">
          <MapPin className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Enable Location Access</h1>
        <p className="text-muted-foreground max-w-md text-sm">
          We need your location to display healthcare statistics for your region on an interactive map. Your data stays private.
        </p>
        <Button onClick={requestLocation} disabled={requesting} size="lg">
          {requesting ? "Requesting…" : "Allow Location Access"}
        </Button>
      </div>
    );
  }

  // ─── Map view ──────────────────────────────────────────────────
  return (
    <div className="relative" style={{ height: "calc(100vh - 56px)" }}>
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      {/* ─── Filter dropdown overlay (top-right) ────────────────── */}
      <div className="absolute top-4 right-4 z-[1000]">
        <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
          <SelectTrigger className="w-48 bg-card/90 backdrop-blur-md border-border shadow-lg">
            <SelectValue placeholder="Filter by…" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Overall Index</SelectItem>
            <SelectItem value="hospitals">Hospitals</SelectItem>
            <SelectItem value="doctors">Doctors</SelectItem>
            <SelectItem value="climate">Climate</SelectItem>
            <SelectItem value="alerts">Health Alerts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ─── Country label (top-left) ───────────────────────────── */}
      <div className="absolute top-4 left-4 z-[1000] glass-panel rounded-xl px-4 py-2">
        <p className="text-sm font-bold text-foreground">{country}</p>
        <p className="text-xs text-muted-foreground">Click a marker to view details</p>
      </div>

      {/* ─── Translucent legend / info panel (bottom) ───────────── */}
      {currentStats && (
        <div className="absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[400px] z-[1000] glass-panel rounded-2xl p-5 space-y-3 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${getHealthcareColor(currentStats.healthcareIndex)}`} />
              <h3 className="text-lg font-bold text-foreground">{currentStats.name}</h3>
            </div>
            <button
              onClick={() => setSelectedState(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <LegendItem icon={Hospital} label="Hospitals" value={currentStats.hospitals.toLocaleString()} />
            <LegendItem icon={Stethoscope} label="Doctors" value={currentStats.doctors.toLocaleString()} />
            <LegendItem icon={Cloud} label="Climate" value={currentStats.climate} />
            <LegendItem icon={AlertTriangle} label="Health Index" value={`${currentStats.healthcareIndex}/100`} />
          </div>

          {currentStats.healthAlerts.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-xs font-semibold text-destructive mb-1">⚠ Health Alerts</p>
              <ul className="text-xs text-foreground space-y-0.5">
                {currentStats.healthAlerts.map((alert, i) => (
                  <li key={i}>• {alert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function LegendItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

export default Region;
