import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { BD_BOUNDS } from './lib/districts.js';
import { GIBS_LAYERS, gibsUrl } from './lib/nasa-core.js';

const isoDaysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);

// Base maps: a normal street map and a sharp satellite photo (zoomable to field level).
const BASES = {
  map: { url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', opts: { maxZoom: 19, attribution: '© OpenStreetMap' } },
  satellite: { url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', opts: { maxZoom: 19, attribution: 'Imagery © Esri, Maxar, Earthstar Geographics' } },
};

// Field pin: a lime dot with a dark ring — visible on both street and satellite maps.
const PIN = L.divIcon({
  className: '',
  html: '<div style="width:22px;height:22px;border-radius:50%;background:#B8E35C;border:4px solid #0D1412;box-shadow:0 0 0 3px rgba(184,227,92,.45)"></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

/**
 * Leaflet map limited to Bangladesh.
 * base: 'map' | 'satellite'   layerId: NASA GIBS overlay id or null   onPick(lat, lon): tap to choose a field
 */
export default function MapBox({ lat, lon, zoom = 13, onPick, base = 'map', layerId = null, opacity = 0.65, tall, label, pinLabel }) {
  const el = useRef(null);
  const map = useRef(null);
  const baseLayer = useRef(null);
  const marker = useRef(null);
  const overlay = useRef(null);
  const pickRef = useRef(onPick);
  pickRef.current = onPick;

  // create the map once (React StrictMode mounts twice in dev, so every ref is reset on cleanup)
  useEffect(() => {
    const bounds = L.latLngBounds([BD_BOUNDS.south - 0.6, BD_BOUNDS.west - 0.6], [BD_BOUNDS.north + 0.6, BD_BOUNDS.east + 0.6]);
    const hasPoint = lat !== undefined && lat !== null;
    const m = L.map(el.current, { maxBounds: bounds, maxBoundsViscosity: 0.8, minZoom: 6, zoomControl: true })
      .setView(hasPoint ? [lat, lon] : [23.7, 90.35], hasPoint ? zoom : 7);
    m.on('click', (e) => pickRef.current && pickRef.current(e.latlng.lat, e.latlng.lng));
    map.current = m;
    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(el.current);
    setTimeout(() => m.invalidateSize(), 50);
    return () => {
      ro.disconnect();
      m.remove();
      map.current = null; baseLayer.current = null; marker.current = null; overlay.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // base map
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (baseLayer.current) m.removeLayer(baseLayer.current);
    const b = BASES[base] || BASES.map;
    baseLayer.current = L.tileLayer(b.url, b.opts).addTo(m);
    baseLayer.current.bringToBack();
  }, [base]);

  // field pin
  useEffect(() => {
    const m = map.current;
    if (!m || lat === undefined || lat === null) return;
    if (!marker.current) {
      marker.current = L.marker([lat, lon], { icon: PIN, keyboard: false, zIndexOffset: 1000 }).addTo(m);
      if (pinLabel) marker.current.bindTooltip(pinLabel, { permanent: true, direction: 'top', offset: [0, -12], className: 'fs-pin-label' });
    } else {
      marker.current.setLatLng([lat, lon]);
    }
    m.setView([lat, lon], Math.max(m.getZoom(), Math.min(zoom, 13)));
  }, [lat, lon]); // eslint-disable-line react-hooks/exhaustive-deps

  // NASA GIBS overlay (coarse: 250 m – 10 km), so zoom out to where it is readable
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    if (overlay.current) { m.removeLayer(overlay.current); overlay.current = null; }
    const l = GIBS_LAYERS.find((x) => x.id === layerId);
    if (!l) return;
    overlay.current = L.tileLayer(gibsUrl(l, isoDaysAgo(l.lag)), {
      maxNativeZoom: l.maxZoom, maxZoom: 19, opacity, attribution: 'NASA GIBS · ' + l.src,
    }).addTo(m);
    if (m.getZoom() > l.maxZoom + 2) m.setZoom(l.maxZoom + 2);
  }, [layerId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { if (overlay.current) overlay.current.setOpacity(opacity); }, [opacity]);

  return <div ref={el} className={'mapbox' + (tall ? ' tall' : '')} role="region" aria-label={label || 'Map'} />;
}
