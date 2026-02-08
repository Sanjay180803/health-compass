import { useState, memo } from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { Hospital, Stethoscope, Heart, AlertTriangle, X } from "lucide-react";
import { continentData, getHealthcareFillColor, type ContinentData } from "@/data/healthcareData";
import { getContinent } from "@/data/continentMapping";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const World = () => {
  const [selected, setSelected] = useState<ContinentData | null>(null);

  return (
    <div className="relative" style={{ height: "calc(100vh - 56px)" }}>
      {/* ─── World map ─────────────────────────────────────────── */}
      <ComposableMap
        projectionConfig={{ rotate: [-10, 0, 0], scale: 160 }}
        className="h-full w-full"
        style={{ background: "hsl(200, 30%, 94%)" }}
      >
        <ZoomableGroup>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <CountryShape
                  key={geo.rsmKey}
                  geo={geo}
                  onSelect={setSelected}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      {/* ─── Color legend (top-left) ───────────────────────────── */}
      <div className="absolute top-4 left-4 z-10 glass-panel rounded-xl p-3 space-y-1.5">
        <p className="text-xs font-semibold text-foreground mb-1">WHO Healthcare Index</p>
        <LegendRow color="hsl(168, 70%, 40%)" label="Excellent (80+)" />
        <LegendRow color="hsl(142, 60%, 45%)" label="Good (60–79)" />
        <LegendRow color="hsl(45, 80%, 55%)" label="Moderate (40–59)" />
        <LegendRow color="hsl(0, 65%, 50%)" label="Poor (<40)" />
      </div>

      {/* ─── Translucent continent info panel (bottom-right) ──── */}
      {selected && (
        <div className="absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[400px] z-10 glass-panel rounded-2xl p-5 space-y-3 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">{selected.name}</h3>
            <button
              onClick={() => setSelected(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoItem icon={Hospital} label="Total Hospitals" value={selected.totalHospitals} />
            <InfoItem icon={Stethoscope} label="Total Doctors" value={selected.totalDoctors} />
            <InfoItem icon={Heart} label="Life Expectancy" value={`${selected.lifeExpectancy} yrs`} />
            <InfoItem icon={AlertTriangle} label="Healthcare Index" value={`${selected.healthcareIndex}/100`} />
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground mb-1.5">Top Health Concerns</p>
            <div className="flex flex-wrap gap-1.5">
              {selected.topConcerns.map((concern) => (
                <span
                  key={concern}
                  className="bg-secondary text-secondary-foreground text-xs px-2.5 py-0.5 rounded-full"
                >
                  {concern}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** Memoised country shape for performance */
const CountryShape = memo(
  ({ geo, onSelect }: { geo: any; onSelect: (c: ContinentData) => void }) => {
    const countryName = geo.properties?.name || geo.properties?.NAME || "";
    const continent = getContinent(countryName);
    const continentInfo = continent ? continentData[continent] : null;
    const fillColor = continentInfo
      ? getHealthcareFillColor(continentInfo.healthcareIndex)
      : "hsl(0, 0%, 85%)";

    return (
      <Geography
        geography={geo}
        fill={fillColor}
        stroke="hsl(0, 0%, 100%)"
        strokeWidth={0.5}
        onClick={() => {
          if (continentInfo) onSelect(continentInfo);
        }}
        style={{
          default: { outline: "none", transition: "opacity 0.2s" },
          hover: { outline: "none", opacity: 0.75, cursor: "pointer" },
          pressed: { outline: "none" },
        }}
      />
    );
  },
);
CountryShape.displayName = "CountryShape";

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
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

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export default World;
