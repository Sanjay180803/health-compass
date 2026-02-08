import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { RegionStats } from "@/data/healthcareData";
import type { FilterType } from "./RegionFilterDropdown";

const FILTER_COLORS: Record<FilterType, string> = {
  healthcareIndex: "hsl(168, 60%, 38%)",
  hospitals: "hsl(200, 70%, 50%)",
  doctors: "hsl(280, 60%, 55%)",
  climate: "hsl(45, 80%, 55%)",
  alerts: "hsl(0, 65%, 50%)",
};

const FILTER_LABELS: Record<FilterType, string> = {
  healthcareIndex: "Healthcare Index",
  hospitals: "Hospitals",
  doctors: "Doctors",
  climate: "Climate",
  alerts: "Health Alerts",
};

function getNumericValue(stats: RegionStats, filter: FilterType): number {
  switch (filter) {
    case "hospitals":
      return stats.hospitals;
    case "doctors":
      return stats.doctors;
    case "healthcareIndex":
      return stats.healthcareIndex;
    case "alerts":
      return stats.healthAlerts.length;
    case "climate":
      return 0; // climate is textual, skip in bar chart
    default:
      return 0;
  }
}

interface RegionBarChartProps {
  states: Record<string, RegionStats>;
  filters: FilterType[];
}

const RegionBarChart = ({ states, filters }: RegionBarChartProps) => {
  // Exclude "climate" from bar chart since it's textual
  const numericFilters = filters.filter((f) => f !== "climate");

  if (numericFilters.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select numeric filters to see the comparison chart.
      </div>
    );
  }

  const data = Object.entries(states).map(([key, stats]) => {
    const row: Record<string, string | number> = { name: stats.name };
    numericFilters.forEach((f) => {
      row[f] = getNumericValue(stats, f);
    });
    return row;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          angle={-30}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
            fontSize: "0.8rem",
          }}
        />
        <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
        {numericFilters.map((f) => (
          <Bar
            key={f}
            dataKey={f}
            name={FILTER_LABELS[f]}
            fill={FILTER_COLORS[f]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RegionBarChart;
