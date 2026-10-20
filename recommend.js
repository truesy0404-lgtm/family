import { colorScore } from './colors.js';

export const TYPES = [
  { id: 'top', name: '상의' },
  { id: 'bottom', name: '하의' },
  { id: 'outer', name: '겉옷' },
  { id: 'shoes', name: '신발' },
];
export const WARMTH = [
  { id: 1, name: '얇음' },
  { id: 2, name: '보통' },
  { id: 3, name: '두꺼움' },
];

// 날씨 구간 → 필요한 두께/겉옷
export const BANDS = [
  { id: 'hot', name: '더움', icon: '☀️', topWarmth: [1], outer: false },
  { id: 'warm', name: '따뜻함', icon: '🌤️', topWarmth: [1, 2], outer: false },
  { id: 'cool', name: '선선함', icon: '🍂', topWarmth: [2], outer: 'light' },
  { id: 'cold', name: '쌀쌀함', icon: '🧥', topWarmth: [2, 3], outer: true },
  { id: 'freezing', name: '추움', icon: '❄️', topWarmth: [3], outer: true },
];

export function bandForTemp(t) {
  if (t >= 26) return 'hot';
  if (t >= 20) return 'warm';
  if (t >= 12) return 'cool';
  if (t >= 5) return 'cold';
  return 'freezing';
}

/** 선택한 옷과 다른 종류 옷을 색 궁합순으로 정렬 */
export function pairsFor(base, items, perType = 3) {
  const out = {};
  for (const t of TYPES) {
    if (t.id === base.type) continue;
    out[t.id] = items
      .filter((i) => i.type === t.id && i.id !== base.id)
      .map((i) => ({ item: i, score: colorScore(base.color, i.color) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, perType);
  }
  return out;
}

const pick = (arr, rnd) => arr[Math.floor(rnd() * arr.length)];

/** 오늘 날씨에 맞는 코디 1개 (옷장 안에서). 없는 종류는 null */
export function outfitForToday(items, bandId, rnd = Math.random, rain = false) {
  const band = BANDS.find((b) => b.id === bandId) || BANDS[2];
  const of = (type) => items.filter((i) => i.type === type);
  let tops = of('top').filter((i) => band.topWarmth.includes(i.warmth));
  if (!tops.length) tops = of('top');
  const bottoms = of('bottom');
  let outers = [];
  if (band.outer) {
    outers = of('outer');
    if (band.outer === 'light') outers = outers.filter((i) => i.warmth <= 2).length ? outers.filter((i) => i.warmth <= 2) : outers;
  }
  const shoes = of('shoes');

  const cand = (arr) => (arr.length ? arr : [null]);
  let best = null, bestScore = -1;
  for (let n = 0; n < 80; n++) {
    const o = { top: pick(cand(tops), rnd), bottom: pick(cand(bottoms), rnd), outer: pick(cand(outers), rnd), shoes: pick(cand(shoes), rnd) };
    const parts = Object.values(o).filter(Boolean);
    let s = 0;
    for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) s += colorScore(parts[i].color, parts[j].color);
    s += rnd() * 0.5; // 같은 점수면 매번 다르게
    if (s > bestScore) { bestScore = s; best = o; }
  }
  return { ...best, band, rain };
}
