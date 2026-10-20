// 색 팔레트와 "잘 어울리는 색" 규칙 (깔끔한 캐주얼 기준)
export const COLORS = [
  { id: 'white', name: '흰색', hex: '#f7f7f5', neutral: true },
  { id: 'black', name: '검정', hex: '#222222', neutral: true },
  { id: 'gray', name: '회색', hex: '#9a9a9a', neutral: true },
  { id: 'beige', name: '베이지', hex: '#d9c6a5', neutral: true },
  { id: 'navy', name: '네이비', hex: '#1f2f54', neutral: false },
  { id: 'denim', name: '청색', hex: '#4b6fa5', neutral: false },
  { id: 'sky', name: '하늘색', hex: '#a9c9e8', neutral: false },
  { id: 'khaki', name: '카키', hex: '#8a8a5a', neutral: false },
  { id: 'olive', name: '올리브', hex: '#5f6b3a', neutral: false },
  { id: 'green', name: '초록', hex: '#3f8a5a', neutral: false },
  { id: 'brown', name: '갈색', hex: '#7a5230', neutral: false },
  { id: 'burgundy', name: '버건디', hex: '#7a2335', neutral: false },
  { id: 'mustard', name: '머스터드', hex: '#d1a02b', neutral: false },
  { id: 'pink', name: '핑크', hex: '#e8a7b5', neutral: false },
];

const PAIRS = {
  white: ['navy', 'black', 'gray', 'beige', 'khaki', 'denim', 'olive', 'burgundy', 'brown', 'sky', 'green', 'pink', 'mustard'],
  black: ['white', 'gray', 'beige', 'denim', 'burgundy', 'mustard', 'olive', 'khaki', 'pink', 'green'],
  gray: ['white', 'black', 'navy', 'burgundy', 'denim', 'sky', 'pink', 'mustard'],
  beige: ['navy', 'white', 'brown', 'olive', 'black', 'denim', 'burgundy', 'khaki', 'sky'],
  navy: ['white', 'beige', 'gray', 'khaki', 'sky', 'burgundy', 'mustard', 'pink', 'green'],
  denim: ['white', 'black', 'gray', 'beige', 'khaki', 'mustard', 'burgundy', 'pink'],
  sky: ['white', 'navy', 'gray', 'beige', 'khaki'],
  khaki: ['white', 'navy', 'black', 'brown', 'beige', 'denim'],
  olive: ['white', 'beige', 'black', 'brown', 'khaki'],
  green: ['white', 'beige', 'navy', 'black', 'khaki'],
  brown: ['beige', 'white', 'khaki', 'denim', 'olive', 'mustard'],
  burgundy: ['white', 'gray', 'navy', 'beige', 'black', 'denim'],
  mustard: ['navy', 'black', 'white', 'denim', 'gray', 'brown'],
  pink: ['white', 'gray', 'navy', 'beige', 'denim'],
};

// 한쪽에만 적혀 있어도 양쪽으로 인정
const MATCH = {};
for (const c of COLORS) MATCH[c.id] = new Set();
for (const [a, list] of Object.entries(PAIRS)) {
  for (const b of list) { MATCH[a].add(b); MATCH[b].add(a); }
}

export const colorById = (id) => COLORS.find((c) => c.id === id);

/** 두 색의 궁합 점수: 2 잘 어울림 / 1 무난 / 0 비추천 */
export function colorScore(a, b) {
  if (MATCH[a]?.has(b)) return 2;
  if (a === b) return colorById(a)?.neutral ? 1.5 : 1;
  if (colorById(a)?.neutral || colorById(b)?.neutral) return 1;
  return 0;
}

/** 이 색과 잘 어울리는 색 목록 (좋은 순) */
export function matchingColors(id) {
  return COLORS.filter((c) => c.id !== id && MATCH[id]?.has(c.id)).map((c) => c.id);
}

/** RGB 값에서 가장 가까운 팔레트 색 */
export function nearestColor(r, g, b) {
  let best = COLORS[0], bestD = Infinity;
  for (const c of COLORS) {
    const cr = parseInt(c.hex.slice(1, 3), 16), cg = parseInt(c.hex.slice(3, 5), 16), cb = parseInt(c.hex.slice(5, 7), 16);
    const d = (r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2;
    if (d < bestD) { bestD = d; best = c; }
  }
  return best.id;
}
