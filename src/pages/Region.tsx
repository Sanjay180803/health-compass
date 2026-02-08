import { useState, useEffect } from "react";
import { MapPin, Hospital, Stethoscope, Cloud, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { regionData, getHealthcareColor, getHealthcareTextColor, type RegionStats } from "@/data/healthcareData";

type FilterType = "all" | "hospitals" | "doctors" | "climate" | "alerts";

// Simple mapping from coordinates to a demo country/state
function guessLocation(): { country: string; state: string } {
  // Default to US/California for demo
  return { country: "United States", state: "California" };
}

const Region = () => {
  const [locationGranted, setLocationGranted] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [country, setCountry] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const requestLocation = () => {
    setRequesting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          const loc = guessLocation();
          setCountry(loc.country);
          setSelectedState(loc.state);
          setLocationGranted(true);
          setRequesting(false);
        },
        () => {
          // Denied or error – use default
          const loc = guessLocation();
          setCountry(loc.country);
          setSelectedState(loc.state);
          setLocationGranted(true);
          setRequesting(false);
        }
      );
    } else {
      const loc = guessLocation();
      setCountry(loc.country);
      setSelectedState(loc.state);
      setLocationGranted(true);
      setRequesting(false);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const states = country ? regionData[country] : null;
  const currentStats: RegionStats | null = selectedState && states ? states[selectedState] : null;

  const getFilteredValue = (stats: RegionStats): string | number => {
    switch (filter) {
      case "hospitals": return stats.hospitals;
      case "doctors": return stats.doctors;
      case "climate": return stats.climate;
      case "alerts": return stats.healthAlerts.length > 0 ? stats.healthAlerts.join(", ") : "None";
      default: return stats.healthcareIndex;
    }
  };

  if (!locationGranted) {
    return (
      <div className="container py-20 flex flex-col items-center justify-center text-center space-y-6">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center pulse-ring">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Access Your Location</h1>
        <p className="text-muted-foreground max-w-md">
          We need your location to show healthcare statistics for your region. Your data stays private.
        </p>
        <Button onClick={requestLocation} disabled={requesting} size="lg">
          {requesting ? "Requesting..." : "Allow Location Access"}
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{country}</h1>
          <p className="text-muted-foreground text-sm">Select a state/region to view health data</p>
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by..." />
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

      {/* State grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {states &&
          Object.entries(states).map(([key, stats]) => {
            const isSelected = selectedState === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedState(key)}
                className={`relative p-4 rounded-xl border text-left transition-all hover:shadow-md ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <div className={`absolute top-2 right-2 h-3 w-3 rounded-full ${getHealthcareColor(stats.healthcareIndex)}`} />
                <p className="font-semibold text-sm text-foreground">{stats.name}</p>
                <p className={`text-xs mt-1 ${getHealthcareTextColor(stats.healthcareIndex)}`}>
                  {filter === "all"
                    ? `Index: ${stats.healthcareIndex}/100`
                    : `${filter}: ${getFilteredValue(stats)}`}
                </p>
              </button>
            );
          })}
      </div>

      {/* Detail panel */}
      {currentStats && (
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-foreground">{currentStats.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Hospital} label="Hospitals" value={currentStats.hospitals.toLocaleString()} />
            <StatCard icon={Stethoscope} label="Doctors" value={currentStats.doctors.toLocaleString()} />
            <StatCard icon={Cloud} label="Climate" value={currentStats.climate} />
            <StatCard
              icon={AlertTriangle}
              label="Healthcare Index"
              value={`${currentStats.healthcareIndex}/100`}
              highlight
            />
          </div>
          {currentStats.healthAlerts.length > 0 && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-destructive mb-1">⚠ Health Alerts</p>
              <ul className="text-sm text-foreground space-y-1">
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

function StatCard({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-1">
      <Icon className={`h-5 w-5 ${highlight ? "text-primary" : "text-muted-foreground"}`} />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default Region;
