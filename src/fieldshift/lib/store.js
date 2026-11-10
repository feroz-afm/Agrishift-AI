// Tiny persistence helpers (localStorage). Wrapped in try/catch: storage can be full or blocked.
const PREFIX = 'fs-orbit:';

export function load(name, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + name);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function save(name, value) {
  try {
    localStorage.setItem(PREFIX + name, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function cacheGet(k) {
  return load('cache:' + k, null);
}

export function cacheSet(k, data) {
  const ok = save('cache:' + k, { savedAt: Date.now(), data });
  if (!ok) {
    // Storage full: drop old cached datasets and try once more.
    try {
      Object.keys(localStorage).filter((x) => x.startsWith(PREFIX + 'cache:')).forEach((x) => localStorage.removeItem(x));
    } catch { /* ignore */ }
    save('cache:' + k, { savedAt: Date.now(), data });
  }
}
