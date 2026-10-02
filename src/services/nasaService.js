/**
 * nasaService.js
 * Placeholder service for NASA API integrations.
 * FUTURE: NASA POWER, Earthdata, MODIS, Landsat, SMAP
 */
export const SIMULATED_DATA = {
  location: "Bogura, Bangladesh",
  coordinates: { lat: 24.851, lon: 89.37 },
  temperature: 32,
  rainfall: 120,
  soilMoisture: 45,
  ndvi: 0.82,
  vegetationHealth: "Healthy",
  lastUpdated: new Date().toISOString(),
};

export async function fetchNasaData() {
  // TODO: replace with real NASA POWER API call
  return new Promise((resolve) => setTimeout(() => resolve(SIMULATED_DATA), 800));
}
