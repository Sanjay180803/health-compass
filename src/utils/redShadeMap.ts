import type { RegionStats } from "@/data/healthcareData";
import type { FilterType } from "@/components/region/RegionFilterDropdown";

/**
 * Returns an HSL color string on a red scale.
 * Lower severity → light/pale red; higher severity → deep/dark red.
 * `ratio` 0..1 where 1 = most severe.
 */
function redShade(ratio: number): string {
  // Lightness goes from 85% (least severe) to 35% (most severe)
  const lightness = 85 - ratio * 50;
  return `hsl(0, 70%, ${lightness}%)`;
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
 * For a set of states and a primary filter, returns a map of state key → red shade color.
 * Higher values get darker red; lower values get lighter red.
 * For "healthcareIndex", lower index = worse = darker red (inverted).
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

    // For healthcareIndex, invert: lower index = more severe
    if (filter === "healthcareIndex") {
      ratio = 1 - ratio;
    }
    // For alerts, more alerts = more severe (keep as is)
    // For hospitals/doctors, fewer = more severe → invert
    if (filter === "hospitals" || filter === "doctors") {
      ratio = 1 - ratio;
    }

    result[key] = redShade(ratio);
  });

  return result;
}
