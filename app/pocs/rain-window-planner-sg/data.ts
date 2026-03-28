export type AreaInfo = {
  name: string;
  latitude: number;
  longitude: number;
};

export const PICKER_AREAS: AreaInfo[] = [
  { name: "Ang Mo Kio", latitude: 1.375, longitude: 103.839 },
  { name: "Bedok", latitude: 1.321, longitude: 103.93 },
  { name: "Jurong West", latitude: 1.34, longitude: 103.705 },
  { name: "Toa Payoh", latitude: 1.332, longitude: 103.847 },
  { name: "Queenstown", latitude: 1.29, longitude: 103.806 },
  { name: "Tampines", latitude: 1.345, longitude: 103.944 },
  { name: "Woodlands", latitude: 1.436, longitude: 103.786 },
  { name: "Clementi", latitude: 1.315, longitude: 103.765 },
];

export type WeatherTone = "heavy" | "light" | "cloudy" | "clear";

export type ForecastIntensity = {
  tone: WeatherTone;
  rainLevel: number; // 0–1, drives animation speed/opacity
  recommendation: string;
  bgFrom: string;
  bgTo: string;
  textColor: string;
};

export function getForecastIntensity(forecast: string): ForecastIntensity {
  const f = forecast.toLowerCase();

  if (f.includes("heavy thundery") || f.includes("thundery")) {
    return {
      tone: "heavy",
      rainLevel: 1,
      recommendation: "Best to wait — rain likely for the next hour or so.",
      bgFrom: "#1e3a5f",
      bgTo: "#2d4a6e",
      textColor: "#c8ddf5",
    };
  }
  if (f.includes("moderate rain")) {
    return {
      tone: "heavy",
      rainLevel: 0.8,
      recommendation: "Best to wait — rain likely for the next hour or so.",
      bgFrom: "#1e3a5f",
      bgTo: "#2d4a6e",
      textColor: "#c8ddf5",
    };
  }
  if (f.includes("light rain") || f.includes("light showers") || f.includes("passing showers")) {
    return {
      tone: "light",
      rainLevel: 0.45,
      recommendation: "You might catch a break soon. Bring an umbrella.",
      bgFrom: "#3a5068",
      bgTo: "#4a6278",
      textColor: "#b8d0e8",
    };
  }
  if (f.includes("partly cloudy") || f.includes("cloudy") || f.includes("windy")) {
    return {
      tone: "cloudy",
      rainLevel: 0,
      recommendation: "Looks manageable. Good time to head out.",
      bgFrom: "#5a6472",
      bgTo: "#6b7885",
      textColor: "#dde4ea",
    };
  }
  // fair, fair & warm, or anything else clear
  return {
    tone: "clear",
    rainLevel: 0,
    recommendation: "Clear window — go now.",
    bgFrom: "#fef3c7",
    bgTo: "#fde68a",
    textColor: "#78530a",
  };
}

/** Haversine distance in km between two lat/lng points */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
