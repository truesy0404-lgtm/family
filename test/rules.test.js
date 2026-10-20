import assert from 'node:assert/strict';
import { colorScore, matchingColors, nearestColor } from '../colors.js';
import { bandForTemp, pairsFor, outfitForToday } from '../recommend.js';

assert.equal(colorScore('white', 'navy'), 2);
assert.equal(colorScore('navy', 'white'), 2);          // 대칭
assert.equal(colorScore('pink', 'olive'), 0);          // 비추천 조합
assert.ok(matchingColors('white').includes('navy'));
assert.equal(nearestColor(250, 250, 248), 'white');
assert.equal(nearestColor(20, 20, 20), 'black');
assert.equal(bandForTemp(30), 'hot');
assert.equal(bandForTemp(15), 'cool');
assert.equal(bandForTemp(-3), 'freezing');

const items = [
  { id: 'p1', type: 'bottom', color: 'white', warmth: 2 },
  { id: 't1', type: 'top', color: 'navy', warmth: 2 },
  { id: 't2', type: 'top', color: 'pink', warmth: 2 },
  { id: 't3', type: 'top', color: 'olive', warmth: 1 },
  { id: 's1', type: 'shoes', color: 'black', warmth: 1 },
  { id: 'o1', type: 'outer', color: 'beige', warmth: 3 },
];
const pairs = pairsFor(items[0], items);
assert.ok(!('bottom' in pairs));
assert.ok(pairs.top[0].score >= pairs.top[2].score);   // 점수순 정렬

const cold = outfitForToday(items, 'freezing');
assert.equal(cold.outer.id, 'o1');                     // 추우면 겉옷 포함
const hot = outfitForToday(items, 'hot');
assert.equal(hot.outer, null);                         // 더우면 겉옷 없음
assert.equal(hot.top.id, 't3');                        // 얇은 상의만
console.log('OK');
