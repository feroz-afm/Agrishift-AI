// Bangladesh crop knowledge base. Values are typical agronomic ranges (FAO-56 crop coefficients,
// FAO Ecocrop temperature limits, BRRI/BARI crop calendars), simplified for planning.
// They are a starting point, not variety advice — confirm with the local Upazila agriculture office.
//
// seasons  where the crop is sown: k2 = Kharif-2 (Aman, Jul–Oct) · rabi = Rabi (Nov–Feb) · k1 = Kharif-1 (Mar–Jun)
// shift    months the crop starts after its season begins (Boro is transplanted in Jan)
// fam      botanical family (rotating families breaks pest and disease cycles)
// days     field duration (after transplanting for rice)
// t        [min, max] mean monthly temperature for good growth
// heat     daily max temperature (°C) that damages the crop at flowering / grain fill
// cold     daily min temperature (°C) that damages the crop (cold injury)
// kc       season-average crop coefficient (FAO-56)
// root     1 shallow · 2 medium · 3 deep          drought / waterlog / salt  tolerance 1–3
// ph       [min, max] soil pH        ret  relative return index 0–100 (NOT money)
// residue  biomass returned to soil 0–3      nfix  fixes nitrogen      paddy  flooded rice
// role     'crop' | 'manure' (green manure) | 'fallow'

export const CROPS = [
  { id: 'rice_aman', en: 'Aman rice', bn: 'আমন ধান', seasons: ['k2'], fam: 'Poaceae', days: 115, t: [22, 32], heat: 37, cold: 15, kc: 1.15, root: 1, drought: 2, waterlog: 3, salt: 2, ph: [4.5, 8], ret: 62, residue: 2, paddy: true, role: 'crop' },
  { id: 'rice_boro', en: 'Boro rice', bn: 'বোরো ধান', seasons: ['rabi'], shift: 2, fam: 'Poaceae', days: 120, t: [16, 32], heat: 35, cold: 12, kc: 1.2, root: 1, drought: 1, waterlog: 3, salt: 1, ph: [4.5, 8], ret: 70, residue: 2, paddy: true, role: 'crop' },
  { id: 'rice_aus', en: 'Aus rice', bn: 'আউশ ধান', seasons: ['k1'], fam: 'Poaceae', days: 100, t: [22, 33], heat: 37, cold: 15, kc: 1.1, root: 1, drought: 2, waterlog: 2, salt: 1, ph: [4.5, 8], ret: 50, residue: 2, paddy: true, role: 'crop' },
  { id: 'wheat', en: 'Wheat', bn: 'গম', seasons: ['rabi'], fam: 'Poaceae', days: 110, t: [12, 25], heat: 32, cold: 0, kc: 0.8, root: 2, drought: 2, waterlog: 1, salt: 2, ph: [5.5, 8.5], ret: 56, residue: 2, role: 'crop' },
  { id: 'maize', en: 'Maize', bn: 'ভুট্টা', seasons: ['rabi', 'k1'], fam: 'Poaceae', days: 115, t: [15, 32], heat: 38, cold: 5, kc: 0.95, root: 3, drought: 2, waterlog: 1, salt: 1, ph: [5.5, 8], ret: 72, residue: 3, role: 'crop' },
  { id: 'barley', en: 'Barley', bn: 'যব', seasons: ['rabi'], fam: 'Poaceae', days: 100, t: [12, 24], heat: 31, cold: -2, kc: 0.75, root: 2, drought: 3, waterlog: 1, salt: 3, ph: [6, 8.5], ret: 44, residue: 2, role: 'crop' },
  { id: 'lentil', en: 'Lentil', bn: 'মসুর ডাল', seasons: ['rabi'], fam: 'Fabaceae', days: 105, t: [12, 25], heat: 32, cold: -2, kc: 0.75, root: 2, drought: 2, waterlog: 1, salt: 1, ph: [5.5, 8], ret: 62, residue: 1, nfix: true, role: 'crop' },
  { id: 'chickpea', en: 'Chickpea', bn: 'ছোলা', seasons: ['rabi'], fam: 'Fabaceae', days: 110, t: [12, 26], heat: 33, cold: -2, kc: 0.75, root: 3, drought: 3, waterlog: 1, salt: 1, ph: [6, 8.5], ret: 58, residue: 1, nfix: true, role: 'crop' },
  { id: 'grasspea', en: 'Grass pea (khesari)', bn: 'খেসারি ডাল', seasons: ['rabi'], fam: 'Fabaceae', days: 110, t: [12, 26], heat: 33, cold: -2, kc: 0.7, root: 2, drought: 3, waterlog: 2, salt: 2, ph: [5, 8.5], ret: 42, residue: 2, nfix: true, role: 'crop' },
  { id: 'mungbean', en: 'Mungbean', bn: 'মুগ ডাল', seasons: ['k1'], fam: 'Fabaceae', days: 65, t: [22, 34], heat: 40, cold: 12, kc: 0.8, root: 2, drought: 2, waterlog: 1, salt: 1, ph: [5.5, 8], ret: 58, residue: 1, nfix: true, role: 'crop' },
  { id: 'mustard', en: 'Mustard', bn: 'সরিষা', seasons: ['rabi'], fam: 'Brassicaceae', days: 85, t: [12, 25], heat: 30, cold: -2, kc: 0.8, root: 3, drought: 2, waterlog: 1, salt: 2, ph: [5.5, 8], ret: 58, residue: 1, role: 'crop' },
  { id: 'sunflower', en: 'Sunflower', bn: 'সূর্যমুখী', seasons: ['rabi'], fam: 'Asteraceae', days: 100, t: [15, 32], heat: 38, cold: 2, kc: 0.8, root: 3, drought: 3, waterlog: 1, salt: 3, ph: [6, 8], ret: 56, residue: 2, role: 'crop' },
  { id: 'potato', en: 'Potato', bn: 'আলু', seasons: ['rabi'], fam: 'Solanaceae', days: 90, t: [12, 22], heat: 29, cold: 0, kc: 0.9, root: 1, drought: 1, waterlog: 1, salt: 1, ph: [4.8, 7], ret: 82, residue: 1, role: 'crop' },
  { id: 'onion', en: 'Onion', bn: 'পেঁয়াজ', seasons: ['rabi'], fam: 'Amaryllidaceae', days: 110, t: [13, 27], heat: 35, cold: 0, kc: 0.85, root: 1, drought: 1, waterlog: 1, salt: 1, ph: [6, 7.5], ret: 85, residue: 0, role: 'crop' },
  { id: 'vegetables', en: 'Winter vegetables', bn: 'শীতকালীন সবজি', seasons: ['rabi'], fam: 'Solanaceae', days: 100, t: [14, 28], heat: 34, cold: 3, kc: 0.95, root: 2, drought: 1, waterlog: 1, salt: 1, ph: [5.5, 7.5], ret: 88, residue: 1, role: 'crop' },
  { id: 'groundnut', en: 'Groundnut', bn: 'চিনাবাদাম', seasons: ['rabi'], fam: 'Fabaceae', days: 120, t: [16, 32], heat: 38, cold: 5, kc: 0.85, root: 2, drought: 2, waterlog: 1, salt: 2, ph: [5.5, 7.5], ret: 66, residue: 1, nfix: true, role: 'crop', sandy: true },
  { id: 'sweet_potato', en: 'Sweet potato', bn: 'মিষ্টি আলু', seasons: ['rabi'], fam: 'Convolvulaceae', days: 115, t: [15, 32], heat: 38, cold: 5, kc: 0.85, root: 2, drought: 2, waterlog: 1, salt: 2, ph: [5, 7.5], ret: 56, residue: 2, role: 'crop' },
  { id: 'watermelon', en: 'Watermelon', bn: 'তরমুজ', seasons: ['rabi'], shift: 1, fam: 'Cucurbitaceae', days: 90, t: [19, 33], heat: 39, cold: 8, kc: 0.85, root: 2, drought: 2, waterlog: 1, salt: 2, ph: [5.5, 7.5], ret: 70, residue: 1, role: 'crop', sandy: true },
  { id: 'jute', en: 'Jute', bn: 'পাট', seasons: ['k1'], fam: 'Malvaceae', days: 115, t: [22, 35], heat: 42, cold: 12, kc: 1.0, root: 3, drought: 1, waterlog: 3, salt: 2, ph: [5, 7.5], ret: 56, residue: 3, role: 'crop' },
  { id: 'sesame', en: 'Sesame', bn: 'তিল', seasons: ['k1'], fam: 'Pedaliaceae', days: 85, t: [22, 35], heat: 40, cold: 12, kc: 0.75, root: 2, drought: 3, waterlog: 1, salt: 2, ph: [5.5, 8], ret: 60, residue: 1, role: 'crop' },
  { id: 'dhaincha', en: 'Dhaincha (green manure)', bn: 'ধৈঞ্চা (সবুজ সার)', seasons: ['k1'], fam: 'Fabaceae', days: 50, t: [20, 36], heat: 43, cold: 10, kc: 0.8, root: 3, drought: 2, waterlog: 3, salt: 3, ph: [4.5, 9], ret: 8, residue: 3, nfix: true, role: 'manure' },
  { id: 'fallow', en: 'Fallow (empty)', bn: 'পতিত (খালি)', seasons: ['k2', 'rabi', 'k1'], fam: 'none', days: 0, t: [-50, 60], heat: 99, cold: -99, kc: 0.3, root: 0, drought: 3, waterlog: 3, salt: 3, ph: [0, 14], ret: 0, residue: 0, role: 'fallow' },
];

export const CROP = Object.fromEntries(CROPS.map((c) => [c.id, c]));
export const cropName = (id, lang) => (CROP[id] ? CROP[id][lang] || CROP[id].en : id);

/** Crops a farmer might pick as "what I grow now", per season. */
export const cropsForSeason = (season) => CROPS.filter((c) => c.seasons.includes(season));
