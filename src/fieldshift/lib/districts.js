// 64 districts of Bangladesh: approximate centre point and the main farming hazard zones.
// Hazard flags: saline (coastal salinity), haor (pre-monsoon flash floods), barind (drought,
// deep groundwater), flood (river / char flooding), hill (hill tracts), cold (north-west winter cold).
const D = (id, en, bn, div, lat, lon, flags = []) => ({ id, en, bn, div, lat, lon, flags });

export const DISTRICTS = [
  D('dhaka', 'Dhaka', 'ঢাকা', 'dhaka', 23.81, 90.41),
  D('gazipur', 'Gazipur', 'গাজীপুর', 'dhaka', 24.0, 90.42),
  D('narayanganj', 'Narayanganj', 'নারায়ণগঞ্জ', 'dhaka', 23.62, 90.5),
  D('narsingdi', 'Narsingdi', 'নরসিংদী', 'dhaka', 23.92, 90.72),
  D('manikganj', 'Manikganj', 'মানিকগঞ্জ', 'dhaka', 23.86, 90.0, ['flood']),
  D('munshiganj', 'Munshiganj', 'মুন্সিগঞ্জ', 'dhaka', 23.54, 90.53, ['flood']),
  D('tangail', 'Tangail', 'টাঙ্গাইল', 'dhaka', 24.25, 89.92, ['flood']),
  D('kishoreganj', 'Kishoreganj', 'কিশোরগঞ্জ', 'dhaka', 24.43, 90.78, ['haor']),
  D('faridpur', 'Faridpur', 'ফরিদপুর', 'dhaka', 23.61, 89.84, ['flood']),
  D('rajbari', 'Rajbari', 'রাজবাড়ী', 'dhaka', 23.76, 89.64, ['flood']),
  D('madaripur', 'Madaripur', 'মাদারীপুর', 'dhaka', 23.17, 90.2, ['flood']),
  D('shariatpur', 'Shariatpur', 'শরীয়তপুর', 'dhaka', 23.21, 90.35, ['flood']),
  D('gopalganj', 'Gopalganj', 'গোপালগঞ্জ', 'dhaka', 23.01, 89.83, ['flood']),
  D('mymensingh', 'Mymensingh', 'ময়মনসিংহ', 'mymensingh', 24.75, 90.41),
  D('jamalpur', 'Jamalpur', 'জামালপুর', 'mymensingh', 24.92, 89.95, ['flood']),
  D('sherpur', 'Sherpur', 'শেরপুর', 'mymensingh', 25.02, 90.02),
  D('netrokona', 'Netrokona', 'নেত্রকোণা', 'mymensingh', 24.88, 90.73, ['haor']),
  D('chattogram', 'Chattogram', 'চট্টগ্রাম', 'chattogram', 22.36, 91.78, ['saline']),
  D('coxsbazar', "Cox's Bazar", 'কক্সবাজার', 'chattogram', 21.45, 92.01, ['saline']),
  D('cumilla', 'Cumilla', 'কুমিল্লা', 'chattogram', 23.46, 91.18),
  D('feni', 'Feni', 'ফেনী', 'chattogram', 23.02, 91.4, ['saline']),
  D('noakhali', 'Noakhali', 'নোয়াখালী', 'chattogram', 22.87, 91.1, ['saline']),
  D('lakshmipur', 'Lakshmipur', 'লক্ষ্মীপুর', 'chattogram', 22.94, 90.83, ['saline']),
  D('chandpur', 'Chandpur', 'চাঁদপুর', 'chattogram', 23.23, 90.67, ['flood']),
  D('brahmanbaria', 'Brahmanbaria', 'ব্রাহ্মণবাড়িয়া', 'chattogram', 23.96, 91.11, ['haor']),
  D('rangamati', 'Rangamati', 'রাঙ্গামাটি', 'chattogram', 22.65, 92.17, ['hill']),
  D('khagrachhari', 'Khagrachhari', 'খাগড়াছড়ি', 'chattogram', 23.12, 91.98, ['hill']),
  D('bandarban', 'Bandarban', 'বান্দরবান', 'chattogram', 22.2, 92.22, ['hill']),
  D('rajshahi', 'Rajshahi', 'রাজশাহী', 'rajshahi', 24.37, 88.6, ['barind']),
  D('naogaon', 'Naogaon', 'নওগাঁ', 'rajshahi', 24.8, 88.94, ['barind']),
  D('natore', 'Natore', 'নাটোর', 'rajshahi', 24.41, 89.0, ['barind']),
  D('chapainawabganj', 'Chapai Nawabganj', 'চাঁপাইনবাবগঞ্জ', 'rajshahi', 24.6, 88.27, ['barind']),
  D('bogura', 'Bogura', 'বগুড়া', 'rajshahi', 24.85, 89.37),
  D('joypurhat', 'Joypurhat', 'জয়পুরহাট', 'rajshahi', 25.1, 89.02, ['barind']),
  D('pabna', 'Pabna', 'পাবনা', 'rajshahi', 24.01, 89.24),
  D('sirajganj', 'Sirajganj', 'সিরাজগঞ্জ', 'rajshahi', 24.45, 89.7, ['flood']),
  D('rangpur', 'Rangpur', 'রংপুর', 'rangpur', 25.74, 89.25),
  D('dinajpur', 'Dinajpur', 'দিনাজপুর', 'rangpur', 25.63, 88.64, ['cold']),
  D('thakurgaon', 'Thakurgaon', 'ঠাকুরগাঁও', 'rangpur', 26.03, 88.46, ['cold']),
  D('panchagarh', 'Panchagarh', 'পঞ্চগড়', 'rangpur', 26.34, 88.55, ['cold']),
  D('nilphamari', 'Nilphamari', 'নীলফামারী', 'rangpur', 25.93, 88.86, ['cold']),
  D('lalmonirhat', 'Lalmonirhat', 'লালমনিরহাট', 'rangpur', 25.92, 89.45, ['flood']),
  D('kurigram', 'Kurigram', 'কুড়িগ্রাম', 'rangpur', 25.81, 89.64, ['flood']),
  D('gaibandha', 'Gaibandha', 'গাইবান্ধা', 'rangpur', 25.33, 89.53, ['flood']),
  D('khulna', 'Khulna', 'খুলনা', 'khulna', 22.82, 89.55, ['saline']),
  D('bagerhat', 'Bagerhat', 'বাগেরহাট', 'khulna', 22.65, 89.79, ['saline']),
  D('satkhira', 'Satkhira', 'সাতক্ষীরা', 'khulna', 22.72, 89.07, ['saline']),
  D('jashore', 'Jashore', 'যশোর', 'khulna', 23.17, 89.21),
  D('jhenaidah', 'Jhenaidah', 'ঝিনাইদহ', 'khulna', 23.54, 89.17),
  D('magura', 'Magura', 'মাগুরা', 'khulna', 23.49, 89.42),
  D('narail', 'Narail', 'নড়াইল', 'khulna', 23.17, 89.51),
  D('kushtia', 'Kushtia', 'কুষ্টিয়া', 'khulna', 23.9, 89.12),
  D('chuadanga', 'Chuadanga', 'চুয়াডাঙ্গা', 'khulna', 23.64, 88.84),
  D('meherpur', 'Meherpur', 'মেহেরপুর', 'khulna', 23.76, 88.63),
  D('barishal', 'Barishal', 'বরিশাল', 'barishal', 22.7, 90.37, ['saline']),
  D('bhola', 'Bhola', 'ভোলা', 'barishal', 22.69, 90.65, ['saline']),
  D('patuakhali', 'Patuakhali', 'পটুয়াখালী', 'barishal', 22.36, 90.33, ['saline']),
  D('barguna', 'Barguna', 'বরগুনা', 'barishal', 22.16, 90.12, ['saline']),
  D('pirojpur', 'Pirojpur', 'পিরোজপুর', 'barishal', 22.58, 89.97, ['saline']),
  D('jhalokati', 'Jhalokati', 'ঝালকাঠি', 'barishal', 22.64, 90.2, ['saline']),
  D('sylhet', 'Sylhet', 'সিলেট', 'sylhet', 24.9, 91.87, ['haor']),
  D('moulvibazar', 'Moulvibazar', 'মৌলভীবাজার', 'sylhet', 24.48, 91.77, ['haor']),
  D('habiganj', 'Habiganj', 'হবিগঞ্জ', 'sylhet', 24.37, 91.42, ['haor']),
  D('sunamganj', 'Sunamganj', 'সুনামগঞ্জ', 'sylhet', 25.07, 91.4, ['haor']),
];

export const DIVISIONS = {
  dhaka: { en: 'Dhaka', bn: 'ঢাকা' }, mymensingh: { en: 'Mymensingh', bn: 'ময়মনসিংহ' }, chattogram: { en: 'Chattogram', bn: 'চট্টগ্রাম' },
  rajshahi: { en: 'Rajshahi', bn: 'রাজশাহী' }, rangpur: { en: 'Rangpur', bn: 'রংপুর' }, khulna: { en: 'Khulna', bn: 'খুলনা' },
  barishal: { en: 'Barishal', bn: 'বরিশাল' }, sylhet: { en: 'Sylhet', bn: 'সিলেট' },
};

export const BD_BOUNDS = { south: 20.55, north: 26.65, west: 88.0, east: 92.7 };
export const inBangladesh = (lat, lon) => lat >= BD_BOUNDS.south && lat <= BD_BOUNDS.north && lon >= BD_BOUNDS.west && lon <= BD_BOUNDS.east;

/** Nearest district to a point (simple distance on the map). */
export function nearestDistrict(lat, lon) {
  let best = DISTRICTS[0], bd = Infinity;
  for (const d of DISTRICTS) {
    const x = (d.lat - lat) ** 2 + ((d.lon - lon) * Math.cos((lat * Math.PI) / 180)) ** 2;
    if (x < bd) { bd = x; best = d; }
  }
  return best;
}

export const DISTRICT = Object.fromEntries(DISTRICTS.map((d) => [d.id, d]));

/**
 * Ready-made demo fields for the hackathon video and judges.
 * Sariakandi: Jamuna char land (river floods, sandy soils). Kahaloo: western Bogura on the Barind
 * edge (dry season water stress). Rajshahi: Barind tract (drought, falling groundwater).
 * Coordinates are upazila centres — move the pin onto your exact field in the app.
 */
export const PRESETS = [
  { id: 'sariakandi', en: 'Sariakandi, Bogura', bn: 'সারিয়াকান্দি, বগুড়া', districtId: 'bogura', lat: 24.887, lon: 89.567, flags: ['flood'], current: ['rice_aman', 'maize', 'jute'], irrigation: 'limited' },
  { id: 'kahaloo', en: 'Kahaloo, Bogura', bn: 'কাহালু, বগুড়া', districtId: 'bogura', lat: 24.835, lon: 89.262, flags: ['barind'], current: ['rice_aman', 'rice_boro', 'fallow'], irrigation: 'full' },
  { id: 'rajshahi', en: 'Rajshahi (Barind)', bn: 'রাজশাহী (বরেন্দ্র)', districtId: 'rajshahi', lat: 24.37, lon: 88.6, flags: ['barind'], current: ['rice_aman', 'rice_boro', 'fallow'], irrigation: 'limited' },
];
export const PRESET = Object.fromEntries(PRESETS.map((p) => [p.id, p]));
