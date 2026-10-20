import { colorById } from './colors.js';

// 사진 속 네 구역(겉옷·상의·하의·신발)의 원래 평균 밝기. 주름/그림자 질감을 살리는 기준값.
const SETS = {
  jacket: { photo: 'assets/man.jpg', mask: 'assets/man-mask.png', avg: { outer: 0.2498, inner: 0.8662, bottom: 0.3166, shoes: 0.2816 } },
  plain: { photo: 'assets/man2.jpg', mask: 'assets/man2-mask.png', avg: { outer: 1, inner: 0.9223, bottom: 0.3174, shoes: 0.2773 } }, // 겉옷 벗은 사진
};
const REGIONS = ['outer', 'inner', 'bottom', 'shoes'];

const loading = {};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('image ' + src));
    img.src = src;
  });
}

const pixels = (img, y0, h) => {
  const c = document.createElement('canvas');
  c.width = img.width; c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, -y0);
  return ctx.getImageData(0, 0, img.width, h).data;
};

// 사진과 구역 마스크를 한 번만 읽어 둔다. (마스크: 위쪽 절반 R/G/B = 겉옷/상의/하의, 아래쪽 절반 R = 신발)
function load(set) {
  if (!loading[set]) {
    loading[set] = Promise.all([loadImage(SETS[set].photo), loadImage(SETS[set].mask)]).then(([photo, mask]) => {
      const w = photo.width, h = photo.height;
      const orig = pixels(photo, 0, h);
      const top = pixels(mask, 0, h), bot = pixels(mask, h, h);
      const weights = { outer: new Float32Array(w * h), inner: new Float32Array(w * h), bottom: new Float32Array(w * h), shoes: new Float32Array(w * h) };
      const hit = [];
      for (let i = 0; i < w * h; i++) {
        weights.outer[i] = top[i * 4] / 255;
        weights.inner[i] = top[i * 4 + 1] / 255;
        weights.bottom[i] = top[i * 4 + 2] / 255;
        weights.shoes[i] = bot[i * 4] / 255;
        if (weights.outer[i] > 0.004 || weights.inner[i] > 0.004 || weights.bottom[i] > 0.004 || weights.shoes[i] > 0.004) hit.push(i);
      }
      return { w, h, orig, weights, hit: Uint32Array.from(hit) };
    });
    loading[set].catch(() => { delete loading[set]; });
  }
  return loading[set];
}

const rgb = (id) => {
  const h = colorById(id).hex;
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
};

/** 사진 속 남편이 입은 옷 색만 o({outer?,inner,bottom,shoes})의 색으로 바꿔 canvas에 그린다. outer가 없으면 겉옷 벗은 사진. */
export async function paintMan(canvas, o) {
  const set = o.outer ? 'jacket' : 'plain';
  const AVG = SETS[set].avg;
  const { w, h, orig, weights, hit } = await load(set);
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const out = ctx.createImageData(w, h);
  out.data.set(orig);
  const target = {};
  for (const k of REGIONS) if (o[k]) target[k] = rgb(o[k]);
  for (const i of hit) {
    const p = i * 4;
    const r = orig[p], g = orig[p + 1], b = orig[p + 2];
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    let R = r, G = g, B = b;
    for (const k of REGIONS) {
      const wgt = weights[k][i];
      if (wgt < 0.004 || !target[k]) continue;
      const ratio = 1 + (lum / AVG[k] - 1) * 0.6, t = target[k]; // 주름·그림자는 살리되 밝은 색에서 얼룩지지 않게 완화
      R = R * (1 - wgt) + Math.min(255, t[0] * ratio) * wgt;
      G = G * (1 - wgt) + Math.min(255, t[1] * ratio) * wgt;
      B = B * (1 - wgt) + Math.min(255, t[2] * ratio) * wgt;
    }
    out.data[p] = R; out.data[p + 1] = G; out.data[p + 2] = B;
  }
  ctx.putImageData(out, 0, 0);
}
