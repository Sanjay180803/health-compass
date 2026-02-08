import { Hospital, Stethoscope, Cloud, AlertTriangle, X } from "lucide-react";
import type { RegionStats } from "@/data/healthcareData";
import { getHealthcareColor } from "@/data/healthcareData";

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

interface RegionInfoPanelProps {
  stats: RegionStats;
  onClose: () => void;
}

const RegionInfoPanel = ({ stats, onClose }: RegionInfoPanelProps) => {
  return (
    <div className="absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[400px] z-[1000] glass-panel rounded-2xl p-5 space-y-3 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${getHealthcareColor(stats.healthcareIndex)}`} />
          <h3 className="text-lg font-bold text-foreground">{stats.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <LegendItem icon={Hospital} label="Hospitals" value={stats.hospitals.toLocaleString()} />
        <LegendItem icon={Stethoscope} label="Doctors" value={stats.doctors.toLocaleString()} />
        <LegendItem icon={Cloud} label="Climate" value={stats.climate} />
        <LegendItem icon={AlertTriangle} label="Health Index" value={`${stats.healthcareIndex}/100`} />
      </div>

      {stats.healthAlerts.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <p className="text-xs font-semibold text-destructive mb-1">⚠ Health Alerts</p>
          <ul className="text-xs text-foreground space-y-0.5">
            {stats.healthAlerts.map((alert, i) => (
              <li key={i}>• {alert}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RegionInfoPanel;
