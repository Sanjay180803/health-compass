import type { RegionStats } from "@/data/healthcareData";
import type { FilterType } from "@/components/region/RegionFilterDropdown";

/**
 * Color config per filter: hue & saturation for the HSL scale.
 */
const FILTER_COLOR_CONFIG: Record<FilterType, { hue: number; saturation: number }> = {
  healthcareIndex: { hue: 168, saturation: 60 },
  hospitals: { hue: 200, saturation: 70 },
  doctors: { hue: 280, saturation: 60 },
  alerts: { hue: 0, saturation: 65 },
  climate: { hue: 45, saturation: 80 },
};

/**
 * Returns an HSL color string on a filter-specific scale.
 * Lower severity → light/pale; higher severity → deep/dark.
 * `ratio` 0..1 where 1 = most severe.
 */
function filterShade(ratio: number, filter: FilterType): string {
  const { hue, saturation } = FILTER_COLOR_CONFIG[filter];
  const lightness = 85 - ratio * 50;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/**
 * Get a numeric value for a given filter to rank states by severity.
 */
function getFilterNumeric(stats: RegionStats, filter: FilterType): number {
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

/**
 * For a set of states and a primary filter, returns a map of state key → shade color.
 * Higher values get darker; lower values get lighter.
 * For "healthcareIndex", lower index = worse = darker (inverted).
 */
export function getRedShadeMap(
  states: Record<string, RegionStats>,
  filter: FilterType
): Record<string, string> {
  const entries = Object.entries(states);
  if (entries.length === 0) return {};

  const values = entries.map(([key, s]) => ({
    key,
    val: getFilterNumeric(s, filter),
  }));

  const min = Math.min(...values.map((v) => v.val));
  const max = Math.max(...values.map((v) => v.val));
  const range = max - min || 1;

  const result: Record<string, string> = {};
  values.forEach(({ key, val }) => {
    let ratio = (val - min) / range;

    // Healthcare index: lower index = worse = darker → invert
    if (filter === "healthcareIndex") {
      ratio = 1 - ratio;
    }
    // Hospitals & doctors: more = darker (min→max scale), no inversion
    // Alerts & climate: more = darker (severity scale), no inversion

    result[key] = filterShade(ratio, filter);
  });

  return result;
}

/**
 * Returns the gradient CSS string for the legend bar for a given filter.
 */
export function getFilterGradient(filter: FilterType): string {
  const { hue, saturation } = FILTER_COLOR_CONFIG[filter];
  return `linear-gradient(to right, hsl(${hue},${saturation}%,85%), hsl(${hue},${saturation}%,35%))`;
}
