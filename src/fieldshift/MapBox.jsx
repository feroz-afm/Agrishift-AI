import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BD_BOUNDS } from './lib/districts.js';
import { GIBS_LAYERS, gibsUrl } from './lib/nasa-core.js';

const isoDaysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);

/** Leaflet map limited to Bangladesh. Optional NASA GIBS overlay and tap-to-pick. */
export default function MapBox({ lat, lon, zoom = 9, onPick, layerId, opacity = 0.75, tall, label }) {
  const el = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const overlay = useRef(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;

  useEffect(() => {
    const bounds = L.latLngBounds([BD_BOUNDS.south - 0.6, BD_BOUNDS.west - 0.6], [BD_BOUNDS.north + 0.6, BD_BOUNDS.east + 0.6]);
    const m = L.map(el.current, { maxBounds: bounds, minZoom: 6, zoomControl: true, attributionControl: true })
      .setView([lat || 23.7, lon || 90.35], lat ? zoom : 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap' }).addTo(m);
    m.on('click', (e) => pickRef.current && pickRef.current(e.latlng.lat, e.latlng.lng));
    map.current = m;
    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(el.current);
    return () => { ro.disconnect(); m.remove(); };
  }, []);

  useEffect(() => {
    const m = map.current;
    if (!m || lat === undefined || lat === null) return;
    if (!marker.current) {
      marker.current = L.circleMarker([lat, lon], { radius: 9, color: '#0D1412', weight: 3, fillColor: '#B8E35C', fillOpacity: 1 }).addTo(m);
    } else marker.current.setLatLng([lat, lon]);
    m.setView([lat, lon], Math.max(m.getZoom(), zoom));
  }, [lat, lon]);

  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (overlay.current) { m.removeLayer(overlay.current); overlay.current = null; }
    const l = GIBS_LAYERS.find((x) => x.id === layerId);
    if (!l) return;
    overlay.current = L.tileLayer(gibsUrl(l, isoDaysAgo(l.lag)), {
      maxNativeZoom: l.maxZoom, maxZoom: 18, opacity, attribution: 'NASA GIBS · ' + l.src, crossOrigin: true,
    }).addTo(m);
  }, [layerId, opacity]);

  return <div ref={el} className={'mapbox' + (tall ? ' tall' : '')} role="region" aria-label={label || 'Map'} />;
}
