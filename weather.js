import { bandForTemp } from './recommend.js';

const GEO_KEY = 'outfit.lastGeo';

function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('no geolocation'));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
      reject,
      { timeout: 8000, maximumAge: 3600000 },
    );
  });
}

/** Open-Meteo(무료, 키 불필요)로 오늘 날씨를 가져온다. 실패하면 throw */
export async function fetchWeather() {
  let pos;
  try {
    pos = await getPosition();
    try { localStorage.setItem(GEO_KEY, JSON.stringify(pos)); } catch {}
  } catch (e) {
    try { pos = JSON.parse(localStorage.getItem(GEO_KEY)); } catch {}
    if (!pos) throw e;
  }
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${pos.lat}&longitude=${pos.lon}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('weather ' + res.status);
  const d = (await res.json()).daily;
  const max = d.temperature_2m_max[0], min = d.temperature_2m_min[0];
  const avg = (max + min) / 2;
  return { max, min, avg, rain: d.precipitation_sum[0] >= 1, band: bandForTemp(avg) };
}
