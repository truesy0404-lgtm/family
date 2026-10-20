import { colorById } from './colors.js';

const SKIN = '#e9c3a3', HAIR = '#1e1b1a', LINE = 'rgba(0,0,0,.28)';
const hex = (c) => colorById(c)?.hex || c;

/**
 * 남편 캐릭터가 코디를 입은 전신 그림 (SVG 문자열).
 * o: { outer?, inner, bottom, shoes } 색 id. outer가 없으면 반팔 티셔츠만 입은 모습.
 */
export function manSVG(o, width = 150) {
  const inner = hex(o.inner), bottom = hex(o.bottom), shoes = hex(o.shoes);
  const outer = o.outer ? hex(o.outer) : null;
  const s = `stroke="${LINE}" stroke-width="1" stroke-linejoin="round"`;

  const arms = outer ? '' :
    `<path d="M54 112 Q44 170 48 236 L62 238 Q62 180 68 120Z" fill="${SKIN}" ${s}/>
     <path d="M146 112 Q156 170 152 236 L138 238 Q138 180 132 120Z" fill="${SKIN}" ${s}/>
     <ellipse cx="55" cy="243" rx="7" ry="8" fill="${SKIN}" ${s}/><ellipse cx="145" cy="243" rx="7" ry="8" fill="${SKIN}" ${s}/>`;
  const tee = `<path d="M70 98 Q100 90 130 98 L134 228 L66 228 Z" fill="${inner}" ${s}/>` +
    (outer ? '' : `<path d="M70 98 L48 110 L54 142 L70 132Z" fill="${inner}" ${s}/><path d="M130 98 L152 110 L146 142 L130 132Z" fill="${inner}" ${s}/>`) +
    `<path d="M88 93 Q100 110 112 93 Z" fill="${SKIN}" ${s}/>`;
  const jacket = !outer ? '' :
    `<path d="M62 98 L46 108 Q36 150 38 205 L42 238 L62 236 L66 165 Z" fill="${outer}"/>
     <path d="M138 98 L154 108 Q164 150 162 205 L158 238 L138 236 L134 165 Z" fill="${outer}"/>
     <path d="M62 98 L84 93 L90 102 L88 240 L58 238 Z" fill="${outer}"/>
     <path d="M138 98 L116 93 L110 102 L112 240 L142 238 Z" fill="${outer}"/>
     <path d="M62 98 L46 108 Q36 150 38 205 L42 238 L58 238 L88 240 L90 102 L84 93Z M138 98 L154 108 Q164 150 162 205 L158 238 L142 238 L112 240 L110 102 L116 93Z" fill="none" ${s}/>
     <path d="M66 120 Q64 150 66 168 M134 120 Q136 150 134 168" fill="none" stroke="rgba(0,0,0,.2)"/>
     <path d="M84 93 L93 98 L89 114 L77 102Z" fill="${outer}" ${s}/><path d="M116 93 L107 98 L111 114 L123 102Z" fill="${outer}" ${s}/>
     <rect x="66" y="132" width="19" height="19" rx="2" fill="rgba(0,0,0,.14)" ${s}/><rect x="115" y="132" width="19" height="19" rx="2" fill="rgba(0,0,0,.14)" ${s}/>`;

  return `<svg class="man" viewBox="0 0 200 430" width="${width}" height="${Math.round(width * 430 / 200)}" role="img" aria-label="코디한 모습">
    <rect width="200" height="430" fill="#ddd3c4"/><rect y="372" width="200" height="58" fill="#c9c4bb"/>
    <polygon points="0,0 74,0 24,372 0,372" fill="#fff" opacity=".2"/><polygon points="150,0 200,0 200,372 176,372" fill="#fff" opacity=".12"/>
    <polygon points="30,372 150,372 200,430 56,430" fill="#fff" opacity=".2"/>
    <ellipse cx="100" cy="414" rx="66" ry="7" fill="rgba(0,0,0,.16)"/>
    <path d="M62 212 H138 L135 300 L131 392 H104 L101 262 L99 262 L96 392 H69 L65 300 Z" fill="${bottom}" ${s}/>
    <path d="M82 214 V390 M118 214 V390" fill="none" stroke="rgba(0,0,0,.2)"/>
    <path d="M68 390 H97 L98 406 Q98 414 88 414 H58 Q52 412 57 403 Q66 400 68 390Z" fill="${shoes}" ${s}/>
    <path d="M132 390 H103 L102 406 Q102 414 112 414 H142 Q148 412 143 403 Q134 400 132 390Z" fill="${shoes}" ${s}/>
    <path d="M54 412 H98 M102 412 H146" stroke="rgba(0,0,0,.5)" stroke-width="2"/>
    <rect x="92" y="74" width="16" height="22" fill="${SKIN}"/>
    ${arms}${tee}${jacket}
    <ellipse cx="77" cy="52" rx="4" ry="6" fill="${SKIN}" ${s}/><ellipse cx="123" cy="52" rx="4" ry="6" fill="${SKIN}" ${s}/>
    <ellipse cx="100" cy="50" rx="23" ry="28" fill="${SKIN}" ${s}/>
    <path d="M76 48 Q74 16 100 15 Q128 16 124 48 Q121 32 106 31 Q92 29 82 36 Q77 40 76 48Z" fill="${HAIR}"/>
    <circle cx="91" cy="52" r="1.7" fill="#2b2220"/><circle cx="109" cy="52" r="1.7" fill="#2b2220"/>
    <path d="M86 46 Q91 44 96 46 M104 46 Q109 44 114 46" fill="none" stroke="#2b2220" stroke-width="1.2"/>
    <path d="M94 66 Q100 70 106 66" fill="none" stroke="#a8665a" stroke-width="1.4" stroke-linecap="round"/>
  </svg>`;
}
