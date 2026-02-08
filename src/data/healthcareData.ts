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
  /** Path or URL to GeoJSON file */
  geojsonSource: string;
  /** Property key inside GeoJSON feature.properties that holds the state/region name */
  nameProperty: string;
}

export const countryMapConfigs: Record<string, CountryMapConfig> = {
  "United States": {
    center: [39.83, -98.58],
    zoom: 4,
    geojsonSource: "/geojson/us-states.json",
    nameProperty: "name",
  },
  India: {
    center: [20.59, 78.96],
    zoom: 5,
    geojsonSource: "/geojson/india-states.json",
    nameProperty: "st_nm",
  },
  "United Kingdom": {
    center: [54.0, -2.0],
    zoom: 6,
    geojsonSource: "/geojson/uk-countries.json",
    nameProperty: "NAME",
  },
};

export function detectCountryFromCoords(lat: number, lng: number): string {
  if (lat > 24 && lat < 50 && lng > -125 && lng < -66) return "United States";
  if (lat > 6 && lat < 36 && lng > 68 && lng < 97) return "India";
  if (lat > 49 && lat < 61 && lng > -11 && lng < 2) return "United Kingdom";
  return "United States";
}

// ─── All 50 US States ─────────────────────────────────────────────
const usStates: StateData = {
  Alabama: { name: "Alabama", hospitals: 98, doctors: 11000, climate: "Humid subtropical", healthAlerts: ["Heat advisory"], healthcareIndex: 55, lat: 32.32, lng: -86.90 },
  Alaska: { name: "Alaska", hospitals: 24, doctors: 2200, climate: "Subarctic / Oceanic", healthAlerts: ["Extreme cold"], healthcareIndex: 60, lat: 63.59, lng: -154.49 },
  Arizona: { name: "Arizona", hospitals: 77, doctors: 17000, climate: "Arid / Semi-arid", healthAlerts: ["Extreme heat warning"], healthcareIndex: 62, lat: 34.05, lng: -111.09 },
  Arkansas: { name: "Arkansas", hospitals: 84, doctors: 7500, climate: "Humid subtropical", healthAlerts: ["Tornado season"], healthcareIndex: 50, lat: 35.20, lng: -91.83 },
  California: { name: "California", hospitals: 418, doctors: 121000, climate: "Mediterranean / Arid", healthAlerts: ["Wildfire smoke advisory", "Heat wave precaution"], healthcareIndex: 78, lat: 36.78, lng: -119.42 },
  Colorado: { name: "Colorado", hospitals: 82, doctors: 16000, climate: "Semi-arid / Alpine", healthAlerts: ["Altitude sickness awareness"], healthcareIndex: 74, lat: 39.55, lng: -105.78 },
  Connecticut: { name: "Connecticut", hospitals: 32, doctors: 14000, climate: "Humid continental", healthAlerts: [], healthcareIndex: 82, lat: 41.60, lng: -72.76 },
  Delaware: { name: "Delaware", hospitals: 8, doctors: 3200, climate: "Humid subtropical", healthAlerts: [], healthcareIndex: 68, lat: 38.91, lng: -75.53 },
  Florida: { name: "Florida", hospitals: 310, doctors: 64000, climate: "Tropical / Subtropical", healthAlerts: ["Mosquito-borne illness warning", "UV index high"], healthcareIndex: 70, lat: 27.66, lng: -81.52 },
  Georgia: { name: "Georgia", hospitals: 155, doctors: 29000, climate: "Humid subtropical", healthAlerts: ["Pollen alert"], healthcareIndex: 62, lat: 32.16, lng: -82.90 },
  Hawaii: { name: "Hawaii", hospitals: 26, doctors: 4800, climate: "Tropical", healthAlerts: ["Volcanic smog advisory"], healthcareIndex: 76, lat: 19.90, lng: -155.58 },
  Idaho: { name: "Idaho", hospitals: 38, doctors: 4500, climate: "Semi-arid / Continental", healthAlerts: ["Wildfire smoke"], healthcareIndex: 58, lat: 44.07, lng: -114.74 },
  Illinois: { name: "Illinois", hospitals: 190, doctors: 42000, climate: "Humid continental", healthAlerts: ["Cold wave advisory"], healthcareIndex: 72, lat: 40.63, lng: -89.40 },
  Indiana: { name: "Indiana", hospitals: 125, doctors: 18000, climate: "Humid continental", healthAlerts: [], healthcareIndex: 60, lat: 40.27, lng: -86.13 },
  Iowa: { name: "Iowa", hospitals: 117, doctors: 8000, climate: "Humid continental", healthAlerts: ["Flood watch"], healthcareIndex: 64, lat: 41.88, lng: -93.10 },
  Kansas: { name: "Kansas", hospitals: 131, doctors: 7800, climate: "Semi-arid / Continental", healthAlerts: ["Tornado season"], healthcareIndex: 60, lat: 39.01, lng: -98.48 },
  Kentucky: { name: "Kentucky", hospitals: 96, doctors: 12000, climate: "Humid subtropical", healthAlerts: ["Opioid crisis"], healthcareIndex: 52, lat: 37.67, lng: -84.67 },
  Louisiana: { name: "Louisiana", hospitals: 130, doctors: 13000, climate: "Humid subtropical", healthAlerts: ["Hurricane season", "Mosquito advisory"], healthcareIndex: 48, lat: 30.98, lng: -91.96 },
  Maine: { name: "Maine", hospitals: 36, doctors: 4200, climate: "Humid continental", healthAlerts: ["Lyme disease warning"], healthcareIndex: 68, lat: 45.25, lng: -69.45 },
  Maryland: { name: "Maryland", hospitals: 48, doctors: 22000, climate: "Humid subtropical", healthAlerts: [], healthcareIndex: 76, lat: 39.05, lng: -76.64 },
  Massachusetts: { name: "Massachusetts", hospitals: 68, doctors: 38000, climate: "Humid continental", healthAlerts: [], healthcareIndex: 88, lat: 42.41, lng: -71.38 },
  Michigan: { name: "Michigan", hospitals: 138, doctors: 32000, climate: "Humid continental", healthAlerts: ["Cold advisory"], healthcareIndex: 66, lat: 44.31, lng: -85.60 },
  Minnesota: { name: "Minnesota", hospitals: 131, doctors: 19000, climate: "Humid continental", healthAlerts: [], healthcareIndex: 80, lat: 46.73, lng: -94.69 },
  Mississippi: { name: "Mississippi", hospitals: 83, doctors: 6500, climate: "Humid subtropical", healthAlerts: ["Obesity concern"], healthcareIndex: 42, lat: 32.35, lng: -89.40 },
  Missouri: { name: "Missouri", hospitals: 118, doctors: 17000, climate: "Humid continental / Subtropical", healthAlerts: ["Tornado season"], healthcareIndex: 58, lat: 37.96, lng: -91.83 },
  Montana: { name: "Montana", hospitals: 48, doctors: 3200, climate: "Continental / Semi-arid", healthAlerts: ["Wildfire smoke"], healthcareIndex: 56, lat: 46.88, lng: -110.36 },
  Nebraska: { name: "Nebraska", hospitals: 89, doctors: 5800, climate: "Semi-arid / Continental", healthAlerts: [], healthcareIndex: 64, lat: 41.49, lng: -99.90 },
  Nevada: { name: "Nevada", hospitals: 34, doctors: 7200, climate: "Arid / Semi-arid", healthAlerts: ["Extreme heat"], healthcareIndex: 52, lat: 38.80, lng: -116.42 },
  "New Hampshire": { name: "New Hampshire", hospitals: 26, doctors: 4600, climate: "Humid continental", healthAlerts: [], healthcareIndex: 76, lat: 43.19, lng: -71.57 },
  "New Jersey": { name: "New Jersey", hospitals: 72, doctors: 32000, climate: "Humid subtropical / Continental", healthAlerts: ["Air quality advisory"], healthcareIndex: 74, lat: 40.06, lng: -74.41 },
  "New Mexico": { name: "New Mexico", hospitals: 38, doctors: 5500, climate: "Arid / Semi-arid", healthAlerts: ["UV index high"], healthcareIndex: 50, lat: 34.52, lng: -105.87 },
  "New York": { name: "New York", hospitals: 214, doctors: 92000, climate: "Humid continental", healthAlerts: ["Flu season peak"], healthcareIndex: 82, lat: 42.16, lng: -74.95 },
  "North Carolina": { name: "North Carolina", hospitals: 120, doctors: 28000, climate: "Humid subtropical", healthAlerts: ["Hurricane season"], healthcareIndex: 66, lat: 35.76, lng: -79.02 },
  "North Dakota": { name: "North Dakota", hospitals: 42, doctors: 2200, climate: "Continental", healthAlerts: ["Extreme cold"], healthcareIndex: 62, lat: 47.55, lng: -100.34 },
  Ohio: { name: "Ohio", hospitals: 195, doctors: 38000, climate: "Humid continental", healthAlerts: ["Air quality moderate"], healthcareIndex: 68, lat: 40.42, lng: -82.91 },
  Oklahoma: { name: "Oklahoma", hospitals: 115, doctors: 8800, climate: "Humid subtropical / Semi-arid", healthAlerts: ["Tornado season"], healthcareIndex: 48, lat: 35.47, lng: -97.52 },
  Oregon: { name: "Oregon", hospitals: 60, doctors: 13000, climate: "Oceanic / Semi-arid", healthAlerts: ["Wildfire smoke"], healthcareIndex: 72, lat: 43.80, lng: -120.55 },
  Pennsylvania: { name: "Pennsylvania", hospitals: 220, doctors: 48000, climate: "Humid continental", healthAlerts: [], healthcareIndex: 74, lat: 41.20, lng: -77.19 },
  "Rhode Island": { name: "Rhode Island", hospitals: 12, doctors: 4800, climate: "Humid continental", healthAlerts: [], healthcareIndex: 78, lat: 41.58, lng: -71.48 },
  "South Carolina": { name: "South Carolina", hospitals: 65, doctors: 13000, climate: "Humid subtropical", healthAlerts: ["Hurricane season"], healthcareIndex: 56, lat: 33.84, lng: -81.16 },
  "South Dakota": { name: "South Dakota", hospitals: 50, doctors: 2600, climate: "Continental / Semi-arid", healthAlerts: [], healthcareIndex: 58, lat: 43.97, lng: -99.90 },
  Tennessee: { name: "Tennessee", hospitals: 120, doctors: 19000, climate: "Humid subtropical", healthAlerts: ["Opioid advisory"], healthcareIndex: 54, lat: 35.52, lng: -86.58 },
  Texas: { name: "Texas", hospitals: 606, doctors: 71000, climate: "Subtropical / Semi-arid", healthAlerts: ["Hurricane season alert"], healthcareIndex: 65, lat: 31.97, lng: -99.90 },
  Utah: { name: "Utah", hospitals: 49, doctors: 8200, climate: "Arid / Semi-arid", healthAlerts: ["Air quality winter inversion"], healthcareIndex: 70, lat: 39.32, lng: -111.09 },
  Vermont: { name: "Vermont", hospitals: 15, doctors: 2600, climate: "Humid continental", healthAlerts: [], healthcareIndex: 80, lat: 44.56, lng: -72.58 },
  Virginia: { name: "Virginia", hospitals: 90, doctors: 26000, climate: "Humid subtropical", healthAlerts: [], healthcareIndex: 72, lat: 37.43, lng: -78.66 },
  Washington: { name: "Washington", hospitals: 88, doctors: 24000, climate: "Oceanic / Semi-arid", healthAlerts: ["Wildfire smoke"], healthcareIndex: 76, lat: 47.75, lng: -120.74 },
  "West Virginia": { name: "West Virginia", hospitals: 55, doctors: 5000, climate: "Humid continental", healthAlerts: ["Opioid crisis"], healthcareIndex: 42, lat: 38.60, lng: -80.45 },
  Wisconsin: { name: "Wisconsin", hospitals: 122, doctors: 16000, climate: "Humid continental", healthAlerts: [], healthcareIndex: 72, lat: 43.78, lng: -88.79 },
  Wyoming: { name: "Wyoming", hospitals: 25, doctors: 1500, climate: "Semi-arid / Continental", healthAlerts: [], healthcareIndex: 54, lat: 43.08, lng: -107.29 },
};

// ─── Indian States & Union Territories ─────────────────────────
const indiaStates: StateData = {
  "Andhra Pradesh": { name: "Andhra Pradesh", hospitals: 2800, doctors: 42000, climate: "Tropical wet-and-dry", healthAlerts: ["Cyclone preparedness"], healthcareIndex: 60, lat: 15.91, lng: 79.74 },
  "Arunachal Pradesh": { name: "Arunachal Pradesh", hospitals: 180, doctors: 1200, climate: "Subtropical highland", healthAlerts: ["Malaria precaution"], healthcareIndex: 35, lat: 28.22, lng: 94.73 },
  Assam: { name: "Assam", hospitals: 1100, doctors: 8500, climate: "Subtropical monsoon", healthAlerts: ["Flood warning", "Japanese encephalitis"], healthcareIndex: 42, lat: 26.20, lng: 92.94 },
  Bihar: { name: "Bihar", hospitals: 1800, doctors: 15000, climate: "Humid subtropical", healthAlerts: ["Encephalitis alert", "Flood risk"], healthcareIndex: 32, lat: 25.10, lng: 85.31 },
  Chhattisgarh: { name: "Chhattisgarh", hospitals: 900, doctors: 7200, climate: "Tropical wet-and-dry", healthAlerts: ["Malaria endemic zone"], healthcareIndex: 40, lat: 21.28, lng: 81.87 },
  Goa: { name: "Goa", hospitals: 250, doctors: 3500, climate: "Tropical monsoon", healthAlerts: [], healthcareIndex: 72, lat: 15.30, lng: 74.12 },
  Gujarat: { name: "Gujarat", hospitals: 3200, doctors: 48000, climate: "Semi-arid / Arid", healthAlerts: ["Heat wave precaution"], healthcareIndex: 62, lat: 22.26, lng: 71.19 },
  Haryana: { name: "Haryana", hospitals: 1200, doctors: 15000, climate: "Semi-arid", healthAlerts: ["Air quality concern"], healthcareIndex: 58, lat: 29.06, lng: 76.09 },
  "Himachal Pradesh": { name: "Himachal Pradesh", hospitals: 600, doctors: 5500, climate: "Subtropical highland", healthAlerts: [], healthcareIndex: 68, lat: 31.10, lng: 77.17 },
  Jharkhand: { name: "Jharkhand", hospitals: 800, doctors: 6500, climate: "Tropical wet-and-dry", healthAlerts: ["Malaria advisory"], healthcareIndex: 38, lat: 23.61, lng: 85.28 },
  Karnataka: { name: "Karnataka", hospitals: 3800, doctors: 62000, climate: "Tropical", healthAlerts: ["Malaria precaution"], healthcareIndex: 68, lat: 15.32, lng: 75.71 },
  Kerala: { name: "Kerala", hospitals: 3200, doctors: 55000, climate: "Tropical", healthAlerts: ["Flood preparedness"], healthcareIndex: 85, lat: 10.85, lng: 76.27 },
  "Madhya Pradesh": { name: "Madhya Pradesh", hospitals: 2200, doctors: 22000, climate: "Tropical wet-and-dry", healthAlerts: ["Malaria endemic"], healthcareIndex: 42, lat: 22.97, lng: 78.66 },
  Maharashtra: { name: "Maharashtra", hospitals: 4200, doctors: 85000, climate: "Tropical monsoon", healthAlerts: ["Dengue precaution", "Monsoon water safety"], healthcareIndex: 65, lat: 19.75, lng: 75.71 },
  Manipur: { name: "Manipur", hospitals: 180, doctors: 1800, climate: "Subtropical", healthAlerts: ["HIV/AIDS awareness"], healthcareIndex: 40, lat: 24.66, lng: 93.91 },
  Meghalaya: { name: "Meghalaya", hospitals: 150, doctors: 1500, climate: "Subtropical highland", healthAlerts: ["Flood risk"], healthcareIndex: 42, lat: 25.47, lng: 91.37 },
  Mizoram: { name: "Mizoram", hospitals: 120, doctors: 800, climate: "Subtropical", healthAlerts: [], healthcareIndex: 48, lat: 23.16, lng: 92.94 },
  Nagaland: { name: "Nagaland", hospitals: 130, doctors: 900, climate: "Subtropical highland", healthAlerts: [], healthcareIndex: 38, lat: 26.16, lng: 94.56 },
  Odisha: { name: "Odisha", hospitals: 1600, doctors: 14000, climate: "Tropical wet-and-dry", healthAlerts: ["Cyclone preparedness"], healthcareIndex: 45, lat: 20.94, lng: 84.80 },
  Punjab: { name: "Punjab", hospitals: 1400, doctors: 18000, climate: "Semi-arid", healthAlerts: ["Stubble burning air quality"], healthcareIndex: 62, lat: 31.15, lng: 75.34 },
  Rajasthan: { name: "Rajasthan", hospitals: 2400, doctors: 28000, climate: "Arid / Semi-arid", healthAlerts: ["Heat stroke advisory", "Water scarcity"], healthcareIndex: 45, lat: 27.02, lng: 74.22 },
  Sikkim: { name: "Sikkim", hospitals: 60, doctors: 600, climate: "Subtropical highland", healthAlerts: [], healthcareIndex: 55, lat: 27.53, lng: 88.51 },
  "Tamil Nadu": { name: "Tamil Nadu", hospitals: 3500, doctors: 58000, climate: "Tropical wet", healthAlerts: [], healthcareIndex: 70, lat: 11.13, lng: 78.66 },
  Telangana: { name: "Telangana", hospitals: 2100, doctors: 35000, climate: "Tropical wet-and-dry", healthAlerts: ["Dengue advisory"], healthcareIndex: 64, lat: 18.11, lng: 79.02 },
  Tripura: { name: "Tripura", hospitals: 200, doctors: 1600, climate: "Tropical monsoon", healthAlerts: ["Malaria precaution"], healthcareIndex: 44, lat: 23.94, lng: 91.99 },
  "Uttar Pradesh": { name: "Uttar Pradesh", hospitals: 4800, doctors: 65000, climate: "Humid subtropical", healthAlerts: ["Encephalitis zone", "Air quality poor"], healthcareIndex: 38, lat: 26.85, lng: 80.91 },
  Uttarakhand: { name: "Uttarakhand", hospitals: 500, doctors: 5200, climate: "Subtropical / Alpine", healthAlerts: ["Flood risk"], healthcareIndex: 58, lat: 30.07, lng: 79.02 },
  "West Bengal": { name: "West Bengal", hospitals: 2800, doctors: 38000, climate: "Tropical wet-and-dry", healthAlerts: ["Cyclone season"], healthcareIndex: 58, lat: 22.99, lng: 87.85 },
  Delhi: { name: "Delhi", hospitals: 1100, doctors: 42000, climate: "Semi-arid", healthAlerts: ["Air quality severe", "Heat stroke advisory"], healthcareIndex: 72, lat: 28.70, lng: 77.10 },
  "Jammu and Kashmir": { name: "Jammu and Kashmir", hospitals: 600, doctors: 6800, climate: "Subtropical / Alpine", healthAlerts: [], healthcareIndex: 52, lat: 33.78, lng: 76.58 },
  Ladakh: { name: "Ladakh", hospitals: 30, doctors: 300, climate: "Cold desert", healthAlerts: ["Altitude sickness"], healthcareIndex: 30, lat: 34.15, lng: 77.58 },
  Puducherry: { name: "Puducherry", hospitals: 45, doctors: 2800, climate: "Tropical wet", healthAlerts: [], healthcareIndex: 70, lat: 11.94, lng: 79.83 },
  Chandigarh: { name: "Chandigarh", hospitals: 35, doctors: 3200, climate: "Semi-arid", healthAlerts: [], healthcareIndex: 75, lat: 30.73, lng: 76.78 },
  "Andaman and Nicobar Islands": { name: "Andaman and Nicobar Islands", hospitals: 20, doctors: 350, climate: "Tropical", healthAlerts: ["Cyclone season"], healthcareIndex: 48, lat: 11.74, lng: 92.66 },
  "Dadra and Nagar Haveli and Daman and Diu": { name: "Dadra and Nagar Haveli and Daman and Diu", hospitals: 25, doctors: 400, climate: "Tropical", healthAlerts: [], healthcareIndex: 50, lat: 20.40, lng: 72.83 },
  Lakshadweep: { name: "Lakshadweep", hospitals: 5, doctors: 80, climate: "Tropical", healthAlerts: [], healthcareIndex: 40, lat: 10.57, lng: 72.64 },
};

// ─── UK Countries ──────────────────────────────────────────────
const ukRegions: StateData = {
  England: { name: "England", hospitals: 1260, doctors: 165000, climate: "Oceanic", healthAlerts: ["Flu season"], healthcareIndex: 80, lat: 52.36, lng: -1.17 },
  Scotland: { name: "Scotland", hospitals: 230, doctors: 18000, climate: "Oceanic", healthAlerts: [], healthcareIndex: 78, lat: 56.49, lng: -4.20 },
  Wales: { name: "Wales", hospitals: 88, doctors: 8600, climate: "Oceanic", healthAlerts: [], healthcareIndex: 75, lat: 52.13, lng: -3.78 },
  "Northern Ireland": { name: "Northern Ireland", hospitals: 48, doctors: 5200, climate: "Oceanic", healthAlerts: [], healthcareIndex: 74, lat: 54.79, lng: -6.49 },
};

export const regionData: CountryData = {
  "United States": usStates,
  India: indiaStates,
  "United Kingdom": ukRegions,
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
