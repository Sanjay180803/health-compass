import { useState } from "react";
import { Globe, Hospital, Stethoscope, Heart, AlertTriangle } from "lucide-react";
import { continentData, getHealthcareColor, type ContinentData } from "@/data/healthcareData";

const World = () => {
  const [selected, setSelected] = useState<ContinentData | null>(null);

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">World Healthcare Overview</h1>
        <p className="text-muted-foreground text-sm">Click a continent to explore its healthcare statistics</p>
      </div>

      {/* Continent cards - color coded */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.values(continentData).map((continent) => {
          const isSelected = selected?.name === continent.name;
          return (
            <button
              key={continent.name}
              onClick={() => setSelected(continent)}
              className={`relative overflow-hidden rounded-xl border p-5 text-left transition-all hover:shadow-lg ${
                isSelected
                  ? "border-primary shadow-lg scale-[1.02]"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className={`absolute inset-0 opacity-10 ${getHealthcareColor(continent.healthcareIndex)}`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <div className={`h-4 w-4 rounded-full ${getHealthcareColor(continent.healthcareIndex)}`} />
                </div>
                <p className="font-bold text-foreground">{continent.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Healthcare Index: {continent.healthcareIndex}/100
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-healthcare-excellent" /> Excellent (80+)</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-healthcare-good" /> Good (60-79)</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-healthcare-moderate" /> Moderate (40-59)</span>
        <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-healthcare-poor" /> Poor (&lt;40)</span>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <InfoCard icon={Hospital} label="Total Hospitals" value={selected.totalHospitals} />
            <InfoCard icon={Stethoscope} label="Total Doctors" value={selected.totalDoctors} />
            <InfoCard icon={Heart} label="Life Expectancy" value={`${selected.lifeExpectancy} yrs`} />
            <InfoCard icon={AlertTriangle} label="Healthcare Index" value={`${selected.healthcareIndex}/100`} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">Top Health Concerns</p>
            <div className="flex flex-wrap gap-2">
              {selected.topConcerns.map((concern) => (
                <span key={concern} className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full">
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

function InfoCard({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-1">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default World;
