/**
 * predictionService.js
 * Placeholder for the ML crop prediction API.
 * FUTURE: POST /api/predict
 */

const CROP_DATABASE = {
  loam: { spring: [{ name: "Maize", suit: 91 }, { name: "Soybean", suit: 85 }, { name: "Sunflower", suit: 76 }], summer: [{ name: "Rice", suit: 88 }, { name: "Jute", suit: 80 }, { name: "Sesame", suit: 73 }], rabi: [{ name: "Wheat", suit: 93 }, { name: "Mustard", suit: 84 }, { name: "Chickpea", suit: 78 }] },
  clay: { spring: [{ name: "Rice", suit: 90 }, { name: "Maize", suit: 78 }, { name: "Sugarcane", suit: 71 }], summer: [{ name: "Rice", suit: 92 }, { name: "Jute", suit: 85 }, { name: "Taro", suit: 70 }], rabi: [{ name: "Wheat", suit: 87 }, { name: "Barley", suit: 80 }, { name: "Lentil", suit: 73 }] },
  sandy: { spring: [{ name: "Groundnut", suit: 89 }, { name: "Watermelon", suit: 83 }, { name: "Cowpea", suit: 75 }], summer: [{ name: "Sesame", suit: 86 }, { name: "Mung Bean", suit: 79 }, { name: "Sorghum", suit: 71 }], rabi: [{ name: "Mustard", suit: 90 }, { name: "Garlic", suit: 82 }, { name: "Coriander", suit: 74 }] },
};

export async function predictCrops({ soilType = "loam", season = "rabi" } = {}) {
  // TODO: replace with real ML API: POST /api/predict
  const key = soilType.toLowerCase();
  const seasonKey = season.toLowerCase();
  const results = CROP_DATABASE[key]?.[seasonKey] || CROP_DATABASE.loam.rabi;
  return new Promise((resolve) =>
    setTimeout(() => resolve({ crops: results, simulated: true }), 2500)
  );
}
