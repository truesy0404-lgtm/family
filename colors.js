// 색 팔레트와 "잘 어울리는 색" 규칙 (깔끔한 캐주얼 기준)
export const GROUPS = ['무채색', '베이지·브라운', '블루', '그린', '레드·핑크·옐로'];

export const COLORS = [
  { id: 'white', name: '흰색', hex: '#f7f7f5', neutral: true, group: 0 },
  { id: 'cream', name: '크림', hex: '#efe6d2', neutral: true, group: 0 },
  { id: 'lightgray', name: '연회색', hex: '#d4d4d2', neutral: true, group: 0 },
  { id: 'gray', name: '회색', hex: '#9a9a9a', neutral: true, group: 0 },
  { id: 'charcoal', name: '차콜', hex: '#4a4a4d', neutral: true, group: 0 },
  { id: 'black', name: '검정', hex: '#222222', neutral: true, group: 0 },
  { id: 'oatmeal', name: '오트밀', hex: '#e3d6bd', neutral: true, group: 1 },
  { id: 'beige', name: '베이지', hex: '#d9c6a5', neutral: true, group: 1 },
  { id: 'stone', name: '스톤', hex: '#b9ad99', neutral: true, group: 1 },
  { id: 'camel', name: '카멜', hex: '#b98a56', neutral: false, group: 1 },
  { id: 'brown', name: '갈색', hex: '#7a5230', neutral: false, group: 1 },
  { id: 'darkbrown', name: '다크브라운', hex: '#3f2a1f', neutral: false, group: 1 },
  { id: 'rust', name: '러스트', hex: '#a4492a', neutral: false, group: 1 },
  { id: 'sky', name: '하늘색', hex: '#a9c9e8', neutral: false, group: 2 },
  { id: 'denim', name: '청색', hex: '#4b6fa5', neutral: false, group: 2 },
  { id: 'royal', name: '로열블루', hex: '#2f55a4', neutral: false, group: 2 },
  { id: 'navy', name: '네이비', hex: '#1f2f54', neutral: false, group: 2 },
  { id: 'teal', name: '청록', hex: '#2b6f73', neutral: false, group: 2 },
  { id: 'mint', name: '민트', hex: '#bfe0cf', neutral: false, group: 3 },
  { id: 'sage', name: '세이지', hex: '#a3b18a', neutral: false, group: 3 },
  { id: 'khaki', name: '카키', hex: '#8a8a5a', neutral: false, group: 3 },
  { id: 'olive', name: '올리브', hex: '#5f6b3a', neutral: false, group: 3 },
  { id: 'green', name: '초록', hex: '#3f8a5a', neutral: false, group: 3 },
  { id: 'forest', name: '포레스트', hex: '#234a37', neutral: false, group: 3 },
  { id: 'pink', name: '핑크', hex: '#e8a7b5', neutral: false, group: 4 },
  { id: 'lavender', name: '라벤더', hex: '#b9a6d6', neutral: false, group: 4 },
  { id: 'red', name: '빨강', hex: '#c0392b', neutral: false, group: 4 },
  { id: 'burgundy', name: '버건디', hex: '#7a2335', neutral: false, group: 4 },
  { id: 'plum', name: '플럼', hex: '#5a2a4a', neutral: false, group: 4 },
  { id: 'mustard', name: '머스터드', hex: '#d1a02b', neutral: false, group: 4 },
];

// 기본 14색끼리의 궁합표. 나머지 색은 BASES로 가까운 기본색의 규칙을 따른다.
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
  brown: ['beige', 'white', 'khaki', 'denim', 'olive', 'mustard', 'burgundy'],
  burgundy: ['white', 'gray', 'navy', 'beige', 'black', 'denim', 'brown'],
  mustard: ['navy', 'black', 'white', 'denim', 'gray', 'brown'],
  pink: ['white', 'gray', 'navy', 'beige', 'denim'],
};

const BASES = {
  cream: ['white', 'beige'], lightgray: ['gray', 'white'], charcoal: ['gray', 'black'],
  oatmeal: ['beige', 'white'], stone: ['beige', 'gray'], camel: ['brown', 'beige'],
  darkbrown: ['brown'], rust: ['brown', 'mustard'], royal: ['denim', 'navy'],
  teal: ['green', 'navy'], mint: ['sky', 'green'], sage: ['green', 'khaki'],
  forest: ['green', 'olive'], lavender: ['pink', 'sky'], red: ['burgundy'], plum: ['burgundy'],
};
const basesOf = (id) => BASES[id] || [id];

// 한쪽에만 적혀 있어도 양쪽으로 인정
const MATCH = {};
for (const c of Object.keys(PAIRS)) MATCH[c] = new Set();
for (const [a, list] of Object.entries(PAIRS)) {
  for (const b of list) { MATCH[a].add(b); MATCH[b].add(a); }
}

export const colorById = (id) => COLORS.find((c) => c.id === id);

/** 두 색의 궁합 점수: 2 잘 어울림 / 1 무난 / 0 비추천 */
export function colorScore(a, b) {
  if (a === b) return colorById(a)?.neutral ? 1.5 : 1;
  for (const x of basesOf(a)) for (const y of basesOf(b)) if (MATCH[x]?.has(y)) return 2;
  if (colorById(a)?.neutral || colorById(b)?.neutral) return 1;
  return 0;
}

/** 이 색과 잘 어울리는 색 목록 */
export function matchingColors(id) {
  return COLORS.filter((c) => c.id !== id && colorScore(id, c.id) >= 2).map((c) => c.id);
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
