import { useState, useEffect } from "react";

export type SpecializationData = Record<string, Record<string, number>>;

const cache: Record<string, SpecializationData> = {};

/**
 * Fetches and caches specialization breakdown JSON (hospitals or doctors per state).
 */
export function useSpecializationData(source: string | undefined) {
  const [data, setData] = useState<SpecializationData | null>(
    source ? cache[source] ?? null : null
  );
  const [loading, setLoading] = useState(!data && !!source);

  useEffect(() => {
    if (!source) return;
    if (cache[source]) {
      setData(cache[source]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(source)
      .then((res) => res.json())
      .then((json: SpecializationData) => {
        if (cancelled) return;
        cache[source] = json;
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
