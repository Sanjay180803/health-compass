export interface RegionStats {
  name: string;
  hospitals: number;
  doctors: number;
  climate: string;
  healthAlerts: string[];
  healthcareIndex: number; // 0-100
}

export interface StateData {
  [state: string]: RegionStats;
}

export interface CountryData {
  [country: string]: StateData;
}

export const regionData: CountryData = {
  "United States": {
    "California": { name: "California", hospitals: 418, doctors: 121000, climate: "Mediterranean / Arid", healthAlerts: ["Wildfire smoke advisory", "Heat wave precaution"], healthcareIndex: 78 },
    "Texas": { name: "Texas", hospitals: 606, doctors: 71000, climate: "Subtropical / Semi-arid", healthAlerts: ["Hurricane season alert"], healthcareIndex: 65 },
    "New York": { name: "New York", hospitals: 214, doctors: 92000, climate: "Humid continental", healthAlerts: ["Flu season peak"], healthcareIndex: 82 },
    "Florida": { name: "Florida", hospitals: 310, doctors: 64000, climate: "Tropical / Subtropical", healthAlerts: ["Mosquito-borne illness warning", "UV index high"], healthcareIndex: 70 },
    "Illinois": { name: "Illinois", hospitals: 190, doctors: 42000, climate: "Humid continental", healthAlerts: ["Cold wave advisory"], healthcareIndex: 72 },
    "Pennsylvania": { name: "Pennsylvania", hospitals: 220, doctors: 48000, climate: "Humid continental", healthAlerts: [], healthcareIndex: 74 },
    "Ohio": { name: "Ohio", hospitals: 195, doctors: 38000, climate: "Humid continental", healthAlerts: ["Air quality moderate"], healthcareIndex: 68 },
    "Georgia": { name: "Georgia", hospitals: 155, doctors: 29000, climate: "Humid subtropical", healthAlerts: ["Pollen alert"], healthcareIndex: 62 },
  },
  India: {
    "Maharashtra": { name: "Maharashtra", hospitals: 4200, doctors: 85000, climate: "Tropical monsoon", healthAlerts: ["Dengue precaution", "Monsoon water safety"], healthcareIndex: 65 },
    "Delhi": { name: "Delhi", hospitals: 1100, doctors: 42000, climate: "Semi-arid", healthAlerts: ["Air quality severe", "Heat stroke advisory"], healthcareIndex: 72 },
    "Karnataka": { name: "Karnataka", hospitals: 3800, doctors: 62000, climate: "Tropical", healthAlerts: ["Malaria precaution"], healthcareIndex: 68 },
    "Tamil Nadu": { name: "Tamil Nadu", hospitals: 3500, doctors: 58000, climate: "Tropical wet", healthAlerts: [], healthcareIndex: 70 },
    "Kerala": { name: "Kerala", hospitals: 3200, doctors: 55000, climate: "Tropical", healthAlerts: ["Flood preparedness"], healthcareIndex: 85 },
    "West Bengal": { name: "West Bengal", hospitals: 2800, doctors: 38000, climate: "Tropical wet-and-dry", healthAlerts: ["Cyclone season"], healthcareIndex: 58 },
  },
  "United Kingdom": {
    "England": { name: "England", hospitals: 1260, doctors: 165000, climate: "Oceanic", healthAlerts: ["Flu season"], healthcareIndex: 80 },
    "Scotland": { name: "Scotland", hospitals: 230, doctors: 18000, climate: "Oceanic", healthAlerts: [], healthcareIndex: 78 },
    "Wales": { name: "Wales", hospitals: 88, doctors: 8600, climate: "Oceanic", healthAlerts: [], healthcareIndex: 75 },
    "Northern Ireland": { name: "Northern Ireland", hospitals: 48, doctors: 5200, climate: "Oceanic", healthAlerts: [], healthcareIndex: 74 },
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
  "Europe": { name: "Europe", healthcareIndex: 85, totalHospitals: "~15,000", totalDoctors: "~1.8M", lifeExpectancy: 81.3, topConcerns: ["Aging population", "Antibiotic resistance"], color: "healthcare-good" },
  "Asia": { name: "Asia", healthcareIndex: 58, totalHospitals: "~65,000", totalDoctors: "~4.5M", lifeExpectancy: 74.2, topConcerns: ["Air pollution", "Infectious diseases", "Access disparity"], color: "healthcare-moderate" },
  "Africa": { name: "Africa", healthcareIndex: 32, totalHospitals: "~7,500", totalDoctors: "~300K", lifeExpectancy: 63.5, topConcerns: ["Malaria", "HIV/AIDS", "Infrastructure shortage"], color: "healthcare-poor" },
  "South America": { name: "South America", healthcareIndex: 62, totalHospitals: "~12,000", totalDoctors: "~800K", lifeExpectancy: 75.8, topConcerns: ["Dengue", "Zika", "Rural access"], color: "healthcare-moderate" },
  "Oceania": { name: "Oceania", healthcareIndex: 82, totalHospitals: "~1,400", totalDoctors: "~110K", lifeExpectancy: 82.1, topConcerns: ["Remote access", "Indigenous health gap"], color: "healthcare-good" },
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
