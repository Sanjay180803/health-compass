import { useState, useCallback } from "react";

const STORAGE_KEY = "healthscope_location";

interface StoredLocation {
  lat: number;
  lng: number;
  granted: boolean;
}

function loadStored(): StoredLocation | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredLocation;
  } catch {
    return null;
  }
}

export function usePersistedLocation() {
  const stored = loadStored();

  const [locationGranted, setLocationGranted] = useState(stored?.granted ?? false);
  const [userLat, setUserLat] = useState(stored?.lat ?? 39.83);
  const [userLng, setUserLng] = useState(stored?.lng ?? -98.58);
  const [requesting, setRequesting] = useState(false);

  const requestLocation = useCallback(() => {
    setRequesting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLat(latitude);
          setUserLng(longitude);
          setLocationGranted(true);
          setRequesting(false);
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ lat: latitude, lng: longitude, granted: true })
          );
        },
        () => {
          // Permission denied – still mark as granted so we show the default map
          setLocationGranted(true);
          setRequesting(false);
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ lat: 39.83, lng: -98.58, granted: true })
          );
        }
      );
    } else {
      setLocationGranted(true);
      setRequesting(false);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ lat: 39.83, lng: -98.58, granted: true })
      );
    }
  }, []);

  return { locationGranted, requesting, userLat, userLng, requestLocation };
}
