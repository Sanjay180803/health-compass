import { useMemo } from "react";
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

function getRawValue(stats: RegionStats, filter: FilterType): number {
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
      return 0;
    default:
      return 0;
  }
}

interface RegionBarChartProps {
  states: Record<string, RegionStats>;
  filters: FilterType[];
}

const RegionBarChart = ({ states, filters }: RegionBarChartProps) => {
  const numericFilters = filters.filter((f) => f !== "climate");

  const { data, rawLookup } = useMemo(() => {
    if (numericFilters.length === 0) return { data: [], rawLookup: {} as Record<string, Record<string, number>> };

    const entries = Object.entries(states);

    // Compute min/max per filter for normalization to 0-100
    const ranges: Record<string, { min: number; max: number }> = {};
    numericFilters.forEach((f) => {
      const vals = entries.map(([, s]) => getRawValue(s, f));
      ranges[f] = { min: Math.min(...vals), max: Math.max(...vals) };
    });

    const normalize = (val: number, f: string) => {
      const { min, max } = ranges[f];
      if (max === min) return 50;
      return Math.round(((val - min) / (max - min)) * 100);
    };

    // Build rows with normalized values, compute composite score for ranking
    const rows = entries.map(([key, stats]) => {
      const row: Record<string, string | number> = { name: stats.name };
      const rawRow: Record<string, number> = {};
      let total = 0;
      numericFilters.forEach((f) => {
        const raw = getRawValue(stats, f);
        rawRow[f] = raw;
        const norm = normalize(raw, f);
        row[f] = norm;
        total += norm;
      });
      return { row, rawRow, total };
    });

    // Sort by composite score descending, take top 10
    rows.sort((a, b) => b.total - a.total);
    const top = rows.slice(0, 10);

    const lookup: Record<string, Record<string, number>> = {};
    top.forEach(({ row, rawRow }) => {
      lookup[row.name as string] = rawRow;
    });

    return { data: top.map((r) => r.row), rawLookup: lookup };
  }, [states, numericFilters]);

  if (numericFilters.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select numeric filters to see the comparison chart.
      </div>
    );
  }

  // Custom tooltip to show both normalized and raw values
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        style={{
          backgroundColor: "hsl(var(--card))",
          border: "1px solid hsl(var(--border))",
          borderRadius: "0.5rem",
          padding: "8px 12px",
          fontSize: "0.8rem",
        }}
      >
        <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
        {payload.map((entry: any) => {
          const raw = rawLookup[label]?.[entry.dataKey];
          return (
            <p key={entry.dataKey} style={{ color: entry.fill, margin: "2px 0" }}>
              {entry.name}: {entry.value}% {raw != null ? `(${raw.toLocaleString()})` : ""}
            </p>
          );
        })}
      </div>
    );
  };

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
        <YAxis
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          domain={[0, 100]}
          label={{
            value: "Normalized %",
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 10, fill: "hsl(var(--muted-foreground))" },
          }}
        />
        <Tooltip content={<CustomTooltip />} />
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
