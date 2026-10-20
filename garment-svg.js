import { colorById } from './colors.js';

const SHAPES = {
  top: '<path d="M30 14 L42 9 Q50 18 58 9 L70 14 L90 32 L80 43 L71 37 L71 89 L29 89 L29 37 L20 43 L10 32 Z"/>',
  bottom: '<path d="M30 8 H70 L75 92 H54 L50 38 L46 92 H25 Z"/>',
  outer: '<path d="M28 12 L42 8 L50 17 L58 8 L72 12 L93 38 L93 82 L81 82 L75 48 L75 90 L25 90 L25 48 L19 82 L7 82 L7 38 Z"/><path d="M50 17 V90" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="2"/>',
  shoes: '<path d="M8 50 Q8 38 22 38 L38 38 Q44 54 68 57 Q94 59 94 72 L94 80 L8 80 Z"/><path d="M8 80 H94" stroke="rgba(0,0,0,.45)" stroke-width="5"/>',
};

/** 옷 그림 1개 (SVG 문자열). color: 팔레트 id 또는 hex */
export function garmentSVG(type, color, size = 72) {
  const hex = colorById(color)?.hex || color;
  return `<svg class="garment" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="${type}">` +
    `<g fill="${hex}" stroke="rgba(0,0,0,.28)" stroke-width="1.5" stroke-linejoin="round">${SHAPES[type]}</g></svg>`;
}
