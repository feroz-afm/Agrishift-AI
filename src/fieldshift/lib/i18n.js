// Bangla-first strings (English kept for judges and NGO staff).
import { cropName } from './crops.js';

const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
export const bnNum = (s) => String(s).replace(/[0-9]/g, (d) => BN_DIGITS[d]);
/** Format a number for the current language. */
export const num = (lang, x, dp = 0) => {
  if (x === null || x === undefined || Number.isNaN(x)) return '—';
  const isYear = Number.isInteger(x) && x >= 1900 && x <= 2100 && dp === 0; // years: no thousands separator
  const v = isYear ? String(x) : Number(x).toLocaleString('en-US', { maximumFractionDigits: dp, minimumFractionDigits: dp });
  return lang === 'bn' ? bnNum(v) : v;
};
export const signed = (lang, x, dp = 0) => (x > 0 ? '+' : x < 0 ? '−' : '±') + num(lang, Math.abs(x), dp);

export const MONTHS = {
  bn: ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export const doyLabel = (lang, doy) => {
  const d = new Date(Date.UTC(2021, 0, Math.round(doy)));
  return `${num(lang, d.getUTCDate())} ${MONTHS[lang][d.getUTCMonth()]}`;
};

const S = {
  appName: { bn: 'ফিল্ড শিফট', en: 'Field Shift' },
  tagline: { bn: 'নাসার স্যাটেলাইট তথ্যে বাংলাদেশের কৃষকের ফসল-চক্র পরিকল্পনা', en: 'Crop-rotation planning for Bangladeshi farmers with NASA satellite data' },
  navField: { bn: 'মাঠ', en: 'Field' },
  navPlan: { bn: 'ফসল-চক্র', en: 'Rotations' },
  navMap: { bn: 'মানচিত্র', en: 'Map' },
  navAsk: { bn: 'জিজ্ঞাসা', en: 'Ask' },
  navData: { bn: 'তথ্য', en: 'Data' },
  start: { bn: 'শুরু করুন', en: 'Get started' },
  next: { bn: 'পরবর্তী', en: 'Next' },
  back: { bn: 'পেছনে', en: 'Back' },
  save: { bn: 'সংরক্ষণ করুন', en: 'Save' },
  language: { bn: 'ভাষা', en: 'Language' },
  whereFarm: { bn: 'আপনার জমি কোথায়?', en: 'Where is your field?' },
  district: { bn: 'জেলা', en: 'District' },
  useGps: { bn: 'আমার অবস্থান (GPS)', en: 'Use my location (GPS)' },
  tapMap: { bn: 'অথবা মানচিত্রে জমির উপর ট্যাপ করুন', en: 'Or tap your field on the map' },
  outsideBd: { bn: 'এই স্থানটি বাংলাদেশের বাইরে। বাংলাদেশের ভেতরে একটি জমি বেছে নিন।', en: 'That point is outside Bangladesh. Pick a field inside Bangladesh.' },
  gpsFail: { bn: 'অবস্থান পাওয়া যায়নি। জেলা বেছে নিন বা মানচিত্রে ট্যাপ করুন।', en: 'Could not get your location. Pick a district or tap the map.' },
  aboutFarm: { bn: 'আপনার জমি সম্পর্কে', en: 'About your field' },
  fieldName: { bn: 'জমির নাম', en: 'Field name' },
  fieldNameDefault: { bn: 'আমার জমি', en: 'My field' },
  area: { bn: 'আয়তন (বিঘা)', en: 'Area (bigha)' },
  nowGrow: { bn: 'এখন কী চাষ করেন?', en: 'What do you grow now?' },
  irrigation: { bn: 'সেচের সুবিধা', en: 'Irrigation' },
  irr_none: { bn: 'সেচ নেই (বৃষ্টিনির্ভর)', en: 'None (rain-fed)' },
  irr_limited: { bn: 'সীমিত (ভাগের নলকূপ)', en: 'Limited (shared tube-well)' },
  irr_full: { bn: 'পর্যাপ্ত সেচ', en: 'Full irrigation' },
  priorities: { bn: 'আপনার কাছে কোনটা সবচেয়ে জরুরি?', en: 'What matters most to you?' },
  p_soil: { bn: 'মাটির স্বাস্থ্য', en: 'Soil health' },
  p_water: { bn: 'পানি সাশ্রয়', en: 'Save water' },
  p_profit: { bn: 'লাভ', en: 'Profit' },
  p_risk: { bn: 'কম ঝুঁকি', en: 'Low risk' },
  saline: { bn: 'জমিতে লবণাক্ততা আছে', en: 'My soil is salty' },
  zone_saline: { bn: 'উপকূলীয় লবণাক্ত এলাকা', en: 'Coastal saline zone' },
  zone_haor: { bn: 'হাওর (আগাম বন্যা)', en: 'Haor (flash floods)' },
  zone_barind: { bn: 'বরেন্দ্র (খরা)', en: 'Barind (drought)' },
  zone_flood: { bn: 'নদী/চর বন্যা এলাকা', en: 'River / char flood zone' },
  zone_hill: { bn: 'পাহাড়ি এলাকা', en: 'Hill tracts' },
  zone_cold: { bn: 'উত্তরের শীতপ্রবণ এলাকা', en: 'Northern cold zone' },
  loading: { bn: 'নাসার স্যাটেলাইট থেকে তথ্য আনা হচ্ছে…', en: 'Fetching NASA satellite data…' },
  loadingSub: { bn: '২০০১ থেকে আজ পর্যন্ত প্রতিদিনের আবহাওয়া, মাটির আর্দ্রতা আর সবুজতা', en: 'Daily weather, soil moisture and greenness since 2001' },
  offline: { bn: 'অফলাইন — সংরক্ষিত তথ্য দেখানো হচ্ছে', en: 'Offline — showing saved data' },
  loadFail: { bn: 'নাসার তথ্য আনা যায়নি', en: 'Could not load NASA data' },
  retry: { bn: 'আবার চেষ্টা করুন', en: 'Try again' },
  updated: { bn: 'হালনাগাদ', en: 'Updated' },
  fieldHealth: { bn: 'মাঠের স্বাস্থ্য', en: 'Field health' },
  ndvi: { bn: 'সবুজতা (NDVI)', en: 'Greenness (NDVI)' },
  soilWet: { bn: 'মাটির আর্দ্রতা', en: 'Soil moisture' },
  et0: { bn: 'বাষ্পীভবন', en: 'Evaporation' },
  tmax: { bn: 'সর্বোচ্চ তাপ', en: 'Max temp' },
  windowRain: { bn: 'বর্ষার সময় সরে যাচ্ছে', en: 'Monsoon window drift' },
  windowSub: { bn: 'বর্ষা শুরু {s} দিন {dir}, মৌসুম {l} দিন {ldir}', en: 'Monsoon starts {s} days {dir}; season {l} days {ldir}' },
  later: { bn: 'দেরিতে', en: 'later' }, earlier: { bn: 'আগে', en: 'earlier' },
  longer: { bn: 'লম্বা', en: 'longer' }, shorter: { bn: 'ছোট', en: 'shorter' },
  noWindow: { bn: 'বর্ষার শুরু নির্ণয়ের মতো যথেষ্ট তথ্য নেই', en: 'Not enough data to detect the monsoon window' },
  planNext: { bn: 'পরের ৩ মৌসুমের পরিকল্পনা', en: 'Plan the next 3 seasons' },
  alerts: { bn: 'সতর্কতা', en: 'Alerts' },
  noAlerts: { bn: 'এখন কোনো সতর্কতা নেই', en: 'No alerts right now' },
  trends: { bn: '২৫ বছরের জলবায়ু পরিবর্তন', en: '25 years of climate change' },
  onsetChart: { bn: 'প্রতি বছর বর্ষা শুরুর দিন', en: 'Monsoon start day each year' },
  heatChart: { bn: '৩৫°সে-এর বেশি গরম দিন / বছর', en: 'Days above 35 °C / year' },
  rainChart: { bn: 'বার্ষিক বৃষ্টিপাত (মিমি)', en: 'Annual rain (mm)' },
  ndviChart: { bn: 'জমির সবুজতা (MODIS, ৩ বছর)', en: 'Field greenness (MODIS, 3 years)' },
  heatDaysNow: { bn: 'এখন বছরে {n}টি অতি গরম দিন ({c} বেড়েছে)', en: '{n} very hot days a year now ({c} vs 2000s)' },
  rotTitle: { bn: 'ফসল-চক্র পরিকল্পনা', en: 'Rotation planner' },
  rotSub: { bn: '১২ মাস · আপনার অগ্রাধিকার অনুযায়ী সাজানো', en: '12 months · ranked by your priority' },
  today: { bn: 'আজকের জলবায়ু', en: "Today's climate" },
  y2040: { bn: '২০৪০ সালের জলবায়ু', en: '2040 climate' },
  futureNote: { bn: '২০৪০: তাপ {dT}°সে বেশি, বৃষ্টি {rf}% — ২০০১ থেকে নাসার তথ্যের প্রবণতা থেকে', en: '2040: {dT} °C warmer, rain {rf}% — trend from NASA data since 2001' },
  yourNow: { bn: 'আপনার বর্তমান চক্র', en: 'Your current rotation' },
  soil: { bn: 'মাটি', en: 'Soil' }, water: { bn: 'সেচ', en: 'Irrigation' }, ret: { bn: 'আয়', en: 'Return' }, risk: { bn: 'ঝুঁকি', en: 'Risk' },
  low: { bn: 'কম', en: 'Low' }, med: { bn: 'মাঝারি', en: 'Medium' }, high: { bn: 'বেশি', en: 'High' },
  why: { bn: 'কেন? বিস্তারিত', en: 'Why? Details' },
  choose: { bn: 'এই পরিকল্পনা বেছে নিন', en: 'Choose this plan' },
  chosen: { bn: 'বেছে নেওয়া হয়েছে ✓', en: 'Chosen ✓' },
  share: { bn: 'শেয়ার করুন', en: 'Share' },
  copied: { bn: 'কপি হয়েছে', en: 'Copied' },
  myPlan: { bn: 'আমার পরিকল্পনা', en: 'My plan' },
  vsNow: { bn: 'বর্তমানের তুলনায়', en: 'vs now' },
  irrigSave: { bn: 'সেচ {n} মিমি কম', en: '{n} mm less irrigation' },
  soilGain: { bn: 'মাটি {n} পয়েন্ট ভালো', en: 'Soil +{n} points' },
  noRot: { bn: 'এই অবস্থায় উপযুক্ত ফসল-চক্র পাওয়া যায়নি। সেচের সুবিধা পরিবর্তন করে দেখুন।', en: 'No rotation fits these conditions. Try changing irrigation.' },
  mapTitle: { bn: 'স্যাটেলাইট স্তর', en: 'Satellite layers' },
  mapNote: { bn: 'নাসার GIBS থেকে সাম্প্রতিক ছবি। ছবি আসতে কয়েক সেকেন্ড লাগতে পারে।', en: 'Recent imagery from NASA GIBS. Tiles can take a few seconds.' },
  askTitle: { bn: 'কৃষি সহকারীকে জিজ্ঞাসা করুন', en: 'Ask the farm assistant' },
  askHint: { bn: 'বাংলায় লিখুন বা মাইক চেপে বলুন', en: 'Type or tap the mic to speak' },
  askPlaceholder: { bn: 'যেমন: এবার কি বোরো ধান করব?', en: 'e.g. Should I grow Boro rice this year?' },
  speak: { bn: 'বলুন', en: 'Speak' }, listening: { bn: 'শুনছি…', en: 'Listening…' },
  readAloud: { bn: 'শুনুন', en: 'Listen' },
  send: { bn: 'পাঠান', en: 'Send' },
  dataTitle: { bn: 'তথ্যের উৎস ও সেটিংস', en: 'Data sources & settings' },
  editFarm: { bn: 'জমির তথ্য বদলান', en: 'Edit field' },
  refresh: { bn: 'নতুন করে তথ্য আনুন', en: 'Refresh NASA data' },
  install: { bn: 'ফোনে অ্যাপ হিসেবে ইনস্টল করুন', en: 'Install as an app' },
  installHelp: { bn: 'অ্যান্ড্রয়েড: Chrome মেনু ⋮ → "Add to Home screen"। আইফোন: Safari → শেয়ার → "Add to Home Screen"।', en: 'Android: Chrome menu ⋮ → "Add to Home screen". iPhone: Safari → Share → "Add to Home Screen".' },
  limits: { bn: 'সীমাবদ্ধতা', en: 'Limitations' },
  limitsText: {
    bn: 'NASA POWER-এর গ্রিড প্রায় ৫০ কিমি, তাই আবহাওয়ার মান পুরো এলাকার, একটি জমির নয়। SoilGrids মডেলভিত্তিক অনুমান, মাটি পরীক্ষার বিকল্প নয়। আয়ের সূচক আপেক্ষিক, টাকার হিসাব নয়। জাত ও সার সম্পর্কে উপজেলা কৃষি অফিসে নিশ্চিত হোন।',
    en: 'NASA POWER cells are ~50 km, so weather describes your area, not one field. SoilGrids is a modelled estimate, not a soil test. The return index is relative, not money. Confirm varieties and fertiliser with the Upazila agriculture office.',
  },
  reset: { bn: 'সব মুছে নতুন করে শুরু', en: 'Reset everything' },
  source: { bn: 'উৎস', en: 'Source' },
  soilProfile: { bn: 'মাটির বৈশিষ্ট্য (SoilGrids)', en: 'Soil profile (SoilGrids)' },
  clay: { bn: 'কাদা', en: 'Clay' }, sand: { bn: 'বালি', en: 'Sand' }, soc: { bn: 'জৈব কার্বন', en: 'Organic carbon' }, ph: { bn: 'পিএইচ', en: 'pH' },
  unknown: { bn: 'জানা নেই', en: 'Unknown' },
  season_k2: { bn: 'খরিফ-২ (আমন)', en: 'Kharif-2 (Aman)' },
  season_rabi: { bn: 'রবি (শীত)', en: 'Rabi (winter)' },
  season_k1: { bn: 'খরিফ-১ (গ্রীষ্ম)', en: 'Kharif-1 (summer)' },
  legendCereal: { bn: 'দানাশস্য', en: 'Cereal' }, legendLegume: { bn: 'ডাল (নাইট্রোজেন দেয়)', en: 'Legume (adds N)' }, legendOther: { bn: 'তেল/আঁশ/সবজি', en: 'Oil / fibre / veg' },
  demo: { bn: 'ডেমো তথ্য', en: 'Demo data' },
  demoNote: { bn: 'ইন্টারনেট নেই বলে নমুনা তথ্য দেখানো হচ্ছে — আসল তথ্য নয়', en: 'No internet: showing sample data — not real' },
  tryDemo: { bn: 'নমুনা তথ্য দিয়ে দেখুন', en: 'Explore with sample data' },
  demoFields: { bn: 'ডেমো জমি (আসল নাসা তথ্য)', en: 'Demo fields (real NASA data)' },
  demoFieldsSub: { bn: 'এক ট্যাপে সারিয়াকান্দির চর, কাহালু বা রাজশাহীর বরেন্দ্র দেখুন', en: 'One tap: Sariakandi char land, Kahaloo or Rajshahi Barind' },
  viaBackend: { bn: 'সার্ভার থেকে', en: 'via server' }, viaDirect: { bn: 'সরাসরি নাসা থেকে', en: 'direct from NASA' }, viaBundled: { bn: 'অ্যাপে সংরক্ষিত আসল তথ্য', en: 'real data bundled in app' },
  aiFree: { bn: 'প্রতিটি সংখ্যার উৎস দেখা যায় · কোনো ব্ল্যাক-বক্স AI নেই', en: 'Every number shows its source · no black-box AI' },
};

export function t(lang, key, vars) {
  const e = S[key];
  let s = e ? e[lang] || e.en : key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
  return s;
}

const ALERTS = {
  flash: {
    bn: (v) => ['আকস্মিক খরার সংকেত', `গত ২ সপ্তাহে মাটির আর্দ্রতা ${bnNum(v.drop)} পয়েন্ট কমেছে, বৃষ্টি স্বাভাবিকের অর্ধেকও না। ২–৩ দিনের মধ্যে সেচ দিন।`],
    en: (v) => ['Flash-drought signal', `Soil moisture fell ${v.drop} points in 2 weeks with less than half the normal rain. Irrigate within 2–3 days.`],
  },
  dry: {
    bn: (v) => ['মাটি শুকনো', `মাটির আর্দ্রতা এই সময়ের তুলনায় খুব কম (${bnNum(v.pct)} পার্সেন্টাইল)। সেচের প্রস্তুতি নিন।`],
    en: (v) => ['Dry soil', `Soil moisture is very low for this time of year (${v.pct}th percentile). Prepare to irrigate.`],
  },
  heat: {
    bn: (v) => ['তাপপ্রবাহ', `গত সপ্তাহে গড় সর্বোচ্চ তাপ ${bnNum(v.t)}°সে। ফুল আসার সময় হালকা সেচ দিন, দুপুরে কাজ এড়িয়ে চলুন।`],
    en: (v) => ['Heat wave', `Last week averaged ${v.t} °C max. Light irrigation at flowering; avoid midday field work.`],
  },
  flood: {
    bn: (v) => ['ভারী বৃষ্টি', `এক দিনে ${bnNum(v.mm)} মিমি বৃষ্টি হয়েছে। জমির পানি নিষ্কাশনের নালা খোলা রাখুন।`],
    en: (v) => ['Heavy rain', `${v.mm} mm fell in one day. Keep drainage channels open.`],
  },
  wet: {
    bn: (v) => ['স্বাভাবিকের চেয়ে বেশি বৃষ্টি', `গত ৩০ দিনে স্বাভাবিকের ${bnNum(v.pct)}% বৃষ্টি। জলাবদ্ধতা ও রোগের দিকে নজর রাখুন।`],
    en: (v) => ['Wetter than normal', `${v.pct}% of normal rain in 30 days. Watch for waterlogging and disease.`],
  },
  frost: {
    bn: (v) => ['শৈত্যপ্রবাহ', `রাতের তাপ ${bnNum(v.t)}°সে। বোরোর বীজতলা পলিথিনে ঢেকে রাখুন।`],
    en: (v) => ['Cold wave', `Night temperature ${v.t} °C. Cover Boro seedbeds with polythene.`],
  },
};
export const alertText = (lang, a) => ALERTS[a.id][lang](a.vars);

const monthsText = (lang, ms) => (ms?.length ? `${MONTHS[lang][ms[0]]}–${MONTHS[lang][ms[ms.length - 1]]}` : '');

/** One reason → one sentence. */
export function reasonText(lang, r) {
  const c = r.crop ? cropName(r.crop, lang) : '';
  const n = (x) => num(lang, x);
  const bn = lang === 'bn';
  switch (r.k) {
    case 'nfix': return bn ? `${c} বাতাস থেকে নাইট্রোজেন মাটিতে যোগ করে — ইউরিয়া কম লাগবে` : `${c} fixes nitrogen from the air — less urea needed`;
    case 'manure': return bn ? `${c} মাটিতে মিশিয়ে দিলে জৈব পদার্থ ও নাইট্রোজেন বাড়ে` : `${c} ploughed in adds organic matter and nitrogen`;
    case 'fallow': return bn ? 'জমি খালি থাকলে মাটির জৈব পদার্থ কমে, আগাছা বাড়ে' : 'Leaving land bare loses organic matter and invites weeds';
    case 'deep': return bn ? `${c}-এর গভীর শিকড় শক্ত স্তর ভাঙে, নিচের পুষ্টি তুলে আনে` : `${c}'s deep roots break the hard pan and recycle nutrients`;
    case 'families': return bn ? `${n(r.n)}টি আলাদা পরিবারের ফসল — পোকা ও রোগের চক্র ভাঙে` : `${r.n} different crop families break pest and disease cycles`;
    case 'samefam': return bn ? `${cropName(r.a, lang)} আর ${cropName(r.b, lang)} একই পরিবারের — রোগ-পোকা জমে থাকে` : `${cropName(r.a, lang)} and ${cropName(r.b, lang)} are the same family — pests carry over`;
    case 'ricerice': return bn ? 'বছরে দুইবার ধান: কাদা করা মাটির গঠন নষ্ট করে, পানি বেশি লাগে' : 'Two rice crops a year: puddling damages soil structure and uses much water';
    case 'irrig': return bn ? `পুরো বছরে আনুমানিক ${n(r.mm)} মিমি সেচ লাগবে (নাসার বৃষ্টি ও বাষ্পীভবন থেকে)` : `About ${r.mm} mm of irrigation a year (from NASA rain and evaporation)`;
    case 'short': return bn ? `${c}: আপনার সেচে ${n(r.mm)} মিমি পানি ঘাটতি থাকতে পারে` : `${c}: your irrigation may fall ${r.mm} mm short`;
    case 'heat': return bn ? `${c}: ${monthsText(lang, r.months)} সময়ে বছরে গড়ে ${n(r.days)} দিন ${n(r.t)}°সে-এর বেশি গরম (নাসার দৈনিক তথ্য)` : `${c}: ${r.days} days/yr above ${r.t} °C in ${monthsText(lang, r.months)} (NASA daily record)`;
    case 'cold': return bn ? `${c}: বছরে ${n(r.days)} রাত ${n(r.t)}°সে-এর নিচে ঠান্ডা` : `${c}: ${r.days} nights/yr below ${r.t} °C`;
    case 'waterlog': return bn ? `${c} জলাবদ্ধতা সহ্য করতে পারে না — ভারী বর্ষায় ক্ষতি হতে পারে` : `${c} cannot stand waterlogging in heavy rain months`;
    case 'ph': return bn ? `${c}: মাটির পিএইচ ${n(r.ph)} এই ফসলের জন্য উপযুক্ত নয় — চুন/জৈব সার বিবেচনা করুন` : `${c}: soil pH ${r.ph} is outside its range — consider lime or compost`;
    case 'salt': return bn ? `${c}: শুকনো মৌসুমে লবণাক্ততা ${r.sev === 1 ? 'বড়' : 'কিছুটা'} ঝুঁকি` : `${c}: dry-season salinity is a ${r.sev === 1 ? 'major' : 'moderate'} risk`;
    case 'flashflood': return bn ? (r.boro ? 'হাওরে এপ্রিলের আগাম বন্যা — আগাম জাতের বোরো লাগিয়ে এপ্রিলের মাঝামাঝির আগে কাটুন' : `${c}: এপ্রিল–মে মাসে হাওরে আগাম বন্যার ঝুঁকি`) : (r.boro ? 'Haor flash floods in April — plant early Boro and harvest before mid-April' : `${c}: haor flash-flood risk in April–May`);
    case 'groundwater': return bn ? `${c}: বরেন্দ্রে ভূগর্ভস্থ পানি নামছে — ${n(r.mm)} মিমি সেচ টেকসই নয়` : `${c}: Barind groundwater is falling — ${r.mm} mm irrigation is not sustainable`;
    case 'riverflood': return bn ? `${c}: বর্ষায় নদী/চরের বন্যায় ডুবে যেতে পারে` : `${c}: may drown in monsoon river floods`;
    case 'submerge': return bn ? 'বন্যাপ্রবণ এলাকা — জলমগ্নতা সহিষ্ণু আমন জাত বেছে নিন' : 'Flood-prone area — choose a submergence-tolerant Aman variety';
    case 'coldboro': return bn ? 'জানুয়ারির শৈত্যপ্রবাহে বোরোর চারা নষ্ট হতে পারে' : 'January cold waves can damage Boro seedlings';
    case 'lowsoc': return bn ? `মাটিতে জৈব কার্বন কম (${n(r.soc)} গ্রাম/কেজি) — ডাল ও সবুজ সার বেশি উপকার দেবে` : `Low soil organic carbon (${r.soc} g/kg) — legumes and green manure help most`;
    case 'misfit': return bn ? `${c} এই মৌসুমের আবহাওয়ার সাথে ভালো মেলে না` : `${c} is a poor fit for this season's climate`;
    default: return '';
  }
}

/** Variety & practice tips tied to hazards (well-known BRRI / BARI releases). */
export function tipFor(lang, k, crop) {
  if (k === 'heat' && crop && crop !== 'wheat') k = 'heatgen';
  const T = {
    salt: { bn: 'লবণসহিষ্ণু জাত: ব্রি ধান৬৭, বিনা ধান-১০ (বোরো); সূর্যমুখী, যব, তরমুজ লবণ ভালো সহ্য করে।', en: 'Salt-tolerant: BRRI dhan67, BINA dhan-10 (Boro); sunflower, barley and watermelon cope well.' },
    flashflood: { bn: 'আগাম বোরো জাত (যেমন ব্রি ধান৮৮, ব্রি ধান২৮) বেছে নিন; ৮০% পাকলেই কাটুন।', en: 'Pick early Boro (e.g. BRRI dhan88, BRRI dhan28); harvest at 80% maturity.' },
    submerge: { bn: 'জলমগ্নতা সহিষ্ণু আমন: ব্রি ধান৫২, ব্রি ধান৭৯ — ২ সপ্তাহ ডুবে থাকলেও টিকে থাকে।', en: 'Submergence-tolerant Aman: BRRI dhan52, BRRI dhan79 survive ~2 weeks under water.' },
    groundwater: { bn: 'বোরোর বদলে গম, ছোলা বা মসুর — ৪ ভাগের ১ ভাগ পানিতে হয়। খরাসহিষ্ণু আমন: ব্রি ধান৭১।', en: 'Swap Boro for wheat, chickpea or lentil — about a quarter of the water. Drought-tolerant Aman: BRRI dhan71.' },
    heat: { bn: 'তাপসহিষ্ণু গম: বারি গম-৩৩। আগাম বপন করুন যাতে দানা গরম আসার আগে পুষ্ট হয়।', en: 'Heat-tolerant wheat: BARI Gom-33. Sow early so grain fills before the heat.' },
    heatgen: { bn: 'আগাম রোপণ/বপন করুন যাতে ফুল আসার সময় তীব্র গরম এড়ানো যায়; ফুল আসার সময় জমিতে পানি রাখুন।', en: 'Plant early so flowering avoids peak heat; keep the field moist at flowering.' },
    coldboro: { bn: 'বীজতলা পলিথিনে ঢাকুন, সকালে শিশির ঝরিয়ে দিন।', en: 'Cover seedbeds with polythene and shake off morning dew.' },
  };
  return T[k] ? T[k][lang] : null;
}

export const zoneLabel = (lang, f) => t(lang, 'zone_' + f);
export const riskWord = (lang, v) => t(lang, v >= 55 ? 'high' : v >= 28 ? 'med' : 'low');
