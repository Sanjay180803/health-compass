import { useState, useEffect } from "react";

const geojsonCache: Record<string, any> = {};

/**
 * Fetches and caches a GeoJSON file from a local path or remote URL.
 */
export function useGeoJSON(source: string | undefined) {
  const [data, setData] = useState<any>(source ? geojsonCache[source] ?? null : null);
  const [loading, setLoading] = useState(!data && !!source);

  useEffect(() => {
    if (!source) return;
    if (geojsonCache[source]) {
      setData(geojsonCache[source]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(source)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        geojsonCache[source] = json;
        setData(json);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [source]);

  return { data, loading };
}
