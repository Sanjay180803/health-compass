import { Hospital, Stethoscope, Cloud, AlertTriangle, X } from "lucide-react";
import type { RegionStats } from "@/data/healthcareData";
import { getHealthcareColor } from "@/data/healthcareData";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { FilterType } from "./RegionFilterDropdown";

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

function SpecializationTable({
  title,
  icon: Icon,
  data,
}: {
  title: string;
  icon: any;
  data: Record<string, number>;
}) {
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((sum, [, v]) => sum + v, 0);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold text-foreground">
          {title} — Total: {total.toLocaleString()}
        </p>
      </div>
      <ScrollArea className="h-36 rounded-md border border-border">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-border bg-muted">
              <th className="text-left px-2 py-1 font-medium text-muted-foreground bg-muted">Specialization</th>
              <th className="text-right px-2 py-1 font-medium text-muted-foreground bg-muted">Count</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(([spec, count]) => (
              <tr key={spec} className="border-b border-border/50 hover:bg-muted/30">
                <td className="px-2 py-1 text-foreground">{spec}</td>
                <td className="px-2 py-1 text-right font-medium text-foreground">
                  {count.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}

interface RegionInfoPanelProps {
  stats: RegionStats;
  onClose: () => void;
  activeFilters: FilterType[];
  hospitalSpecializations?: Record<string, number> | null;
  doctorSpecializations?: Record<string, number> | null;
}

const RegionInfoPanel = ({
  stats,
  onClose,
  activeFilters,
  hospitalSpecializations,
  doctorSpecializations,
}: RegionInfoPanelProps) => {
  const showHospitalBreakdown =
    activeFilters.includes("hospitals") && hospitalSpecializations;
  const showDoctorBreakdown =
    activeFilters.includes("doctors") && doctorSpecializations;

  const totalHospitals = hospitalSpecializations
    ? Object.values(hospitalSpecializations).reduce((sum, v) => sum + v, 0)
    : stats.hospitals;
  const totalDoctors = doctorSpecializations
    ? Object.values(doctorSpecializations).reduce((sum, v) => sum + v, 0)
    : stats.doctors;

  return (
    <div className="absolute bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-[420px] z-[1000] glass-panel rounded-2xl p-5 space-y-3 animate-in slide-in-from-bottom-4 duration-300 max-h-[70vh] overflow-y-auto">
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
        <LegendItem icon={Hospital} label="Hospitals" value={totalHospitals.toLocaleString()} />
        <LegendItem icon={Stethoscope} label="Doctors" value={totalDoctors.toLocaleString()} />
        <LegendItem icon={Cloud} label="Climate" value={stats.climate} />
        <LegendItem icon={AlertTriangle} label="Health Index" value={`${stats.healthcareIndex}/100`} />
      </div>

      {showHospitalBreakdown && (
        <SpecializationTable
          title="Hospitals by Specialization"
          icon={Hospital}
          data={hospitalSpecializations}
        />
      )}

      {showDoctorBreakdown && (
        <SpecializationTable
          title="Doctors by Specialization"
          icon={Stethoscope}
          data={doctorSpecializations}
        />
      )}

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
