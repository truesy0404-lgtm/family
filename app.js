import { COLORS, GROUPS, colorById, nearestColor } from './colors.js';
import { TYPES, WARMTH, BANDS, pairsFor, outfitForToday, outfitsForColor } from './recommend.js';
import { manSVG } from './character-svg.js';
import { paintMan } from './man-photo.js';
import { fetchWeather } from './weather.js';
import { listItems, saveItem, deleteItem } from './db.js';

const view = document.getElementById('view');
const typeName = (id) => TYPES.find((t) => t.id === id).name;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const state = {
  tab: 'today', items: [], weather: null, weatherErr: false, band: null,
  closetFilter: 'all', pairBase: null, colorPick: 'burgundy', colorRole: 'inner', colorSeed: 0, outfit: null,
};

async function refreshItems() { state.items = await listItems(); }

function swatches(selected, attr) {
  return GROUPS.map((g, gi) => `<div class="sec">${g}</div><div class="row">` + COLORS.filter((c) => c.group === gi).map((c) =>
    `<div class="swatch-wrap"><button class="swatch ${selected === c.id ? 'on' : ''}" ${attr}="${c.id}" style="background:${c.hex}" aria-label="${c.name}"></button>${c.name}</div>`).join('') + '</div>').join('');
}

function slotHTML(type, item) {
  const label = typeName(type);
  const photo = item ? `<img src="${item.photo}" alt="${label}">` : `<span class="sub">없음</span>`;
  const dot = item ? `${colorById(item.color).name}` : '옷장에 추가해 주세요';
  return `<div class="slot"><div class="photo">${photo}</div><small>${label} · ${dot}</small></div>`;
}

// ---------- 오늘 ----------
function renderToday() {
  const w = state.weather;
  const band = BANDS.find((b) => b.id === state.band);
  const weatherLine = w
    ? `${band.icon} 오늘 ${Math.round(w.min)}° ~ ${Math.round(w.max)}° · ${band.name}${w.rain ? ' · 비 예보 ☔' : ''}`
    : state.weatherErr ? '날씨를 못 가져왔어요. 아래에서 직접 골라 주세요.' : '날씨 확인 중…';
  const bandChips = BANDS.map((b) => `<button class="chip ${state.band === b.id ? 'on' : ''}" data-band="${b.id}">${b.icon} ${b.name}</button>`).join('');
  let body;
  if (!state.items.length) {
    body = `<div class="empty">아직 옷장이 비어 있어요.<br>먼저 옷을 찍어서 저장해 주세요.<br><br><button class="btn" data-go="closet">옷장에 옷 추가</button></div>`;
  } else if (!state.outfit) {
    body = '';
  } else {
    const o = state.outfit;
    body = `<div class="card"><div class="outfit">${TYPES.filter((t) => t.id !== 'outer' || o.band.outer).map((t) => slotHTML(t.id, o[t.id])).join('')}</div>
      <button class="btn block" id="again" style="margin-top:12px">다시 추천</button></div>`;
  }
  view.innerHTML = `<h1>오늘 뭐 입지?</h1><div class="card"><div>${weatherLine}</div>
    <div class="row" style="margin-top:8px">${bandChips}</div></div>${body}`;
}

function pickOutfit() {
  state.outfit = state.band && state.items.length ? outfitForToday(state.items, state.band, Math.random, state.weather?.rain) : null;
}

async function loadWeather() {
  try {
    state.weather = await fetchWeather();
    state.band = state.weather.band;
  } catch {
    state.weatherErr = true;
    state.band = state.band || 'cool';
  }
  pickOutfit();
  if (state.tab === 'today') render();
}

// ---------- 옷장 ----------
function renderCloset() {
  const filters = [{ id: 'all', name: '전체' }, ...TYPES].map((t) => `<button class="chip ${state.closetFilter === t.id ? 'on' : ''}" data-filter="${t.id}">${t.name}</button>`).join('');
  const list = state.items.filter((i) => state.closetFilter === 'all' || i.type === state.closetFilter);
  const tiles = list.map((i) => `<div class="tile"><img src="${i.photo}" alt=""><span class="dot" style="background:${colorById(i.color).hex}"></span><button class="del" data-del="${i.id}" aria-label="삭제">✕</button></div>`).join('');
  view.innerHTML = `<h1>내 옷장 (${state.items.length})</h1>
    <button class="btn block" id="add">📷 옷 추가</button>
    <div class="row" style="margin:12px 0">${filters}</div>
    ${tiles ? `<div class="grid">${tiles}</div>` : '<div class="empty">옷이 없어요</div>'}`;
}

let draft = null;
function renderAddForm() {
  const d = draft;
  view.innerHTML = `<h1>옷 추가</h1><div class="card">
    <label>사진</label><input type="file" id="file" accept="image/*" capture="environment">
    ${d.photo ? `<img class="preview" src="${d.photo}" alt="">` : ''}
    <label>종류</label><div class="row">${TYPES.map((t) => `<button class="chip ${d.type === t.id ? 'on' : ''}" data-type="${t.id}">${t.name}</button>`).join('')}</div>
    <label>색 ${d.photo ? '<span class="sub">(자동으로 골랐어요. 틀리면 바꿔 주세요)</span>' : ''}</label><div class="row">${swatches(d.color, 'data-color')}</div>
    <label>두께</label><div class="row">${WARMTH.map((w) => `<button class="chip ${d.warmth === w.id ? 'on' : ''}" data-warmth="${w.id}">${w.name}</button>`).join('')}</div>
    <div class="row" style="margin-top:16px"><button class="btn ghost" id="cancel">취소</button><button class="btn" id="save" ${d.photo ? '' : 'disabled'}>저장</button></div></div>`;
}

function shrinkPhoto(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const max = 800, s = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, c.width, c.height);
      // 가운데 영역의 평균색으로 대표색 추정
      const w = Math.max(1, Math.round(c.width * 0.3)), h = Math.max(1, Math.round(c.height * 0.3));
      const px = ctx.getImageData(Math.round((c.width - w) / 2), Math.round((c.height - h) / 2), w, h).data;
      let r = 0, g = 0, b = 0, n = 0;
      for (let i = 0; i < px.length; i += 4) { r += px[i]; g += px[i + 1]; b += px[i + 2]; n++; }
      URL.revokeObjectURL(url);
      resolve({ photo: c.toDataURL('image/jpeg', 0.8), color: nearestColor(r / n, g / n, b / n) });
    };
    img.onerror = () => reject(new Error('image'));
    img.src = url;
  });
}

// ---------- 짝 찾기 ----------
function renderPair() {
  if (!state.items.length) {
    view.innerHTML = `<h1>이 옷이랑 뭐 입지?</h1><div class="empty">옷장에 옷을 먼저 추가해 주세요.<br><br><button class="btn" data-go="closet">옷장으로</button></div>`;
    return;
  }
  const tiles = state.items.map((i) => `<button class="tile ${state.pairBase === i.id ? 'on' : ''}" data-pair="${i.id}"><img src="${i.photo}" alt=""><span class="dot" style="background:${colorById(i.color).hex}"></span></button>`).join('');
  let result = '<p class="sub">기준이 될 옷을 눌러 보세요 (예: 흰 바지)</p>';
  const base = state.items.find((i) => i.id === state.pairBase);
  if (base) {
    const recs = pairsFor(base, state.items);
    result = Object.entries(recs).map(([type, list]) => `<div class="sec">${typeName(type)}</div>` +
      (list.length ? `<div class="grid">${list.map(({ item, score }) => `<div class="tile"><img src="${item.photo}" alt=""><span class="dot" style="background:${colorById(item.color).hex}"></span></div>`).join('')}</div>` : '<div class="sub">옷장에 없어요</div>')).join('');
  }
  view.innerHTML = `<h1>이 옷이랑 뭐 입지?</h1><div class="grid">${tiles}</div>${result}`;
}

// ---------- 색 조합 ----------
function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const ROLES = [{ id: 'inner', name: '상의' }, { id: 'bottom', name: '하의' }];
const SLOT_LABEL = { inner: '상의', outer: '겉옷', bottom: '하의', shoes: '신발' };

function outfitCard(o) {
  const order = ['inner', 'outer', 'bottom', 'shoes'].filter((k) => o[k]);
  return `<div class="outfit-card"><div class="frame"><i class="pin"></i><canvas class="man-photo" data-o='${JSON.stringify(o)}'></canvas></div>
    <div class="swatches">${order.map((k) => `<div class="sw"><span style="background:${colorById(o[k]).hex}"><i class="pin"></i></span><small>${SLOT_LABEL[k]}<br>${colorById(o[k]).name}</small></div>`).join('')}</div></div>`;
}

function renderColors() {
  const { colorPick: pick, colorRole: role } = state;
  const rnd = mulberry32(state.colorSeed * 9973 + pick.length * 31 + role.length);
  const outfits = outfitsForColor(pick, role, false, 4, rnd);
  view.innerHTML = `<h1>색 조합</h1><p class="sub">입고 싶은 색을 눌러 보세요</p>
    ${swatches(pick, 'data-pick')}
    <div class="row" style="margin:14px 0 6px"><span>이 색을</span>
      ${ROLES.map((r) => `<button class="chip ${role === r.id ? 'on' : ''}" data-role="${r.id}">${r.name}</button>`).join('')}</div>
    <h2>${colorById(pick).name}와 어울리는 코디</h2>
    <div class="board"><div class="board-grid">${outfits.map(outfitCard).join('') || '<div class="empty">추천이 없어요</div>'}</div></div>
    <button class="btn block" id="shuffle" style="margin-top:12px">다른 조합 보기</button>`;
  // 사진 속 옷 색 바꾸기. 실패하면 일러스트로 대신 보여 준다.
  view.querySelectorAll('canvas.man-photo').forEach((cv) => {
    const o = JSON.parse(cv.dataset.o);
    paintMan(cv, o).catch(() => { cv.outerHTML = manSVG(o, 150); });
  });
}

// ---------- 공통 ----------
function render() {
  document.querySelectorAll('#tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === state.tab));
  if (draft) return renderAddForm();
  ({ today: renderToday, closet: renderCloset, pair: renderPair, colors: renderColors })[state.tab]();
}

document.getElementById('tabs').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  draft = null; state.tab = b.dataset.tab; render();
});

view.addEventListener('click', async (e) => {
  const t = e.target.closest('button'); if (!t) return;
  const d = t.dataset;
  if (d.go) { state.tab = d.go; render(); }
  else if (d.band) { state.band = d.band; pickOutfit(); render(); }
  else if (t.id === 'again') { pickOutfit(); render(); }
  else if (d.filter) { state.closetFilter = d.filter; render(); }
  else if (t.id === 'add') { draft = { photo: null, type: 'top', color: 'white', warmth: 2 }; render(); }
  else if (d.type && draft) { draft.type = d.type; render(); }
  else if (d.color && draft) { draft.color = d.color; render(); }
  else if (d.warmth && draft) { draft.warmth = Number(d.warmth); render(); }
  else if (t.id === 'cancel') { draft = null; render(); }
  else if (t.id === 'save' && draft?.photo) {
    await saveItem({ id: crypto.randomUUID(), ...draft, createdAt: Date.now() });
    draft = null; await refreshItems(); pickOutfit(); render();
  }
  else if (d.del) {
    if (confirm('이 옷을 삭제할까요?')) { await deleteItem(d.del); await refreshItems(); pickOutfit(); render(); }
  }
  else if (d.pair) { state.pairBase = d.pair; render(); }
  else if (d.pick) { state.colorPick = d.pick; render(); }
  else if (d.role) { state.colorRole = d.role; render(); }
  else if (t.id === 'shuffle') { state.colorSeed++; render(); }
});

view.addEventListener('change', async (e) => {
  if (e.target.id !== 'file' || !e.target.files[0] || !draft) return;
  try {
    const { photo, color } = await shrinkPhoto(e.target.files[0]);
    draft.photo = photo; draft.color = color;
  } catch { alert('사진을 읽지 못했어요. 다시 시도해 주세요.'); }
  render();
});

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

(async () => {
  await refreshItems();
  render();
  loadWeather();
})();
