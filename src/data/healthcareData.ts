export interface RegionStats {
  name: string;
  hospitals: number;
  doctors: number;
  climate: string;
  healthAlerts: string[];
  healthcareIndex: number;
  lat: number;
  lng: number;
}

export interface StateData {
  [state: string]: RegionStats;
}

export interface CountryData {
  [country: string]: StateData;
}

export interface CountryMapConfig {
  center: [number, number];
  zoom: number;
}

export const countryMapConfigs: Record<string, CountryMapConfig> = {
  "United States": { center: [39.83, -98.58], zoom: 4 },
  India: { center: [20.59, 78.96], zoom: 5 },
  "United Kingdom": { center: [54.0, -2.0], zoom: 6 },
};

export function detectCountryFromCoords(lat: number, lng: number): string {
  if (lat > 24 && lat < 50 && lng > -125 && lng < -66) return "United States";
  if (lat > 6 && lat < 36 && lng > 68 && lng < 97) return "India";
  if (lat > 49 && lat < 61 && lng > -11 && lng < 2) return "United Kingdom";
  return "United States";
}

export const regionData: CountryData = {
  "United States": {
    California: { name: "California", hospitals: 418, doctors: 121000, climate: "Mediterranean / Arid", healthAlerts: ["Wildfire smoke advisory", "Heat wave precaution"], healthcareIndex: 78, lat: 36.78, lng: -119.42 },
    Texas: { name: "Texas", hospitals: 606, doctors: 71000, climate: "Subtropical / Semi-arid", healthAlerts: ["Hurricane season alert"], healthcareIndex: 65, lat: 31.97, lng: -99.90 },
    "New York": { name: "New York", hospitals: 214, doctors: 92000, climate: "Humid continental", healthAlerts: ["Flu season peak"], healthcareIndex: 82, lat: 42.16, lng: -74.95 },
    Florida: { name: "Florida", hospitals: 310, doctors: 64000, climate: "Tropical / Subtropical", healthAlerts: ["Mosquito-borne illness warning", "UV index high"], healthcareIndex: 70, lat: 27.66, lng: -81.52 },
    Illinois: { name: "Illinois", hospitals: 190, doctors: 42000, climate: "Humid continental", healthAlerts: ["Cold wave advisory"], healthcareIndex: 72, lat: 40.63, lng: -89.40 },
    Pennsylvania: { name: "Pennsylvania", hospitals: 220, doctors: 48000, climate: "Humid continental", healthAlerts: [], healthcareIndex: 74, lat: 41.20, lng: -77.19 },
    Ohio: { name: "Ohio", hospitals: 195, doctors: 38000, climate: "Humid continental", healthAlerts: ["Air quality moderate"], healthcareIndex: 68, lat: 40.42, lng: -82.91 },
    Georgia: { name: "Georgia", hospitals: 155, doctors: 29000, climate: "Humid subtropical", healthAlerts: ["Pollen alert"], healthcareIndex: 62, lat: 32.16, lng: -82.90 },
  },
  India: {
    Maharashtra: { name: "Maharashtra", hospitals: 4200, doctors: 85000, climate: "Tropical monsoon", healthAlerts: ["Dengue precaution", "Monsoon water safety"], healthcareIndex: 65, lat: 19.75, lng: 75.71 },
    Delhi: { name: "Delhi", hospitals: 1100, doctors: 42000, climate: "Semi-arid", healthAlerts: ["Air quality severe", "Heat stroke advisory"], healthcareIndex: 72, lat: 28.70, lng: 77.10 },
    Karnataka: { name: "Karnataka", hospitals: 3800, doctors: 62000, climate: "Tropical", healthAlerts: ["Malaria precaution"], healthcareIndex: 68, lat: 15.32, lng: 75.71 },
    "Tamil Nadu": { name: "Tamil Nadu", hospitals: 3500, doctors: 58000, climate: "Tropical wet", healthAlerts: [], healthcareIndex: 70, lat: 11.13, lng: 78.66 },
    Kerala: { name: "Kerala", hospitals: 3200, doctors: 55000, climate: "Tropical", healthAlerts: ["Flood preparedness"], healthcareIndex: 85, lat: 10.85, lng: 76.27 },
    "West Bengal": { name: "West Bengal", hospitals: 2800, doctors: 38000, climate: "Tropical wet-and-dry", healthAlerts: ["Cyclone season"], healthcareIndex: 58, lat: 22.99, lng: 87.85 },
  },
  "United Kingdom": {
    England: { name: "England", hospitals: 1260, doctors: 165000, climate: "Oceanic", healthAlerts: ["Flu season"], healthcareIndex: 80, lat: 52.36, lng: -1.17 },
    Scotland: { name: "Scotland", hospitals: 230, doctors: 18000, climate: "Oceanic", healthAlerts: [], healthcareIndex: 78, lat: 56.49, lng: -4.20 },
    Wales: { name: "Wales", hospitals: 88, doctors: 8600, climate: "Oceanic", healthAlerts: [], healthcareIndex: 75, lat: 52.13, lng: -3.78 },
    "Northern Ireland": { name: "Northern Ireland", hospitals: 48, doctors: 5200, climate: "Oceanic", healthAlerts: [], healthcareIndex: 74, lat: 54.79, lng: -6.49 },
  },
};

export interface ContinentData {
  name: string;
  healthcareIndex: number;
  totalHospitals: string;
  totalDoctors: string;
  lifeExpectancy: number;
  topConcerns: string[];
  color: string;
}

export const continentData: Record<string, ContinentData> = {
  "North America": { name: "North America", healthcareIndex: 78, totalHospitals: "~7,400", totalDoctors: "~1.1M", lifeExpectancy: 78.5, topConcerns: ["Obesity", "Opioid crisis", "Mental health"], color: "healthcare-excellent" },
  Europe: { name: "Europe", healthcareIndex: 85, totalHospitals: "~15,000", totalDoctors: "~1.8M", lifeExpectancy: 81.3, topConcerns: ["Aging population", "Antibiotic resistance"], color: "healthcare-good" },
  Asia: { name: "Asia", healthcareIndex: 58, totalHospitals: "~65,000", totalDoctors: "~4.5M", lifeExpectancy: 74.2, topConcerns: ["Air pollution", "Infectious diseases", "Access disparity"], color: "healthcare-moderate" },
  Africa: { name: "Africa", healthcareIndex: 32, totalHospitals: "~7,500", totalDoctors: "~300K", lifeExpectancy: 63.5, topConcerns: ["Malaria", "HIV/AIDS", "Infrastructure shortage"], color: "healthcare-poor" },
  "South America": { name: "South America", healthcareIndex: 62, totalHospitals: "~12,000", totalDoctors: "~800K", lifeExpectancy: 75.8, topConcerns: ["Dengue", "Zika", "Rural access"], color: "healthcare-moderate" },
  Oceania: { name: "Oceania", healthcareIndex: 82, totalHospitals: "~1,400", totalDoctors: "~110K", lifeExpectancy: 82.1, topConcerns: ["Remote access", "Indigenous health gap"], color: "healthcare-good" },
};

export function getHealthcareColor(index: number): string {
  if (index >= 80) return "bg-healthcare-excellent";
  if (index >= 60) return "bg-healthcare-good";
  if (index >= 40) return "bg-healthcare-moderate";
  return "bg-healthcare-poor";
}

export function getHealthcareTextColor(index: number): string {
  if (index >= 80) return "text-healthcare-excellent";
  if (index >= 60) return "text-healthcare-good";
  if (index >= 40) return "text-healthcare-moderate";
  return "text-healthcare-poor";
}

export function getHealthcareFillColor(index: number): string {
  if (index >= 80) return "hsl(168, 70%, 40%)";
  if (index >= 60) return "hsl(142, 60%, 45%)";
  if (index >= 40) return "hsl(45, 80%, 55%)";
  return "hsl(0, 65%, 50%)";
}
