import { colorScore, colorById } from './colors.js';

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

// ---------- 색 조합 탭: 고른 색으로 남편 코디 만들기 ----------
const POOLS = {
  inner: ['white', 'cream', 'oatmeal', 'lightgray', 'gray', 'charcoal', 'black', 'beige', 'navy', 'sky', 'pink', 'denim', 'burgundy', 'olive', 'sage', 'mint', 'lavender', 'mustard'],
  outer: ['white', 'cream', 'oatmeal', 'lightgray', 'gray', 'charcoal', 'black', 'beige', 'stone', 'camel', 'brown', 'darkbrown', 'navy', 'denim', 'khaki', 'olive', 'forest', 'burgundy', 'plum', 'rust', 'sage'],
  bottom: ['black', 'charcoal', 'navy', 'denim', 'darkbrown', 'brown', 'khaki', 'beige', 'cream', 'white', 'gray', 'stone', 'camel', 'olive', 'forest', 'oatmeal', 'lightgray'],
  shoes: ['darkbrown'], // 사진 속 신발(다크브라운)은 바꾸지 않는다
};
const EARTH = new Set(['brown', 'darkbrown', 'camel', 'khaki', 'beige', 'stone', 'oatmeal', 'cream']);
const DARK = new Set(['black', 'charcoal', 'navy', 'gray']);
const CLASSIC = new Set(['black', 'charcoal', 'navy', 'denim', 'darkbrown', 'brown', 'khaki']);
const lum = (id) => {
  const h = colorById(id).hex;
  return (0.299 * parseInt(h.slice(1, 3), 16) + 0.587 * parseInt(h.slice(3, 5), 16) + 0.114 * parseInt(h.slice(5, 7), 16)) / 255;
};
const NEUTRAL = new Set(['white', 'cream', 'lightgray', 'gray', 'charcoal', 'black', 'oatmeal', 'beige', 'stone']);

/**
 * 고른 색(pick)을 role(inner/outer/bottom)에 넣고 나머지 칸을 어울리는 색으로 채운 코디 목록.
 * 반환: [{ outer?, inner, bottom, shoes }, ...] (색 id). rnd로 매번 다른 조합을 섞는다.
 */
export function outfitsForColor(pick, role, withOuter = true, count = 4, rnd = Math.random) {
  const slots = withOuter || role === 'outer' ? ['outer', 'inner', 'bottom', 'shoes'] : ['inner', 'bottom', 'shoes'];
  const free = slots.filter((s) => s !== role);
  const cands = free.map((s) => {
    const good = POOLS[s].filter((c) => c !== pick && colorScore(pick, c) >= 2);
    return good.length ? good : POOLS[s].filter((c) => c !== pick && colorScore(pick, c) >= 1);
  });

  const all = [];
  const walk = (i, cur) => {
    if (i === free.length) { all.push({ ...cur, [role]: pick }); return; }
    for (const c of cands[i]) walk(i + 1, { ...cur, [free[i]]: c });
  };
  walk(0, {});

  const scored = all.map((o) => {
    const ids = slots.map((s) => o[s]);
    let s = 0;
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) s += colorScore(ids[i], ids[j]);
    if (o.outer && o.outer === o.inner) s -= 2;
    if (o.outer && o.outer === o.bottom) s -= 0.5;
    if (o.inner === o.bottom && !NEUTRAL.has(o.inner)) s -= 1.5;
    if (CLASSIC.has(o.bottom)) s += 0.5;
    if (o.outer) s += 1.2 * Math.abs(lum(o.outer) - lum(o.inner)); // 겉옷과 상의는 밝기 차이가 있어야 예쁘다
    if (EARTH.has(o.bottom) && EARTH.has(o.shoes)) s += 0.6; // 브라운 하의 + 브라운 신발처럼 톤을 맞추면 가산점
    if (DARK.has(o.bottom) && DARK.has(o.shoes)) s += 0.4;
    return { o, s: s + rnd() * 0.8 };
  }).sort((a, b) => b.s - a.s);

  const maxShared = Math.max(1, free.length - 2);
  const out = [];
  for (const { o } of scored) {
    if (out.every((p) => free.filter((s) => p[s] === o[s]).length <= maxShared)) out.push(o);
    if (out.length >= count) break;
  }
  return out;
}
